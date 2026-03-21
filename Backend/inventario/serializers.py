from rest_framework import serializers
from .models import Producto, Venta, DetalleVenta, GlobalConfig

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class DetalleVentaSerializer(serializers.ModelSerializer):
    nombre = serializers.ReadOnlyField(source='producto.nombre')
    precio = serializers.ReadOnlyField(source='producto.precio')

    class Meta:
        model = DetalleVenta
        fields = ['id', 'nombre', 'cantidad', 'precio']

class VentaSerializer(serializers.ModelSerializer):
    items = DetalleVentaSerializer(many=True, read_only=True, source='detalles')

    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'total', 'items']

class GlobalConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalConfig
        fields = ['nombre_negocio', 'iva_porcentaje', 'direccion', 'last_backup']