# JuanfeLogis Frontend 📦

![JuanfeLogis](/JuanfeLogisFrontend/public/vite.svg)

## 📋 Descripción General
El **Frontend de JuanfeLogis** es una aplicación web moderna y progresiva diseñada para facilitar la administración y gestión del inventario físico para la fundación. Proporciona una interfaz gráfica de usuario sencilla, ágil y de rápida adopción para que los operarios y administradores puedan consultar el estado de donaciones, ubicación de cajas, así como registrar entradas y salidas de inventario en tiempo real. 

## 🚀 La Solución con Código QR
Una de las funcionalidades principales y la propuesta de valor más fuerte de este sistema es **la gestión e identificación de inventario basada en Códigos QR**. 

**¿Qué problema soluciona?**
En bodegas o centros de acopio con múltiples cajas selladas, los operarios pierden información sobre qué productos hay dentro de cada caja o a qué lote de donación pertenecen. La gestión manual es lenta, propensa a errores (descuadres de inventario), y dificulta conocer la ubicación real u obtener reportes de disponibilidad.

**Nuestra solución:**
- Cada **Caja (Box)** generada en la plataforma tendrá su propio identificador único y generará un **Código QR visual**.
- Los operarios pueden pegar este código QR en la parte externa de la caja física.
- Desde la aplicación Frontend (versión móvil o escritorio con cámara o lector/scanner), **se puede escanear este código QR**. 
- Al escanearlo, el sistema **redirige automáticamente** a la vista de detalles de esa caja, donde el usuario puede:
  - Ver todos los productos exactos que hay dentro, su estado físico y precio de donación/venta.
  - Ver el historial de transacciones (entradas y salidas) de esa caja en específico.
  - Modificar el stock instantáneamente, haciendo un conteo rápido sin tener que teclear identificadores largos ni buscar la caja manualmente en listas.

## 🛠 Tecnologías Utilizadas
La interfaz está construida enfocada no solo en rendimiento y eficiencia de red, sino también proveer una experiencia premium y moderna:
- **React 19 + TypeScript:** Construcción de interfaces reactivas con tipado seguro.
- **Vite:** Herramienta de compilación ultrarrápida para desarrollo y producción.
- **Tailwind CSS v4:** Motor de estilos mediante clases de utilidad para interfaces impecables, flexibles y *responsive* (preparadas nativamente para dispositivos móviles).
- **Zustand:** Manejo del estado global para autenticación y carrito de transacciones.
- **TanStack React Query:** Data Fetching, sincronización de estado del servidor y caching.
- **HTML5-QRCode:** Librería implementada para procesar y leer y descodificar los códigos QR usando la cámara del dispositivo móvil u ordenador.
- **React Router Dom:** Manejo de rutas y navegación de páginas interactiva sin recarga (SPA).
- **Lucide React:** Iconografía vectorial minimalista y estandarizada. 

## 🏗 Estructura del Proyecto
```plaintext
src/
 ├── api/        # Funciones de consumo API (Axios)
 ├── assets/     # Imágenes, fuentes, svgs estáticos
 ├── hooks/      # Custom hooks de React
 ├── layouts/    # Plantillas de diseño base (Sidebar, Header, Layout General)
 ├── lib/        # Utilidades y configuración de librerías externas (Zod, Tailwind merge)
 ├── pages/      # Vistas principales de la aplicación por ruta
 ├── router/     # Definición de las rutas del proyecto
 ├── store/      # Estados globales usando Zustand
 └── types/      # Definiciones de tipos e interfaces TypeScript (Modelos)
```

## ⚙️ Instalación y Despliegue Local

### Requisitos previos
- Node.js (v18+)
- npm o pnpm

### Pasos
1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Ejecutar el servidor de desarrollo en local:
   ```bash
   npm run dev
   ```
3. (Opcional) Compilación para producción:
   ```bash
   npm run build
   ```

El servidor estará corriendo en `http://localhost:5173/` (o puerto similar proporcionado por Vite). Para probar la funcionalidad de escaneo QR asegúrate de habilitar permisos de la cámara en el navegador.
