import { useState,useEffect } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { message } from "antd";
const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const username=localStorage.getItem("username");
    const[isAccepted,setIsAccepted]=useState(false);
    useEffect(() => {
        const fetchNotifications = async () => {
            try{
                const res = await axios.get(`http://localhost:8080/api/user/getNotifications?username=${username}`);
                if(res.data.success){
                    console.log("This is notifications data -> ",res.data.data);
                    setNotifications(res.data.data);
                    setIsAccepted(res.data.isAccepted);
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchNotifications();
    },[])
  return (
    <div className="p-10 w-full h-full">
        <div className="w-full flex justify-center">
        <h1 className="text-black text-2xl">Notifications</h1>
        </div>
        <div className="overflow-auto">
            {notifications.map((notification, key) => {
                if(!notification.isAccepted){
                return <Card key={key} values={notification} />;
                }
            })}
            </div>
    </div>
  )
}
const Card = ({ values }) => {
    console.log("This is card user data -> ",values);
    const navigate = useNavigate();
    const username=localStorage.getItem("username");
    const RenderToProfile=()=>{
        navigate(`/userprofile/${values.userid.username}`);
    }  
    const RequestAccept=async()=>{
        try{
            const res=await axios.post(`http://localhost:8080/api/user/AcceptConnection`,{sender:username,reciever:values.userid._id,notificationid:values._id});
            if(res.data.success){
                message.success("Connection Accepted");
            }
        }catch(e){
            console.log(e);
        }
    } 
    return (
            <div className="bg-blue-50 shadow-md border border-b-slate-500 rounded-md w-full h-16 mt-20 flex items-center justify-between pr-4 ps-4 text-black text-xl">
            {/* Access values.username and values.imageurl */}
            <div className="flex gap-x-5 justify-center items-center">
            <img src={values.userid.imageurl} alt="Avatar" className="w-10 h-10 rounded-full" />
            <h1><span className="text-blue-400 cursor-pointer hover:text-blue-500" onClick={RenderToProfile}>{values.userid.username}</span> have sent you a connection request</h1> 
            </div>
            <div className="flex gap-10">
                {/* {values.isAccepted?<h1 className="text-green-500">Accepted</h1>:<h1 className="text-red-500">Pending</h1>} */}
                <button onClick={RequestAccept} className="bg-success p-2 px-3 rounded-md text-white">Accept</button>
                <button className="bg-error p-2 px-3 rounded-md text-white">Reject</button>
            </div>
        </div>
    );
};

export default Notifications
