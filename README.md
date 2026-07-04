# ClipForge AI

ClipForge AI es una experiencia SaaS para creadores de contenido, streamers y editores. Convierte la descripción de un video largo en conceptos de clips listos para producir: hooks, títulos, descripciones, hashtags, dirección de edición y una estimación de potencial viral.

![Vista principal de ClipForge AI](assets/images/clipforge-preview.png)

> El motor creativo está simulado con JavaScript. No utiliza una API de inteligencia artificial ni envía contenido a servicios externos.

## Funcionalidades

- Generación contextual de tres oportunidades por análisis.
- Configuración por plataforma, duración, estilo y audiencia.
- Hooks, títulos, descripciones, hashtags y consejos de edición.
- Puntuación orientativa de potencial viral.
- Regeneración completa o individual.
- Historial y favoritos persistentes mediante `localStorage`.
- Copiado individual o completo al portapapeles.
- Exportación en TXT y JSON.
- Ejemplo precargado y restablecimiento del estudio.
- Interfaz responsive, accesible y compatible con movimiento reducido.

![Resultados generados en ClipForge Studio](assets/images/clipforge-studio.png)

## Tecnologías

- HTML5 semántico
- CSS3 modular
- JavaScript moderno con ES Modules
- Web Storage API
- Sin frameworks ni dependencias de JavaScript

## Arquitectura

```text
clipforge-ai/
├── assets/
│   ├── icons/
│   └── images/
├── css/
│   ├── style.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── generator.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
├── tests/
│   ├── generator.test.mjs
│   └── storage.test.mjs
├── .nojekyll
├── index.html
├── LICENSE
├── robots.txt
├── site.webmanifest
└── README.md
```

El proyecto separa la generación de contenido, la persistencia y el renderizado. `MockClipGenerator` expone el contrato que puede sustituirse posteriormente por un proveedor conectado a OpenAI u otra API sin reconstruir la interfaz.

## Ejecutar localmente

Los módulos ES necesitan servirse mediante HTTP. Desde la raíz del proyecto:

```bash
python -m http.server 4173
```

Después abre `http://localhost:4173`.

También puedes usar cualquier servidor estático, como la extensión Live Server de VS Code.

## Pruebas

El proyecto utiliza el runner nativo de Node.js y no necesita instalar dependencias:

```bash
node --test
```

## Publicar en GitHub Pages

1. Crea un repositorio y sube el contenido de esta carpeta.
2. Abre **Settings → Pages** en GitHub.
3. Selecciona **Deploy from a branch**.
4. Elige la rama `main` y la carpeta `/ (root)`.
5. Guarda la configuración y espera a que GitHub publique el sitio.

No se requiere proceso de compilación.

## Privacidad

Las descripciones, generaciones y favoritos permanecen en el navegador del usuario. El proyecto no incluye backend, analítica ni transmisión de datos.

## Próximos pasos

- Integrar un proveedor de IA mediante un backend seguro.
- Analizar transcripciones o videos reales.
- Sincronizar proyectos entre dispositivos.
- Añadir cuentas, equipos y espacios de trabajo.

## Licencia

Distribuido bajo la licencia MIT. Consulta [LICENSE](LICENSE).
