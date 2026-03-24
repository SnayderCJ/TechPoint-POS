from django.db import models, transaction

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    codigo_barras = models.CharField(max_length=50, unique=True)
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Cliente(models.Model):
    # En Ecuador: 10 dígitos para cédula, 13 para RUC
    identificacion = models.CharField(max_length=13, unique=True, verbose_name="Cédula o RUC")
    nombre = models.CharField(max_length=200)
    correo = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    
    # Para la Fase de Crédito más adelante
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
    
    # Si es crédito, aquí llevamos cuánto debe de esta factura específicamente
    saldo_pendiente = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        # Si es crédito y es nueva, el saldo inicial es el total
        if self.metodo_pago == 'CREDITO' and not self.pk:
            self.saldo_pendiente = self.total
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Venta #{self.id} - {self.metodo_pago} ({self.fecha.strftime('%d/%m/%Y')})"

class Abono(models.Model):
    METODOS_PAGO = [
        ('EFECTIVO', 'Efectivo'),
        ('TRANSFERENCIA', 'Transferencia'),
    ]

    venta = models.ForeignKey(Venta, related_name='abonos', on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO, default='EFECTIVO')
    notas = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Al guardar un abono, restamos el monto del saldo_pendiente de la venta
        with transaction.atomic():
            self.venta.saldo_pendiente -= self.monto
            if self.venta.saldo_pendiente < 0:
                self.venta.saldo_pendiente = 0
            self.venta.save()
            super().save(*args, **kwargs)

    def __str__(self):
        return f"Abono a Venta #{self.venta.id} - ${self.monto}"

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

class GlobalConfig(models.Model):
    nombre_negocio = models.CharField(max_length=100, default="TechPoint POS")
    iva_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=15.00)
    direccion = models.CharField(max_length=255, default="Milagro, Guayas, Ecuador")
    last_backup = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1  
        super(GlobalConfig, self).save(*args, **kwargs)
        
