from rest_framework import serializers
from .models import Producto, Venta, DetalleVenta, GlobalConfig, Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

    def validate_identificacion(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("La identificación debe contener solo números.")
        
        if len(value) not in [10, 13]:
            raise serializers.ValidationError("La identificación debe tener 10 dígitos (Cédula) o 13 dígitos (RUC).")

        # Algoritmo de Módulo 10 para los primeros 10 dígitos
        cedula = value[:10]
        provincia = int(cedula[0:2])
        
        if not (0 < provincia <= 24):
            raise serializers.ValidationError("Código de provincia inválido.")

        digitos = [int(d) for d in cedula]
        verificador = digitos.pop()
        suma = 0
        
        for i, d in enumerate(digitos):
            if i % 2 == 0: # Posiciones impares (0, 2, 4...)
                d = d * 2
                if d > 9:
                    d -= 9
            suma += d
        
        resultado = 10 - (suma % 10)
        if resultado == 10:
            resultado = 0
            
        if resultado != verificador:
            raise serializers.ValidationError("El número de identificación es inválido (Dígito verificador incorrecto).")
            
        return value

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
    cliente_nombre = serializers.ReadOnlyField(source='cliente.nombre')
    
    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'total', 'items', 'cliente', 'cliente_nombre']

class GlobalConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalConfig
        fields = ['nombre_negocio', 'iva_porcentaje', 'direccion', 'last_backup']