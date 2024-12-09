import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble'
import axios from 'axios'
import { IoIosSend } from "react-icons/io";
import { useSocket } from '../context/Socket';

function Chat({conversation, receiver}) {
  // aryan is current user
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const {socketInstance, username} = useSocket();
  const chatRef = useRef(null); 
  useEffect(() => {
    const getMessage = async() => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/api/message/getMessage", {receiver : conversation._id}, {headers: { Authorization : 'Bearer ' + token}})
        console.log("response: " + response.data.chats[0].sender.username);
        setMessages(response.data.chats);
      } catch (error) {
        console.log(error);
      }
    }
    getMessage();
  },[])

  useEffect(() => {
    if(socketInstance){
      console.log("inside socket");
      socketInstance.on('receiveMessage', (data) => {
        console.log("inside socket event");
        setMessages((prev) => [...prev, data]);
      })
    }
  },[])
  useEffect(() => {
    if(chatRef.current){
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  },[messages])


  const sendMessage = async() => {
    try {
      if(message.trim() === ''){
        setMessage('');
        return;
      } 
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/message/sendMessage", {receiver : conversation._id, message}, {headers: {Authorization: 'Bearer '+ token}});

      setMessage('');
      
      // if(socketInstance){
        // socketInstance.emit("privateChat", {username, message, receiver});
      //   setMessage('')
      // }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col px-2 py-3 h-screen'>
      <div className='h-full overflow-y-scroll' ref={chatRef}>
        {messages.map((message, index) => (
          <ChatBubble message={message} key={index}/>
        ))}
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-full'>
          <input 
          className='bg-transparent rounded-lg w-full' 
          placeholder='Message...' 
          type="text" 
          value={message}
          onKeyDown={(event) => {
            if(event.key === 'Enter' ){
              sendMessage();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div>
          <button onClick={()=>{sendMessage()}} className='bg-[#695CFE] flex items-center gap-1 py-2 px-3 rounded-lg text-white hover:bg-[#5E52E3] hover:scale-95 duration-200 active:bg-[#574DD4] active:scale-90'>Send <IoIosSend /></button>
        </div>
      </div>
    </div>
  )
}

export default Chat