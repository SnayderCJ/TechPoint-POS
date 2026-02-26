from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, VentaViewSet, LoginView

router = DefaultRouter()
# Ruta para gestionar productos (inventario)
router.register(r'productos', ProductoViewSet)
# Ruta para procesar las ventas y descontar stock
router.register(r'ventas', VentaViewSet, basename='ventas')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login_api'),
]