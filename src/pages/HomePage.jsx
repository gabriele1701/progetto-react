// src/pages/HomePage.jsx

import React from 'react';
import Header from '../components/Header';
import ChatbotCard from '../components/ChatbotCard';
import { chatbotData } from '../chatbot-data';

function HomePage({ toggleTheme, theme }) {
  return (
    // Contenitore principale della pagina
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header toggleTheme={toggleTheme} theme={theme} />
      {/* Contenitore del catalogo */}
      <main className="flex flex-wrap justify-center items-center p-4">
        {chatbotData.map(bot => (
          <ChatbotCard 
            key={bot.id}
            id={bot.id}
            name={bot.name}
            description={bot.description}
          />
        ))}
      </main>
    </div>
  );
}

export default HomePage;