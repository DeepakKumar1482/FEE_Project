import React, { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import axios from "axios";

const Message = () => {
  const [recipient, setRecipient] = useState(""); // Recipient username
  const [message, setMessage] = useState(""); // Message to be sent
  const [messages, setMessages] = useState({}); // All messages, grouped by conversation
  const [currentUser, setCurrentUser] = useState(""); // Current user's username
  const pusherRef = useRef(null);

  async function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  }

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = await parseJwt(token);
        console.log("This is decoded token -> ", decodedToken);

        if (decodedToken && decodedToken.id) {
          const username = decodedToken.id;
          console.log("This is user name -> ", username);
          setCurrentUser(username);
        } else {
          console.error("No ID found in the token.");
        }
      } else {
        console.error("No token found in localStorage.");
      }
    }

    fetchUserData();
    pusherRef.current = new Pusher("abee743b1c2ab29528ad", {
      cluster: "ap2",
    });

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Subscribe to the user's personal channel
      const channel = pusherRef.current.subscribe(`user-${currentUser}`);

      channel.bind("new-message", (data) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [data.sender]: [...(prevMessages[data.sender] || []), data],
        }));
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() !== "" && recipient.trim() !== "") {
      try {
        await axios.post(
          "http://localhost:8080/api/user/message",
          {
            recipient,
            message,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        // Add the sent message to the local state
        setMessages((prevMessages) => ({
          ...prevMessages,
          [recipient]: [
            ...(prevMessages[recipient] || []),
            { sender: currentUser, recipient, message },
          ],
        }));

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
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>
      <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {!recipient ||
        !messages[recipient] ||
        messages[recipient].length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages[recipient].map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-sm ${
                msg.sender === currentUser
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
