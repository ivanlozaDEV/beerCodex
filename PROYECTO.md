# 🍻 BJCP Interactive Codex: La Guía Cervecera Definitiva y Didáctica

¡Bienvenido al **Códice Cervecero Interactivo**! Este documento resume **todo lo que hace la aplicación actualmente**, detallando las tecnologías implementadas, los flujos pedagógicos desarrollados y una guía técnica para tu despliegue gratuito en **Render Static Sites**.

---

## 🚀 Resumen Ejecutivo del Proyecto

Hemos transformado la densa guía oficial **BJCP 2021** (Beer Judge Certification Program) de un aburrido formato de texto plano a un ecosistema digital e interactivo de **nivel mundial**. 

La aplicación funciona bajo una arquitectura **DB-less** (sin servidor de base de datos externa), garantizando velocidad absoluta, cargas instantáneas y **cero costos de infraestructura** mensuales.

---

## 🛠️ Ficha Técnica y Stack Activo

La app está construida con las tecnologías frontend más avanzadas y estables de la industria:
* **Framework:** Next.js 15+ (React 19, App Router) - Aprovechando renderizado híbrido ultra rápido.
* **Estilos & Diseño:** Tailwind CSS v4.0+ - Con un sistema de diseño semántico personalizado basado en la gama cromática de *Norte Cerveza Artesanal*.
* **Animaciones Modernas:** Framer Motion - Para transiciones físicas, elásticas y efectos 3D inmersivos.
* **Iconografía Vectorial:** Lucide React - Iconos limpios de alta definición.
* **Lenguaje:** TypeScript - Tipado estricto en toda la lógica de datos del BJCP.
* **Gestión de Datos:** Motor de búsqueda difusa en memoria indexado directamente desde JSONs estructurados de alto rendimiento.

---

## ✨ Características y Funcionalidades Desarrolladas

Actualmente, el Códice integra los siguientes universos de funcionalidades totalmente operativos:

### 1. 🏆 Landing Page Cinematográfica (La Puerta de Entrada)
* **Entradas Físicas Escalonadas:** Animaciones de cascada elásticas para títulos, descripciones y botones de llamado a la acción.
* **Simulador 3D Parallax de Lata Digital:** Una recreación de lata *Norte* que flota infinitamente y **se inclina en perspectiva 3D dinámica** persiguiendo el cursor del ratón, proyectando reflejos brillantes.
* **Cultura Visual Coherente:** Fondo dinámico con orbes dorados pulsantes, líneas topográficas y rejilla de objetivos didácticos integrados en una sola interfaz limpia.

### 2. 🔍 Códice Interactivo y Motor Paramétrico (Explorador de Estilos)
* **Motor de Búsqueda Difusa (Fuzzy Text Search):** Busca instantáneamente por cualquier término (ej. *"chocolate"*, *"lúpulo"*, *"IPA"*) rastreando en milisegundos el nombre, aromas, sabores e historia de la data local.
* **Filtros Paramétricos Deslizables (Sliders):**
  * **Alcohol (ABV):** Rango del 0% al 20%.
  * **Amargor (IBU):** Rango de 0 a 150 unidades.
  * **Color (SRM):** Rango de 0 a 45 con barra visual interactiva de tonalidades.
* **Organización Inteligente de Grid:** 
  * Si **no** hay filtros activos: Muestra la biblioteca agrupada cronológicamente por las **34 categorías oficiales** (ej. *1. Cerveza Americana Estándar*).
  * Si **hay** filtros/búsqueda activa: Transiciona suavemente a una grilla plana ágil con los resultados relevantes.
* **Tarjetas Elevadas con Hover Físico:** Cada tarjeta de cerveza se eleva de la pantalla y emite un halo dorado al pasar el mouse (`scale: 1.02`, `y: -5px`).

### 3. 🧪 SRM & Glass Dynamic Engine (Renderizado de Color Exacto)
* **Simulación Líquida Realista:** Un componente vectorial `<GlassRenderer />` simula en tiempo real el color de la cerveza en un vaso utilizando gradientes HSL/RGB de alta fidelidad basados en el promedio SRM exacto del estilo.
* **Detección de Opacidad/Haze:** El motor lee dinámicamente la descripción física de la cerveza y ajusta la opacidad/turbidez del líquido si se detectan términos como *"turbio"*, *"hazy"* u *"opaco"*.

