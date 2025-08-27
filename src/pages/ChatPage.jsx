// src/pages/ChatPage.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { chatbotData } from '../chatbot-data';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

function ChatPage({ toggleTheme, theme }) {
  const { botId } = useParams();
  const currentBot = chatbotData.find(bot => bot.id === botId);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Ciao! Sono ${currentBot?.name}. Come posso aiutarti oggi?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userText) => {
    const newUserMessage = { sender: 'user', text: userText };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText, botId: currentBot.id }),
      });
      if (!response.ok) throw new Error("La richiesta al server è fallita");
      
      const data = await response.json();
      const botReply = { sender: 'bot', text: data.reply };
      setMessages(prevMessages => [...prevMessages, botReply]);

    } catch (error) {
      console.error("Errore durante la chiamata al backend:", error);
      const errorMessage = { sender: 'bot', text: 'Oops! Qualcosa è andato storto. Riprova.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentBot) {
    return <p>Bot non trovato</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Header toggleTheme={toggleTheme} theme={theme} />
      <main className="flex-1 flex flex-col p-4 max-w-3xl mx-auto w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{currentBot.name}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{currentBot.description}</p>
        <MessageList messages={messages} isLoading={isLoading} />
        <div className="mt-4">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  );
}

export default ChatPage;