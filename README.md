# 🚀 TechPoint POS - Centro de Control para Retail Tecnológico

**TechPoint** no es solo un punto de venta; es una solución de inteligencia operativa diseñada para transformar pequeños y medianos negocios de tecnología en empresas eficientes y basadas en datos. 

---

## 🎯 ¿Para qué sirve?

El sistema ha sido creado para resolver los tres problemas críticos de una tienda de hardware:
1.  **Fuga de Capital**: Controlando exactamente cuánto crédito se otorga y quién debe cada centavo.
2.  **Pérdida de Ventas**: Avisando proactivamente antes de que te quedes sin stock de productos estrella.
3.  **Ceguera Financiera**: Mostrando no solo cuánto vendiste, sino cuánto ganaste realmente tras descontar tus costos de adquisición.

---

## ⚙️ ¿Cómo funciona?

El ecosistema de TechPoint opera en un ciclo de tres capas:

### 1. Operación Diaria (El Punto de Venta)
El cajero utiliza una interfaz táctil y responsiva para procesar transacciones en segundos. El sistema permite:
*   **Identificar Clientes**: Valida cédulas y RUCs ecuatorianos al instante para evitar errores de registro.
*   **Venta Flexible**: Elige entre Efectivo, Transferencia o **Crédito Personal**.
*   **Seguridad Atómica**: El sistema bloquea el stock y el cupo del cliente en milisegundos para que nunca se venda algo que no hay o se fíe más de lo permitido.

### 2. Gestión de Cartera (CRM y Créditos)
Cuando una venta se hace a crédito, TechPoint activa el motor financiero:
*   **Control de Deuda**: Rastrea cada factura pendiente de forma individual.
*   **Sistema de Abonos**: Permite que el cliente pague poco a poco, actualizando su saldo y liberando cupo de crédito automáticamente.
*   **Transparencia**: Genera reportes de "Estado de Cuenta" profesionales que puedes imprimir y entregar al cliente con su historial completo de compras y pagos.

### 3. Estrategia y Auditoría (Dashboard BI)
El dueño del negocio accede a una vista de "ojo de águila" sobre la operación:
*   **Monitor de Rentabilidad**: Visualiza tu margen de ganancia porcentual y utilidad neta real.
*   **Cierre de Caja**: Al final del día, consolida el dinero que debe haber en efectivo vs. lo que entró por banco o quedó en cuentas por cobrar.
*   **Caja Negra (Auditoría)**: Cada acción delicada (como borrar un producto o cambiar un precio) queda grabada con nombre de usuario y hora, garantizando que nada pase desapercibido.

---

## 🔐 Seguridad y Roles

El sistema implementa un modelo de **Control de Acceso Basado en Roles (RBAC)**:
*   **Cajeros**: Enfocados en la agilidad. Solo acceden al POS y registro de clientes.
*   **Administradores**: Control total. Acceso a reportes de utilidad, configuración de impuestos, auditoría y gestión de inventario maestro.

---

## 🛠️ Stack Tecnológico

*   **Núcleo**: Django REST Framework (Python 3.12) & PostgreSQL 15.
*   **Interfaz**: React 18 + Tailwind CSS (Diseño adaptable y moderno).
*   **Seguridad**: Blindaje JWT (JSON Web Tokens).
*   **Infraestructura**: Arquitectura de microservicios mediante Docker.

---

## ⚙️ Instalación y Despliegue

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/proyecto-pos.git
    ```
2.  **Levantar el entorno**:
    ```bash
    docker compose up --build
    ```
3.  **Acceso**:
    *   Frontend: `http://localhost:5173`
    *   Backend API: `http://localhost:8000`
    *   Admin: `http://localhost:8000/admin`

---

## 👨‍💻 Autor
**Snayder Cedeño**  
*Desarrollador de Software • Milagro, Ecuador*  
*Proyecto desarrollado para TechPoint • UNEMI*
