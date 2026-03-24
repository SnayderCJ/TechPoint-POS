from django.contrib import admin
from .models import Producto, Cliente, Venta, DetalleVenta, GlobalConfig

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'stock', 'codigo_barras')
    search_fields = ('nombre', 'codigo_barras')
    list_filter = ('categoria',)

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'identificacion', 'correo', 'telefono', 'cupo_credito')
    search_fields = ('nombre', 'identificacion')

class DetalleVentaInline(admin.TabularInline): # Para ver los productos vendidos DENTRO de la venta
    model = DetalleVenta
    extra = 0
    readonly_fields = ('producto', 'cantidad', 'precio_unitario')

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha', 'cliente', 'total')
    list_filter = ('fecha', 'cliente')
    inlines = [DetalleVentaInline]

@admin.register(GlobalConfig)
class GlobalConfigAdmin(admin.ModelAdmin):
    list_display = ('nombre_negocio', 'iva_porcentaje', 'last_backup')
