# JVVG (Vice) — Analizador de errores léxicos (v1.0.0)

**JVVG (Vice)** es una aplicación web interactiva estilo IDE inspirada visualmente en el **Enderman de Minecraft**, construida con **React 18, TypeScript, Vite, Tailwind CSS, CodeMirror 6 y Lucide Icons**.

Su motor léxico (`src/lexer/scanner.ts`) implementa un **autómata/escáner determinista carácter por carácter** con soporte para el principio de **Maximal Munch** y estados contextuales (cadenas simples, cadenas multilínea, literales de carácter y comentarios) para analizar código fuente en **Python**, **C++** y **Java**.

---

## 1. Ejecución Rápida

```bash
cd C:\Users\viteg\.gemini\antigravity\scratch\jvvg-vice
npm install
npm run dev
```

Para ejecutar la suite de 18 pruebas obligatorias desde la terminal:

```bash
npm run test:lexer
```

---

## 2. Estructura del Proyecto

```text
jvvg-vice/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                        # Estado global, navegación de 5 vistas y persistencia en localStorage
    ├── index.css                      # Tema oscuro Enderman (#111019 / #211B2B) y decoraciones de CodeMirror 6
    ├── main.tsx                       # Punto de entrada de React
    ├── lexer/
    │   ├── types.ts                   # Modelos: Token, LexicalError, AnalysisStatistics, AnalysisResult
    │   ├── scanner.ts                 # Motor Léxico Real carácter por carácter (Python, C++, Java)
    │   ├── examples.ts                # 15 casos de prueba interactivos (5 por lenguaje, incluyendo 20 + * 5;)
    │   └── runTests.ts                # Suite automatizada con los 18 casos de prueba obligatorios
    └── components/
        ├── EndermanMascot.tsx         # Mascota Enderman en Pixel Art SVG inline con ojos reactivos y partículas
        ├── TopNavbar.tsx              # Barra superior con logo Vice, título, badge v1.0.0 y 5 pestañas
        ├── ViceCodeEditor.tsx         # Editor CodeMirror 6 con resaltado dinámico y marcado de errores léxicos
        ├── TokenBadge.tsx             # Badges semánticos por categoría de token
        ├── AnalyzerView.tsx           # Vista principal de trabajo (2 columnas estilo IDE + Aviso Didáctico)
        ├── TokensExplorerView.tsx     # Explorador independiente de tokens con buscador y filtros
        ├── HistoryView.tsx            # Historial persistente en localStorage con restauración en un clic
        ├── LexicalRulesView.tsx       # Documentación interactiva y respuestas a las 4 preguntas conceptuales
        └── AboutView.tsx              # Ficha académica editable y matriz de verificación en vivo (18/18 tests)
```
