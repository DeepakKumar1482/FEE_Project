import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble'
import axios from 'axios'
import { IoIosSend } from "react-icons/io";
import { useSocket } from '../context/Socket';
import {useInfiniteQuery} from "@tanstack/react-query"
function Chat({conversation}) {
  // aryan is current user
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const {socketInstance, username} = useSocket();
  const chatRef = useRef(null); 

  // const fetchPages = async(pageparam) => {
  //   const token = localStorage.getItem("token");
  //   const response = await axios.post('/api/message/getMessage', {
  //     param: {
  //       cursor: pageparam,
  //       limit : 15
  //     },
  //     headers: { Authorization : 'Bearer ' + token}
  //   }, {receiver: conversation._id},)
  //   return response.data;
  // }

  // const {} = useInfiniteQuery({
  //   queryKey: ['messages'],
  //   queryFn: () =>
  // });

  useEffect(() => {
    const socketUser = conversation.username;
    if(socketInstance){
      socketInstance.emit('typing', {socketUser});
    }
  },[message])  
  
  useEffect(() => {
    const getMessage = async() => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/api/message/getMessage", {receiver : conversation._id}, {headers: { Authorization : 'Bearer ' + token}})
        setMessages(response.data.chats);
      } catch (error) {
        console.log(error);
      }
    }
    getMessage();
  },[])

  useEffect(() => {
    if(socketInstance){
      socketInstance.on('receiveMessage', (data) => {
        setMessages((prev) => [...prev, data]);
      })
    }
  },[])
  useEffect(() => {
    if(chatRef.current){
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    return () => {
      console.log("inside return of ref");
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
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex items-center gap-5 border-b border-gray-300 dark:border-gray-600 px-2 py-2'>
        <img className='h-14 w-14 rounded-full' src={conversation.imageurl} alt="" />
        <div>
          <p className='text-gray-800 cursor-pointer dark:text-white md:text-base text-sm font-semibold'>{conversation.name}</p>
        </div>
      </div>
      <div className='h-full overflow-y-scroll px-2 py-1' ref={chatRef}>
        {messages.map((message, index) => (
          <ChatBubble message={message} key={index}/>
        ))}
      </div>
      <div className='flex items-center gap-2 px-1 py-1'>
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
          onChange={(e) => {
            console.log("hello");
            setMessage(e.target.value)
          }}
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