### 4. 🧬 El Asesor Sensorial (Sensory Wizard Beer Matchmaker)
* Un mago interactivo en 3 pasos que guía al usuario.
* Permite seleccionar preferencias organolépticas (ej. *"Maltoso y Dulce"*, *"Amargor Moderado"*, *"Potencia Media-Alta"*) y traduce tus gustos a un perfil paramétrico real.
* Cruza datos locales y devuelve **las 3 cervezas perfectas para ti**, con cálculo de porcentaje de afinidad.

### 5. 📊 Matriz Comparativa Multilateral (El Comparador)
* Permite seleccionar hasta **4 estilos de cerveza en simultáneo**.
* **Bandeja de Comparativa "Dock":** Un dock inferior animado al estilo macOS que flota con las cervezas añadidas.
* **Modal Comparativo de Triple Métrica:** Compara cara a cara, en paralelo horizontal, estadísticas vitales (ABV, IBU, SRM, OG, FG), categorías y **ejemplos comerciales alineados en pilas verticales** para un estudio perfecto.

### 6. 🗺️ Corrección de Categorías & Bilingüismo Absoluto
* **Base de Datos Corregida:** Reparamos un desfase de DOCX clásico que afectaba a la categoría "IPA". Ahora, las **34 categorías están al 100% alineadas con la guía BJCP 2021**.
* **Español Nativo y Fluido:** Nombres de categorías en español correctos (ej. *"Lager de la República Checa"*) en lugar de textos crudos en inglés.
* **Selector Instantáneo:** Cambia la interfaz y la base de datos entera entre 🇪🇸 Español y 🇺🇸 Inglés sin recargar el navegador.

### 7. 👁️ Contador de Visitas en Vivo
* Integración de una píldora dorada en el pie de página conectada a **CounterAPI.dev**.
* Incrementa con cada carga de página real, animado con un indicador de "En Vivo" verde brillante y un icono de ojo.

---

## 🌍 Guía de Despliegue Gratuito en Render.com

Dado que usas **Render** (cuenta de pago, pero los **Static Sites** son 100% gratuitos e ilimitados), la arquitectura DB-less de nuestra app es perfecta. Para alojarla sin costo en un Sitio Estático de Render, simplemente debemos configurar Next.js para hacer un **Static Export** (exportación estática).

Aquí tienes la receta exacta para desplegar en minutos:

### Paso 1: Modificar tu Configuración de Next
Asegúrate de incluir la directiva `output: 'export'` en tu archivo de configuración. Puedes reemplazar el contenido de `next.config.ts` con lo siguiente:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <- ESTA LÍNEA ACTIVA EL EXPORT ESTÁTICO
  images: {
    unoptimized: true, // Obligatorio para exportación estática en Render
  },
};

export default nextConfig;
```

### Paso 2: En Render.com (Crear el Sitio)
1. Entra a tu panel de Render y haz clic en **"New +"** -> **"Static Site"**.
2. Conecta tu repositorio de GitHub donde subiste el código.
3. Configura los parámetros del build de esta forma exacta:
   * **Build Command:** `npm run build`
   * **Publish Directory:** `out` (Esta es la carpeta que genera Next.js al hacer el export estático).

### Paso 3: Desplegar
* Haz clic en **"Create Static Site"**. 
* Render compilará tu código y generará un link gratuito con certificados SSL incluidos (ej. `bjcp-codex.onrender.com`). 
* **¡Costo mensual: $0 dólares!** Toda la lógica seguirá funcionando a la velocidad del rayo porque el motor de búsqueda, el matchmaker y el contador corren localmente en el navegador del cliente.

---

## 🔮 Futuras Etapas Potenciales
Con este núcleo de diseño interactivo consolidado, la app está lista para:
1. **Gamificación (Flashcards):** Crear juegos de memoria de IBU/ABV para exámenes de juez.
2. **Ficha de Cata Interactiva:** Un asistente paso a paso para llenar hojas de cata del BJCP con puntuaciones automáticas de 0 a 50.
3. **Directorio Local:** Integración con mapa para ver dónde conseguir las cervezas comerciales listadas.

---
*Desarrollado con pasión, precisión técnica y estética de vanguardia.* 🍻👑
