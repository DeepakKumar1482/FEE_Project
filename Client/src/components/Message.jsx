import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/Socket';

const Message = () => {
  const [recipient, setRecipient] = useState(""); // Recipient username
  const [message, setMessage] = useState(""); // Message to be sent
  const {messages, setMessages, socketInstance, username} = useSocket();
  

  const handleSendMessage = () => {
    socketInstance.emit("privateChat", {username, message, recipient});
    setMessage('');
  };

  return (
    <div className="w-4/5 mx-auto p-4 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Recipient Username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <div className="h-64 overflow-y-auto border-t border-gray-300 pt-2">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message;