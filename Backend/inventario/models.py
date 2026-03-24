from django.db import models, transaction
from django.contrib.auth.models import User

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio de Venta")
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Costo de Adquisición") # 👈 RF 3.2
    stock = models.PositiveIntegerField(default=0)
    stock_minimo = models.PositiveIntegerField(default=3) # 👈 RF 3.4
    codigo_barras = models.CharField(max_length=50, unique=True)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Cliente(models.Model):
    identificacion = models.CharField(max_length=13, unique=True, verbose_name="Cédula o RUC")
    nombre = models.CharField(max_length=200)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    cupo_credito = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.nombre} ({self.identificacion})"
    
class Venta(models.Model):
    METODOS_PAGO = [
        ('EFECTIVO', 'Efectivo'),
        ('TRANSFERENCIA', 'Transferencia'),
        ('CREDITO', 'Crédito'),
    ]
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO, default='EFECTIVO')
    saldo_pendiente = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if self.metodo_pago == 'CREDITO' and not self.pk:
            self.saldo_pendiente = self.total
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Venta #{self.id} - {self.metodo_pago}"

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2) # Precio de venta
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # 👈 RF 3.2: Costo de compra histórico

class Abono(models.Model):
    venta = models.ForeignKey(Venta, related_name='abonos', on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=20, default='EFECTIVO')
    notas = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            self.venta.saldo_pendiente -= self.monto
            if self.venta.saldo_pendiente < 0:
                self.venta.saldo_pendiente = 0
            self.venta.save()
            super().save(*args, **kwargs)

class GlobalConfig(models.Model):
    nombre_negocio = models.CharField(max_length=100, default="TechPoint POS")
    iva_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=15.00)
    direccion = models.CharField(max_length=255, default="Milagro, Guayas, Ecuador")
    last_backup = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1  
        super(GlobalConfig, self).save(*args, **kwargs)

# 👈 RF 3.3: AUDITORÍA DE LOGS
class AuditLog(models.Model):
    ACCIONES = [
        ('ELIMINACION', 'Eliminación'),
        ('CAMBIO_PRECIO', 'Cambio de Precio'),
        ('BACKUP', 'Ejecución de Backup'),
        ('LOGIN', 'Inicio de Sesión'),
    ]
    usuario = models.CharField(max_length=100) # Quién
    accion = models.CharField(max_length=20, choices=ACCIONES) # Qué
    descripcion = models.TextField() # Detalle
    fecha = models.DateTimeField(auto_now_add=True) # Cuándo

    def __str__(self):
        return f"{self.usuario} - {self.accion} ({self.fecha})"
