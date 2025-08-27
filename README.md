# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Progetto React AI Chatbot

Questo progetto è un'applicazione web full-stack che implementa un'interfaccia di chat avanzata. L'applicazione consente agli utenti di interagire con diversi assistenti AI, ciascuno con una propria personalità e base di conoscenza specializzata.

## Caratteristiche Principali

-   **Frontend Moderno:** Interfaccia utente reattiva costruita con React 19 e Vite.
-   **Backend Potente:** Server Node.js con Express per la gestione delle logiche di business.
-   **Intelligenza Artificiale:** Integrazione con Google Gemini per la generazione delle risposte.
-   **Sistema RAG (Retrieval-Augmented Generation):** Un bot specializzato in JavaScript utilizza una base di conoscenza locale per fornire risposte precise e contestualizzate.

## Tecnologie Utilizzate

-   **Frontend:** React, Vite, Tailwind CSS, React Router
-   **Backend:** Node.js, Express.js
-   **AI:** Google Gemini, LangChain.js

## Come Avviare il Progetto

Per eseguire il progetto in locale, segui questi passaggi.

### Prerequisiti

-   Node.js (versione 18 o successiva)
-   Git

### 1. Setup

Clona il repository e installa le dipendenze sia per il frontend che per il backend.

```bash
# Clona il repository
git clone https://github.com/gabriele1701/progetto-react.git
cd progetto-react

# Installa le dipendenze del frontend
npm install

# Installa le dipendenze del backend
cd Server
npm install
cd ..
