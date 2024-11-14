import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/Socket';
import { MdKeyboardArrowDown} from "react-icons/md";
import {TiMessages} from "react-icons/ti"
import axios from "axios";
import Chat from './Chat';

const Message = () => {
  // const [recipient, setRecipient] = useState(""); // Recipient username
  // const [message, setMessage] = useState(""); // Message to be sent
  // const {messages, setMessages, socketInstance, username} = useSocket();
  

  // const handleSendMessage = () => {
  //   socketInstance.emit("privateChat", {username, message, recipient});
  //   setMessage('');
  // };

  // return (
  //   <div className="w-4/5 mx-auto p-4 border border-gray-300 rounded-lg bg-white shadow-md">
  //     <div className="mb-4">
  //       <input
  //         type="text"
  //         className="w-full p-2 border border-gray-300 rounded mb-2"
  //         placeholder="Recipient Username"
  //         value={recipient}
  //         onChange={(e) => setRecipient(e.target.value)}
  //       />
  //       <input
  //         type="text"
  //         className="w-full p-2 border border-gray-300 rounded mb-2"
  //         placeholder="Type a message..."
  //         value={message}
  //         onChange={(e) => setMessage(e.target.value)}
  //       />
  //       <button
  //         className="w-full p-2 bg-blue-500 text-white rounded"
  //         onClick={handleSendMessage}
  //       >
  //         Send
  //       </button>
  //     </div>
  //     <div className="h-64 overflow-y-auto border-t border-gray-300 pt-2">
  //       {messages.map((msg, index) => (
  //         <div key={index} className="mb-2">
  //           <strong>{msg.username}:</strong> {msg.message}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  const arr =[1,2,3,4,5,6,7,8,9];
  const [isLoading, setIsLoading] = useState(false);
  const {username} = useSocket();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [receiver, setReceiver] = useState('');
  useEffect(() => {
    setIsLoading(true);
    const getConversation = async() => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/message/getConversation", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(": ", response.data);
        setConversation(response.data.conversations)
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getConversation();
  },[])


  return (
      <div className="w-full flex">
          <div className="w-1/4 border-r-[1px] border-gray-700">
              {isLoading ? (
                  <div className="w-full p-4 space-y-4  divide-y divide-gray-200 rounded animate-pulse dark:divide-gray-700 md:p-6 ">
                      {arr.map((ele, index) => (
                          <div
                              key={index}
                              className="flex items-center justify-between pt-4"
                          >
                              <div className="flex justify-center items-center gap-2">
                                  <div className="h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-600"></div>
                                  <div>
                                      <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                      <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                  </div>
                              </div>
                              <div className="h-6 bg-gray-300 rounded-full dark:bg-gray-700 w-2"></div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="w-full py-4 space-y-4 divide-gray-200 dark:divide-gray-700 md:py-6 ">
                      {conversation.map((data, index) => (
                          <div
                              onClick={() => {
                                setSelectedConversation(data)
                                setReceiver(data.username)
                            }}
                              key={index}
                              className="flex items-center justify-between md:py-3 md:px-4 py-2 px-2 hover:cursor-pointer hover:dark:bg-neutral-800 hover:bg-neutral-100"
                          >
                              <div className="flex justify-center items-center gap-3">
                                  <div className="md:h-14 md:w-14 h-11 w-11 relative">
                                      <img
                                          className="w-full h-full rounded-full"
                                          src={data.imageurl}
                                          alt=""
                                      />
                                  </div>
                                  <div>
                                      <div className="text-gray-800 dark:text-white md:text-base text-sm font-semibold">
                                          {data.name}
                                      </div>
                                      <div className="dark:text-gray-400 italic md:text-base text-sm">
                                          @{data.username}
                                      </div>
                                  </div>
                              </div>
                              <div className="">
                                  <MdKeyboardArrowDown className="dark:text-white" />
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
          <div className="w-2/4 text-gray-800 dark:text-white">
              {selectedConversation ? (
                  <Chat receiver={receiver} conversation={selectedConversation}/>
              ) : (
                  <div className='flex gap-2 justify-center items-center flex-col text-gray-800 dark:text-white text-2xl h-full'>
                    <p>Welcome 👋 <span className='italic text-[#695CFE]'>{username}</span></p>
                    <p>Select a conversation to start messaging</p>
                    <div>
                      <TiMessages className='text-5xl'/>
                    </div>
                  </div>
              )}
          </div>
      </div>
  );
};

export default Message;