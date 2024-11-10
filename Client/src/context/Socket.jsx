import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext({
    socketInstance: null,
    setSocketInstance: () => {},
    username: '',
    setUsername: () => {},
    messages: [],
    setMessages: () => {},
});

export const SocketContextProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [socketInstance, setSocketInstance] = useState(null);
    const [connection, setConnection] = useState(false);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const socket = io('http://localhost:8080');
        setSocketInstance(socket);
        setConnection(true);

        return () => {
            if(socketInstance)socketInstance.disconnect();
          };
    },[])
    useEffect(() => {
        if(username != null && connection){
            socketInstance.on('connect' , () => {
                socketInstance.emit('login' , {username});
            })
            socketInstance.on('receiveMessage', (data) => {
                setMessages((prev) => [...prev, data]);
            })
        }
    }, [username, socketInstance, connection, setUsername])
    return (
        <SocketContext.Provider value={{username, setUsername, socketInstance, setSocketInstance, messages, setMessages}}>
            {connection ? children : <h1>loading..</h1> }
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
}