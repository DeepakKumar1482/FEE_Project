import React from 'react'
import { useSocket } from '../context/Socket';
import {format} from "date-fns"

const ChatBubble = ({message}) => {
    const {username} = useSocket();
    const isFromMe = message.sender.username == username;
    const dateTime = format(new Date(message.createdAt), 'PPp').split(",")
    return (
        <>   
            <div className={`chat ${isFromMe ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                    <div className="w-8 rounded-full">
                        <img className='dark:bg-white'
                            alt=""
                            src={message.sender.imageurl}
                        />
                    </div>
                </div>
                <div className={`chat-bubble text-white ${isFromMe ? 'bg-[#695CFE]' : ''}`}>
                    <p className='text-wrap break-words whitespace-normal w-fit max-w-full'>
                        {message.content}
                    </p>
                </div>
                <div className="chat-footer opacity-50 dark:text-white text-black">{dateTime[0]} {dateTime[2]}</div>
            </div>
        </>
    );
}

export default ChatBubble