// src/components/MessageInput.jsx
import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <input
        className="
          flex-grow p-3 
          border border-gray-300 dark:border-gray-600 
          rounded-l-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        "
        type="text"
        placeholder="Scrivi il tuo messaggio..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button 
        className="
          bg-blue-500 text-white font-bold px-6 py-3 rounded-r-lg
          hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        type="submit"
      >
        Invia
      </button>
    </form>
  );
}

export default MessageInput;