# 🍻 BJCP Interactive: La Guía Cervecera Definitiva y Didáctica

Una plataforma web moderna, de alto impacto visual y totalmente didáctica diseñada para explorar, estudiar y dominar la **Guía de Estilos BJCP 2021** (Beer Judge Certification Program). Construida sobre una arquitectura "DB-less" (sin base de datos externa) para garantizar velocidad absoluta, cero costos de infraestructura y máxima accesibilidad.

---

## 🚀 Visión del Proyecto
El objetivo es transformar la tradicional y densa guía de texto del BJCP en un **Códice Cervecero Interactivo** que sirva tanto para aficionados que quieren descubrir nuevas cervezas basadas en sus gustos, como para jueces que estudian para sus exámenes BJCP, implementando una experiencia de usuario (UX) gamificada y premium.

### 💎 Pilares Fundamentales
1. **Zero-Cost Architecture (DB-less):** Despliegue estático/serverless optimizado alojable en Render/Vercel sin necesidad de pagar por hosting de bases de datos SQL/NoSQL.
2. **Estética Inmersiva y Dinámica:** Diseño premium (Oscuro/Luz HSL curado, glassmorphism, animaciones fluidas) que se aleja de las tablas aburridas tradicionales.
3. **Bilingüe Nativo (EN/ES):** Toda la interfaz y la data es intercambiable al instante entre inglés y español.

---

## 🛠️ Arquitectura y Módulos de Desarrollo

El proyecto se divide en módulos funcionales independientes para facilitar una implementación ordenada y testeable.

### 📊 Módulo 0: Motor de Procesamiento de Datos (Data Ingestion)
Automatización de la ingesta y transformación de las guías nativas en formato DOCX hacia un ecosistema de datos estructurados.
* **Parser Automatizado (Python-docx):** Script que extrae la jerarquía del Word y genera los índices estructurados.
* **Modelos de Datos Unificados (JSON):** Generación de `styles_es.json` y `styles_en.json` con campos sanitizados para búsquedas instantáneas y estadísticas vitales numéricas parseadas (mínimos y máximos de ABV, IBU, SRM, OG, FG).

### 🎨 Módulo 1: Motor de Apariencia Dinámica y Sistema de Diseño (UI Kit)
Generación visual interactiva y consistencia visual global basada en un tema cervecero unificado.
* **Beer Theme Design System (Tailwind v4):** Configuración directa en CSS `@theme` de colores semánticos alusivos al tema:
  * `pilsner-gold` (Dorados vibrantes).
  * `amber-ale` (Cobrizos profundos).
  * `stout-dark` (Tostados oscuros/chocolate para fondos oscuros).
  * `foam-cream` (Blanco espuma suave).
  * `hop-green` (Verde lúpulo para interacciones y éxito).
* **Kit de Componentes Primitivos (Reutilizables):** Pre-diseño de elementos interactivos compartidos para asegurar la coherencia en toda la web:
  * **Modales Glassmorphism:** Ventanas emergentes estilizadas con desenfoque de fondo para ver detalles.
  * **Dropdowns Cervecero:** Menús desplegables consistentes para filtros y selectores de idioma.
  * **Tarjetas Estándar:** Unidades base de presentación visual para los estilos.
* **SRM Dynamic Renderer:** Componente React que traduce el número SRM a valores Hexadecimales/RGB de alta fidelidad simulando el color exacto del líquido en una copa interactiva.
* **Filtro de Turbidez (Haze/Opacity Engine):** El componente lee términos de la apariencia como *"brillante"*, *"turbia"*, *"opaca"* o *"hazy"* y ajusta dinámicamente el gradiente, *backdrop-blur* y la opacidad del líquido simulado en CSS.

### 🔍 Módulo 2: Core de la Guía y Filtros Avanzados
El núcleo del explorador de estilos.
* **Filtros Paramétricos Computados:** Sliders dinámicos para buscar en tiempo real rangos de ABV (Alcohol), IBU (Amargor) y SRM (Color).
* **Buscador de Texto Completo (Full-Text Search Client-Side):** Motor ultrarrápido embebido (`Fuse.js` o `FlexSearch`) que busca sobre aromas, sabores y etiquetas de manera instantánea sin latencia de red.
* **Fichas de Estilo Interactivas:** Renderizado modular de cada parte identificada (Aroma, Sabor, Sensación en boca, Historia) con resaltado de palabras clave.

### 🧠 Módulo 3: El Mago Selector (Beer Matchmaker)
Un motor de recomendación didáctico enfocado en el usuario final (consumidor por hobby).
* **Asistente de Perfil Sensorial:** En lugar de usar jerga técnica, el usuario interactúa con preguntas de lenguaje natural: *"Me gustan las cosas dulces"*, *"prefiero que no amargue"*, *"quiero que tenga mucho alcohol"*.
* **Algoritmo de Recomendación Local:** Mapea estas preferencias contra las estadísticas y *tags* indexadas en el JSON y genera un ranking de estilos BJCP ideales con su porcentaje de coincidencia.

### 📖 Módulo 4: Academia BJCP (Study & Gamification)
Herramientas específicamente diseñadas para el estudio dinámico de jueces aspirantes.
* **Modo Flashcards (Tarjetas de Estudio):** Juegos rápidos para memorizar estadísticas vitales (OG, FG, ABV) y comparativas de estilo.
* **Comparador de Estilos Lado a Lado:** Selección de dos estilos para contrastar directamente sus diferencias en sabor, aroma e ingredientes en una sola vista unificada.

### 📍 Módulo 5: Geolocalización y Comercialización Local (Geo-Marketing)
Monetización pasiva y valor agregado para distribuidores y cervecerías locales.
* **Commercial Mapper:** Uso de los ejemplos comerciales indexados para mapear integraciones futuras.
* **Geotargeting de Disponibilidad:** Detectar la ubicación del usuario para mostrar un banner/enlace de *"Dónde comprar esta cerveza"* o *"Ejemplos artesanales locales similares"* redirigiendo a tiendas o cervecerías de su área que patrocinen el espacio.

### 💳 Módulo 6: Monetización Serverless y Pasarelas Externas
Venta y soporte del sitio sin infraestructura de servidor pesada.
* **Botones de Pago Headless (Stripe / PayPal):** Integración de checkouts externos para donaciones ("Cómprame una cerveza"), suscripciones a funciones de academia avanzadas, o espacios publicitarios para cervecerías.
* **Procesamiento Serverless:** Uso de API Routes de Next.js para Webhooks y validación de pagos únicamente, eliminando la necesidad de una base de datos de usuarios propia.

---

## 🛠️ Tecnologías Empleadas
* **Frontend:** React 19 + Next.js 15 (App Router)
* **Estilos:** Tailwind CSS 4.0+ (Para un diseño moderno, adaptable y veloz)
* **Lenguaje:** TypeScript (Tipado estricto para asegurar que la data del BJCP no se rompa)
* **Data Storage:** Static JSON Assets & Client-side state management.
* **Búsqueda:** Fuse.js / FlexSearch (In-memory indexing)
* **Parser:** Python 3.12 + `python-docx` (Procesamiento previo offline)

---

## 🚀 Próximos Pasos Inmediatos
1. **Ejecutar Script de Extracción (Módulo 0):** Convertir los archivos DOCX a JSON estáticos estructurados para ES y EN.
2. **Construir el Design System:** Crear la paleta de colores cervecera y el componente de renderizado dinámico de vasos según SRM.
3. **Levantar el Dashboard Core:** La pantalla principal con listado de categorías y estilos bilingüe.
