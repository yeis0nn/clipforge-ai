# ClipForge AI
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?style=for-the-badge&logo=github&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

ClipForge AI is a modern SaaS-inspired web application built for content creators, streamers, and video editors.

It transforms long-form content descriptions into production-ready clip concepts by generating engaging hooks, titles, descriptions, hashtags, editing recommendations, and a viral potential estimate through a modular AI-ready architecture.

## 🚀 Live Demo

🌐 **https://yeis0nn.github.io/clipforge-ai/**

Experience ClipForge AI directly in your browser — no installation required.

## 📋 Project Information

| Property | Value |
|----------|-------|
| **Status** | 🟢 Active Development |
| **Version** | 1.0.0 |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Architecture** | Modular & AI-Ready |
| **Deployment** | GitHub Pages |
| **License** | MIT |


![Vista principal de ClipForge AI](assets/images/clipforge-preview.png)

> > The current version uses a simulated AI engine built with JavaScript. Its modular architecture is designed for seamless integration with real AI providers such as OpenAI in future releases.

## Why ClipForge AI?

ClipForge AI was created to explore how a modern SaaS application can be architected before integrating real artificial intelligence.

Instead of focusing solely on generating content, the project emphasizes clean architecture, modular design, scalability, and user experience. The current simulated AI engine can later be replaced with real AI providers such as OpenAI without requiring changes to the user interface.

## Features

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

## Tech Stack

- HTML5 semántico
- CSS3 modular
- JavaScript moderno con ES Modules
- Web Storage API
- Sin frameworks ni dependencias de JavaScript

## Project Structure

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

## Running Locally 

Los módulos ES necesitan servirse mediante HTTP. Desde la raíz del proyecto:

```bash
python -m http.server 4173
```

Después abre `http://localhost:4173`.

También puedes usar cualquier servidor estático, como la extensión Live Server de VS Code.

## Testing

El proyecto utiliza el runner nativo de Node.js y no necesita instalar dependencias:

```bash
node --test
```

## Privacy

Las descripciones, generaciones y favoritos permanecen en el navegador del usuario. El proyecto no incluye backend, analítica ni transmisión de datos.

## 🗺️ Roadmap

### ✅ Version 1.0 — Current Release

- Modern responsive interface
- Simulated AI generation engine
- Favorites and history
- Local Storage persistence
- TXT and JSON export
- Modular architecture
- GitHub Pages deployment

### 🚧 Version 2.0 — AI Integration

- OpenAI integration
- Secure backend architecture
- User authentication
- Saved workspaces
- Cloud synchronization

### 🔮 Future Vision

- AI transcript analysis
- Video content analysis
- Automatic clip recommendations
- Team collaboration
- Performance analytics dashboard

## License

Distribuido bajo la licencia MIT. Consulta [LICENSE](LICENSE).
