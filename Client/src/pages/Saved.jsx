import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ModalPost } from '../components';

const Saved = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [isModalPostOpen, setIsModalPostOpen] = useState(false);
    const [propdata, setPropData] = useState({});

    useEffect(() => {
        const apiCall = async() => {
            const token = localStorage.getItem("token");
            const response = await axios.get('/api/posts/getSavePosts', {headers: {Authorization: 'Bearer '+ token}})
            if(response.data.success){
                setSavedPosts(response.data.savedPosts);
                console.log(response.data.savedPosts);
            }
            else{
                message.error(response.data.message);
            }
        }
        apiCall();
    },[])
    return (
        <>
            <div className="flex flex-col items-center gap-5 w-[75%] py-5 px-3 max-h-screen">
                <h1 className="text-4xl dark:text-white text-gray-800">
                    Saved Posts
                </h1>
                <div className="flex flex-col gap overflow-y-scroll w-full h-full">
                    <div className="flex flex-wrap w-full h-full">
                        {savedPosts.map((savedPost, index) => (
                            <div
                                key={index}
                                className="w-1/3 h-[50%] border-[3px] dark:border-black border-white cursor-pointer hover:opacity-75 active:opacity-60"
                                onClick={() => {
                                    setPropData(savedPost);
                                    setIsModalPostOpen(true);
                                }}
                            >
                                <img
                                    src={savedPost.imageUrls[0]}
                                    className="w-full h-full object-cover bg-gray-200 dark:bg-white"
                                    alt=""
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isModalPostOpen && (
                <ModalPost
                    data={propdata}
                    onClose={() => {
                    document.body.style.overflowY = "visible";
                    setIsModalPostOpen(false);
                    }}
                />
            )}
        </>
    );
}

export default Saved