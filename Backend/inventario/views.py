from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum
from django.core.mail import send_mail # 👈 Nuevo
import decimal
from .models import Producto, Venta, DetalleVenta, GlobalConfig, Cliente, Abono, AuditLog
from .serializers import ProductoSerializer, VentaSerializer, GlobalConfigSerializer, ClienteSerializer, AbonoSerializer, AuditLogSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
import subprocess
import datetime

# 🔐 CLASE DE PERMISO PERSONALIZADA
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
                cliente = Cliente.objects.select_for_update().get(id=cliente_id) if cliente_id else None
                if metodo_pago == 'CREDITO':
                    if not cliente: return Response({'error': 'Cliente requerido para crédito.'}, status=400)
                    deuda_actual = Venta.objects.filter(cliente=cliente).aggregate(Sum('saldo_pendiente'))['saldo_pendiente__sum'] or 0
                    if total_venta > (cliente.cupo_credito - deuda_actual):
                        return Response({'error': 'Crédito insuficiente.'}, status=400)

                nueva_venta = Venta.objects.create(total=total_venta, cliente=cliente, metodo_pago=metodo_pago)
                productos_bajo_stock = []

                for item in items:
                    producto = Producto.objects.select_for_update().get(id=item['id'])
                    producto.stock -= item.get('cantidad', 1)
                    producto.save()
                    
                    # 👈 RF 3.4: Verificar Stock Crítico
                    if producto.stock <= producto.stock_minimo:
                        productos_bajo_stock.append(producto)

                    DetalleVenta.objects.create(venta=nueva_venta, producto=producto, cantidad=item.get('cantidad', 1), precio_unitario=producto.precio, costo_unitario=producto.precio_compra)

                # 👈 RF 3.4: Enviar Correo de Alerta
                if productos_bajo_stock:
                    self.enviar_alerta_stock(productos_bajo_stock)

            return Response(self.get_serializer(nueva_venta).data, status=201)
        except Exception as e: return Response({'error': str(e)}, status=400)

    def enviar_alerta_stock(self, productos):
        config = GlobalConfig.objects.get(pk=1)
        subject = f"⚠️ ALERTA DE STOCK CRÍTICO - {config.nombre_negocio}"
        message = "Los siguientes productos han llegado a su límite mínimo:\n\n"
        for p in productos:
            message += f"- {p.nombre}: Quedan {p.stock} unidades (Mínimo: {p.stock_minimo})\n"
        
        message += f"\nPor favor, reponga el stock a la brevedad.\nSistema TechPoint POS"
        
        try:
            send_mail(subject, message, 'techpoint-alerts@example.com', [config.email_notificaciones], fail_silently=True)
        except: pass

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
