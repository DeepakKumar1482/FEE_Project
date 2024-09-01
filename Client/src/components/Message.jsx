import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";

const Message = () => {
  const [username, setUsername] = useState(""); // Recipient username
  const [message, setMessage] = useState(""); // Message to be sent
  const [messages, setMessages] = useState([]); // All messages

  // Initialize Pusher and subscribe to the channel
  useEffect(() => {
    const pusher = new Pusher("abee743b1c2ab29528ad", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("chat");

    channel.bind("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Handle form submission
  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() !== "" && username.trim() !== "") {
      try {
        await axios.post(
          "http://localhost:8080/api/user/message",
          {
            recipient: username,
            message,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setMessage(""); // Clear the message input field
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  return (
    <div className="w-4/5 mx-auto p-4 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Recipient username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>
      <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-sm ${
                msg.sender === username
                  ? "bg-blue-100 text-right self-end ml-auto"
                  : "bg-gray-100 text-left self-start mr-auto"
              }`}
            >
              <strong className="block text-sm mb-1">{msg.sender}</strong>
              <span>{msg.message}</span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={sendMessage} className="space-y-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
