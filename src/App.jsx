// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  // 1. Stato per il tema ('light' o 'dark')
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // 2. Funzione per cambiare il tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Salva la preferenza
  };

  // 3. Effetto per applicare la classe al tag <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    // Passiamo la funzione e lo stato del tema alle rotte
    // (Questo è un approccio. Un altro più avanzato userebbe il Context)
    <Routes>
      <Route path="/" element={<HomePage toggleTheme={toggleTheme} theme={theme} />} />
      <Route path="/chat/:botId" element={<ChatPage toggleTheme={toggleTheme} theme={theme} />} />
    </Routes>
  );
}

export default App;


