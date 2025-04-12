# Quick'n'Full — Demostración

Este repositorio contiene una demostración del componente `Quick'n'Full`, desarrollado con Next.js.


## Autor

Desarrollado por [Enrique Fuenzalida](https://github.com/enriquefuenzalidam) para [individual.cl](https://individual.cl).


## Licencia

Este componente está licenciado bajo la [Licencia MIT](LICENSE) ![MIT License](https://img.shields.io/badge/license-MIT-blue).

© 2025 [individual.cl](https://individual.cl) — Componente Quick’n’Full


## Requisitos

- Node.js (v18 o superior recomendado)
- npm (v9 o superior)

Puedes verificar tu versión de Node con:

```bash
node -v
```

## Instalación

Clona este repositorio y ejecuta la instalación de dependencias:

```bash
git clone https://github.com/enriquefuenzalidam/quicknfulldemo.git
cd quicknfulldemo
npm install
```

## Ejecución en entorno local

Una vez instaladas las dependencias, levanta el servidor de desarrollo:

```bash
npm run dev
```

Luego abre tu navegador y visita:

```
http://localhost:3000
```

## Estructura

```
quicknfulldemo
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── quicknfullMain
│   │       └── [listKey]
│   │           └── [index]
│   │               └── [color]
│   │                   ├── page.tsx
│   │                   └── quicknfullMainParams.tsx
│   ├── assets
│   │   └── exampleImages
│   └── components
│       └── quicknfull
│           ├── exampleImagesLists.tsx
│           ├── quicknfullComm.tsx
│           ├── quicknfullMain.tsx
│           └── quicknfullPrev.tsx
└── tsconfig.json
```

## ¿Qué es Quick'n'Full?

Componente modular de galería para Next.js que permite:

- Navegación fluida entre imágenes con transiciones optimizadas.
- Soporte para listas dinámicas de imágenes (via props o archivos JSON).
- Precarga inteligente para mejorar el rendimiento visual.
- Estilos adaptativos para distintos tamaños de pantalla.


## Notas

- Este proyecto aún no incluye el paquete empaquetado para producción (npm pack).
- Solo está pensado como demo para desarrollo local.

---

Sugerencias y contribuciones son bienvenidas

