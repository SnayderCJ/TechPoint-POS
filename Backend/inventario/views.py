from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
from .models import Producto, Venta, DetalleVenta
from .serializers import ProductoSerializer, VentaSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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
        Lógica personalizada para procesar ventas y descontar stock.
        """
        items = request.data.get('items', [])
        total_venta = request.data.get('total')

        if not items:
            return Response({'error': 'No hay productos en la venta'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # 1. Crear el registro principal
                nueva_venta = Venta.objects.create(total=total_venta)

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