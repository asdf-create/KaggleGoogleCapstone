# StudyMate AI — Native Windows Desktop Application

Native Windows Desktop app wrapper for StudyMate AI built with **Electron** and **Next.js**.

## Features
- **Native Window Experience**: Fullscreen / resizable native Windows window (`1280x850`).
- **Process Management**: Automatically manages background C++ REST server & Python ADK microservice lifecycle.
- **Dark Glassmorphism UI**: Native AI Lab dark theme integration.

## How to Run
```bash
cd desktop
npm install
npm start
```

## How to Package Executable (`.exe`)
```bash
npm run build:win
```
Generates standalone Windows installer in `desktop/dist/`.
