from django.db import models

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
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    # null=True porque puede ser "Consumidor Final"
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)

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
        
