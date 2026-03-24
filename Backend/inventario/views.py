from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
import decimal
from .models import Producto, Venta, DetalleVenta, GlobalConfig, Cliente, Abono
from .serializers import ProductoSerializer, VentaSerializer, GlobalConfigSerializer, ClienteSerializer, AbonoSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # authenticate verifica contra la tabla auth_user de PostgreSQL
        user = authenticate(username=username, password=password)
        
        if user is not None:
            return Response({
                'name': user.first_name if user.first_name else user.username,
                'role': 'admin' if user.is_superuser else 'cashier',
                'institution': 'UNEMI • TechPoint'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

# Vista para la gestión de abonos
class AbonoViewSet(viewsets.ModelViewSet):
    queryset = Abono.objects.all().order_by('-fecha')
    serializer_class = AbonoSerializer

# Vista para la gestión de clientes
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('nombre')
    serializer_class = ClienteSerializer

    @action(detail=True, methods=['get'])
    def estado_cuenta(self, request, pk=None):
        """
        Genera un historial cronológico de ventas y abonos del cliente.
        """
        cliente = self.get_object()
        
        # 1. Obtener Ventas a Crédito
        ventas = Venta.objects.filter(cliente=cliente, metodo_pago='CREDITO').values(
            'id', 'fecha', 'total', 'saldo_pendiente'
        )
        
        # 2. Obtener Abonos
        abonos = Abono.objects.filter(venta__cliente=cliente).values(
            'id', 'fecha', 'monto', 'venta_id', 'metodo_pago'
        )
        
        # 3. Unificar Movimientos
        movimientos = []
        for v in ventas:
            movimientos.append({
                'tipo': 'CONSUMO',
                'id': v['id'],
                'fecha': v['fecha'],
                'monto': v['total'],
                'descripcion': f"Venta a Crédito #{v['id']}"
            })
            
        for a in abonos:
            movimientos.append({
                'tipo': 'ABONO',
                'id': a['id'],
                'fecha': a['fecha'],
                'monto': a['monto'],
                'descripcion': f"Abono a Venta #{a['venta_id']} ({a['metodo_pago']})"
            })
            
        # Ordenar por fecha (más reciente primero)
        movimientos.sort(key=lambda x: x['fecha'], reverse=True)
        
        deuda_total = sum(v['saldo_pendiente'] for v in ventas)
        
        return Response({
            'cliente': cliente.nombre,
            'identificacion': cliente.identificacion,
            'cupo_credito': cliente.cupo_credito,
            'deuda_total': deuda_total,
            'cupo_disponible': cliente.cupo_credito - deuda_total,
            'movimientos': movimientos
        })

# Vista para el catálogo de productos
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

# Vista para las ventas (Historial y Creación)
class VentaViewSet(viewsets.ModelViewSet): # Cambiado a ModelViewSet para soportar GET
    queryset = Venta.objects.all().order_by('-fecha') # Ordenar por las más recientes
    serializer_class = VentaSerializer

    def create(self, request):
        """
        Lógica personalizada para procesar ventas, descontar stock y validar crédito.
        """
        items = request.data.get('items', [])
        total_venta = request.data.get('total')
        cliente_id = request.data.get('cliente')
        metodo_pago = request.data.get('metodo_pago', 'EFECTIVO') # Nuevo campo del frontend

        if not items:
            return Response({'error': 'No hay productos en la venta'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # 1. Buscar cliente si existe
                cliente = None
                if cliente_id:
                    cliente = Cliente.objects.select_for_update().get(id=cliente_id)

                # 2. VALIDACIÓN DE CRÉDITO (RF 2.2)
                if metodo_pago == 'CREDITO':
                    if not cliente:
                        raise Exception("Se requiere un cliente registrado para ventas a crédito.")
                    
                    # Calcular deuda actual: Suma de todos los saldos pendientes del cliente
                    deuda_actual = sum(v.saldo_pendiente for v in Venta.objects.filter(cliente=cliente))
                    nuevo_total_deuda = deuda_actual + decimal.Decimal(str(total_venta))
                    
                    if nuevo_total_deuda > cliente.cupo_credito:
                        cupo_disponible = cliente.cupo_credito - deuda_actual
                        raise Exception(f"Cupo excedido. Disponible: ${cupo_disponible:.2f}. Total deuda si se aprueba: ${nuevo_total_deuda:.2f}")

                # 3. Crear el registro principal con el método de pago
                nueva_venta = Venta.objects.create(
                    total=total_venta, 
                    cliente=cliente, 
                    metodo_pago=metodo_pago
                )

                for item in items:
                    # select_for_update previene errores si dos cajeros venden lo mismo al mismo tiempo
                    producto = Producto.objects.select_for_update().get(id=item['id'])
                    cantidad_vendida = item.get('cantidad', 1)

                    # 2. Validar Stock
                    if producto.stock < cantidad_vendida:
                        raise Exception(f"Stock insuficiente para {producto.nombre}.")

                    # 3. Descontar Stock
                    producto.stock -= cantidad_vendida
                    producto.save()

                    # 4. Crear Detalle
                    DetalleVenta.objects.create(
                        venta=nueva_venta,
                        producto=producto,
                        cantidad=cantidad_vendida,
                        precio_unitario=producto.precio
                    )

            # Devolvemos la venta serializada para que el frontend pueda mostrarla de inmediato
            serializer = self.get_serializer(nueva_venta)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ConfigView(APIView):
    def get(self, request):
        config, _ = GlobalConfig.objects.get_or_create(pk=1)
        return Response(GlobalConfigSerializer(config).data)

    def post(self, request):
        config = GlobalConfig.objects.get(pk=1)
        serializer = GlobalConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
