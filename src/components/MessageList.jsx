// src/components/MessageList.jsx

// 1. Importa useRef e useEffect
import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark as atomDark } from 'react-syntax-highlighter/dist/styles/atom-one-dark';
import LoadingIndicator from './LoadingIndicator';

function MessageList({ messages, isLoading }) {
  // 2. Crea un "ref" per il contenitore dello scroll
  const scrollContainerRef = useRef(null);

  // 3. Crea un "effetto" che si attiva quando i messaggi cambiano
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    // 4. Collega il ref al div e aggiungi la classe per lo scroll fluido
    <div 
      ref={scrollContainerRef}
      className="
        flex-1 flex flex-col space-y-4 p-4 
        overflow-y-auto 
        bg-white dark:bg-gray-800 
        rounded-lg shadow-inner
        scroll-smooth 
      "
    >
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        const messageBaseClasses = "p-3 rounded-lg max-w-lg break-words";
        const messageSenderClasses = isUser 
          ? "bg-blue-500 text-white self-end"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white self-start";

        return (
          <div 
            key={index} 
            className={`${isUser ? '' : 'prose dark:prose-invert'} ${messageBaseClasses} ${messageSenderClasses}`}
          >
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        );
      })}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}

export default MessageList;