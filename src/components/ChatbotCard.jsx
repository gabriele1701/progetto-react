// src/components/ChatbotCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatbotCard({ id, name, description }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        bg-white dark:bg-gray-800         
        shadow-lg rounded-xl              
        p-6 m-4                           
        w-full max-w-sm                   
        cursor-pointer                    
        transform hover:scale-105         
        transition-transform duration-200 
        border border-transparent hover:border-blue-500
      "
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default ChatbotCard;