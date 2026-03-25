from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum
import decimal
from .models import Producto, Venta, DetalleVenta, GlobalConfig, Cliente, Abono, AuditLog
from .serializers import ProductoSerializer, VentaSerializer, GlobalConfigSerializer, ClienteSerializer, AbonoSerializer, AuditLogSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
import subprocess
import datetime

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            AuditLog.objects.create(usuario=user.username, accion='LOGIN', descripcion=f"Sesión iniciada")
            return Response({
                'token': str(refresh.access_token),
                'name': user.first_name if user.first_name else user.username,
                'role': 'admin' if user.is_superuser else 'cashier',
                'institution': 'UNEMI • TechPoint'
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

class BackupView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        AuditLog.objects.create(usuario=request.user.username, accion='BACKUP', descripcion="Respaldo DB")
        filename = f"backup_{datetime.datetime.now().strftime('%Y%m%d')}.sql"
        try:
            cmd = f"pg_dump -h db -U snayder pos_db"
            result = subprocess.check_output(cmd, shell=True, env={'PGPASSWORD': '123'})
            return HttpResponse(result, content_type='application/sql', headers={'Content-Disposition': f'attachment; filename="{filename}"'})
        except Exception as e: return Response({'error': str(e)}, status=500)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = AuditLog.objects.all().order_by('-fecha')
    serializer_class = AuditLogSerializer

class AbonoViewSet(viewsets.ModelViewSet):
    queryset = Abono.objects.all().order_by('-fecha')
    serializer_class = AbonoSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('nombre')
    serializer_class = ClienteSerializer

    @action(detail=True, methods=['get'])
    def estado_cuenta(self, request, pk=None):
        cliente = self.get_object()
        ventas = Venta.objects.filter(cliente=cliente, metodo_pago='CREDITO')
        abonos = Abono.objects.filter(venta__cliente=cliente)
        deuda = ventas.aggregate(Sum('saldo_pendiente'))['saldo_pendiente__sum'] or 0
        movimientos = []
        for v in ventas: movimientos.append({'tipo': 'CONSUMO', 'monto': v.total, 'fecha': v.fecha, 'descripcion': f"Venta #{v.id}"})
        for a in abonos: movimientos.append({'tipo': 'ABONO', 'monto': a.monto, 'fecha': a.fecha, 'descripcion': f"Pago Venta #{a.venta.id}"})
        movimientos.sort(key=lambda x: x['fecha'], reverse=True)
        return Response({
            'cliente': cliente.nombre, 
            'deuda_total': deuda, 
            'cupo_disponible': cliente.cupo_credito - deuda,
            'movimientos': movimientos
        })

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']: return [IsAdminUser()]
        return [permissions.IsAuthenticated()]

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha')
    serializer_class = VentaSerializer

    def create(self, request):
        items = request.data.get('items', [])
        total_venta = decimal.Decimal(str(request.data.get('total', 0)))
        cliente_id = request.data.get('cliente')
        metodo_pago = request.data.get('metodo_pago', 'EFECTIVO')

        try:
            with transaction.atomic():
                cliente = None
                if cliente_id:
                    # Bloqueamos el registro del cliente para evitar colisiones de crédito
                    cliente = Cliente.objects.select_for_update().get(id=cliente_id)

                # 🛡️ REFUERZO DE VALIDACIÓN DE CRÉDITO (RNF 4.1)
                if metodo_pago == 'CREDITO':
                    if not cliente:
                        return Response({'error': 'Venta a crédito requiere un cliente seleccionado.'}, status=400)
                    
                    # Suma de deuda actual DIRECTO en la base de datos para máxima precisión
                    deuda_actual = Venta.objects.filter(cliente=cliente).aggregate(Sum('saldo_pendiente'))['saldo_pendiente__sum'] or 0
                    cupo_disponible = cliente.cupo_credito - deuda_actual
                    
                    if total_venta > cupo_disponible:
                        return Response({
                            'error': f'Crédito insuficiente. Disponible: ${cupo_disponible:.2f}, Intento de compra: ${total_venta:.2f}'
                        }, status=400)

                # Crear Venta
                nueva_venta = Venta.objects.create(total=total_venta, cliente=cliente, metodo_pago=metodo_pago)

                for item in items:
                    producto = Producto.objects.select_for_update().get(id=item['id'])
                    cant = item.get('cantidad', 1)
                    if producto.stock < cant: raise Exception(f"Sin stock para {producto.nombre}")
                    producto.stock -= cant
                    producto.save()
                    DetalleVenta.objects.create(venta=nueva_venta, producto=producto, cantidad=cant, precio_unitario=producto.precio, costo_unitario=producto.precio_compra)

            return Response(self.get_serializer(nueva_venta).data, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class ConfigView(APIView):
    def get(self, request):
        config, _ = GlobalConfig.objects.get_or_create(pk=1)
        return Response(GlobalConfigSerializer(config).data)
    def post(self, request):
        if not request.user.is_superuser: return Response({'error': 'No autorizado'}, status=403)
        config = GlobalConfig.objects.get(pk=1)
        serializer = GlobalConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
