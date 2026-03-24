from django.contrib import admin
from .models import Producto, Cliente, Venta, DetalleVenta, GlobalConfig, Abono, AuditLog

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'precio_compra', 'stock', 'stock_minimo')
    search_fields = ('nombre', 'codigo_barras')
    list_filter = ('categoria',)

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'identificacion', 'correo', 'telefono', 'cupo_credito')
    search_fields = ('nombre', 'identificacion')

class DetalleVentaInline(admin.TabularInline):
    model = DetalleVenta
    extra = 0
    readonly_fields = ('producto', 'cantidad', 'precio_unitario', 'costo_unitario')

class AbonoInline(admin.TabularInline):
    model = Abono
    extra = 0
    readonly_fields = ('fecha',)

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha', 'cliente', 'metodo_pago', 'total', 'saldo_pendiente')
    list_filter = ('fecha', 'cliente', 'metodo_pago')
    inlines = [DetalleVentaInline, AbonoInline]

@admin.register(Abono)
class AbonoAdmin(admin.ModelAdmin):
    list_display = ('venta', 'monto', 'metodo_pago', 'fecha')
    list_filter = ('metodo_pago', 'fecha')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'accion', 'descripcion', 'fecha')
    list_filter = ('accion', 'fecha')
    readonly_fields = ('usuario', 'accion', 'descripcion', 'fecha')

@admin.register(GlobalConfig)
class GlobalConfigAdmin(admin.ModelAdmin):
    list_display = ('nombre_negocio', 'iva_porcentaje', 'last_backup')
