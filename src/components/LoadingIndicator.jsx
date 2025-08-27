// src/components/LoadingIndicator.jsx

import React from 'react';

function LoadingIndicator() {
  // We include the CSS animation styles directly here for simplicity.
  const style = `
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    .dot-bounce {
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .dot1 { animation-delay: -0.32s; }
    .dot2 { animation-delay: -0.16s; }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg max-w-lg break-words self-start flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full dot-bounce dot1"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full dot-bounce dot2"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full dot-bounce"></div>
      </div>
    </>
  );
}

export default LoadingIndicator;