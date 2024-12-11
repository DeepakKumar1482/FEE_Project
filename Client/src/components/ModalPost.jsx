import React, { useEffect, useRef, useState } from 'react';
import {motion} from "framer-motion";
import ImageCarousel3 from './ImageCarousel3.jsx';
import {LikesModalComp} from "./index.js"
import { useUser } from '../ContextApi/UserContext.jsx';
import axios from 'axios';
import { message } from 'antd';

function ModalPost({onClose,data}) {
  const [num, setNum] = useState(data.likes.length);
  const [commentsData, setCommentsData] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("This is from props -> ",data);
  const {userLikedPosts, setuserlikedPosts, userSavedPosts, setuserSavedPosts} = useUser();
  // console.log("liked: ",userLikedPosts)

  useEffect(() => {
    setIsLoading(true);
    const apiCall = async() => {
      const response = await axios.post('/api/posts/getComment', {postId: data._id})
      if(response.data.success){
        setCommentsData(response.data.commentData);
      }
      else{
        message.error(response.data.message);
      }
    }
    apiCall();
    likePostFunction(data._id);
  },[])

  useEffect(() => {
    setIsLoading(false);
  },[commentsData])
  
  const likePostFunction = async(postId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post('/api/posts/like-post', {postId}, {headers: {Authorization: 'Bearer '+ token}})
    // likeRef.current.classList.toggle("bxs-heart");
    // console.log("like: ", likeRef.current);
    if(response.data.success){
      console.log(response.data)
      // setNum(response.data.likesCount);
    }
    else{
      message.error(response.data.message)
    }
  }
  const savePostFunction = async(postId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post('/api/posts/save-post', {postId}, {headers: {Authorization: 'Bearer '+ token}})
    if(response.data.success){
      // console.log(response.data.message)
    }
    else{
      message.error(response.data.message)
    }
  }
  // useEffect(() => {
  //   const apiCall = async() => {
  //     const response = await axios.post('/api/user/getuser', {username: localStorage.getItem('username')})
  //     if(response.data.success){
  //       setuserlikedPosts(response.data.data.likedPosts)
  //       setuserSavedPosts(response.data.data.savedposts);
  //     }
  //   }
  //   likePostFunction(data._id);    
  // },[]);
const overlayDivRef = useRef(null);

const closeModal = (e) => {
  if(overlayDivRef.current == e.target){
    onClose();
  }
}

const [isLikeModal, setIsLikeModal] = useState(false);
// console.log(num);

  const postComment = async() => {
    if(newCommentText.trim().length == 0) return;
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/posts/addComment', {text: newCommentText, postId: data._id}, { headers: {Authorization: 'Bearer ' + token}})
    if(response.data.success){
      setCommentsData((prev) => [response.data.addedCommentData, ...prev])
    }
    else{
      message.error(response.data.message);
    }
    setNewCommentText('')
  }


  return (
    <div 
    ref={overlayDivRef} 
    onClick={closeModal}
    className='fixed z-50 inset-0 flex flex-col bg-opacity-10 bg-black dark:bg-opacity-10 justify-center items-center'>
      <div className='w-full flex justify-end px-8 -'>
        <i onClick={onClose} className='bx bx-x text-white text-5xl cursor-pointer'></i>
      </div>
      <motion.div 
      initial={{scale: 0}}
      animate={{scale: 1}}
      className='flex justify-center items-center dark:bg-[#242526] bg-white rounded-lg w-[65rem] h-[40rem] -mt-4'>

        <div className='flex w-[55%] h-full rounded-xl justify-center items-center bg-black'>
            <ImageCarousel3 data={data.imageUrls} height={'h-[40rem]'}/>
          {/* <div className='flex justify-center items-center'> */}
          {/* </div> */}
        </div> {/*Post Media Side*/}

        <div className=' dark:bg-[#242526] bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 w-[45%] relative h-full px-0 pt-2 rounded-lg '>
          <div className='flex gap-1 px-3 items-center h-[5%] py-2 '>
            <div className='rounded text-lg dark:text-white text-gray-800'>
              <img className='w-10 h-10 rounded-full' src={data.userid.imageurl} alt="" />
            </div>
            <div className='dark:text-white text-gray-800'>
              <p>@ {data.userid.username}</p>
            </div>
          </div>

          <div className='flex flex-col px-3 gap-2 py-2 h-[75%] overflow-y-scroll dark:text-white text-gray-800'>
            <div className='dark:text-white px-3 text-gray-800 mt-2'>
              <p className='text-wrap break-all whitespace-normal w-full max-w-full'>{data.description}</p>
            </div>
            <div className='flex flex-col'>
              {commentsData.length > 0 ?
                commentsData.map((commentData, index) => (
                  (<div key={index} className='my-2 flex flex-col gap-2'>
                    <CommentBubble commentData={commentData}/>
                  </div>)
                )) : <div className='flex justify-center items-center '><p>No comments to show</p></div>
              }
            </div>
          </div>

          <div className=' w-full px-3 py-1 h-[20%] flex flex-col gap-2 dark:bg-[#242526] bg-white justify-end'>
            <hr />
            <div className='flex text-3xl justify-between dark:text-white text-gray-800'>
              {/* <div className='flex gap-2'>
                <i className='bx bx-message-rounded cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]'></i>
                <i className={`bx bx-heart cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85] ${userLikedPosts?.includes(data._id) ? "bxs-heart" : ""}`} onClick={(e) => {
                    e.currentTarget.classList.toggle('bxs-heart');
                    likePostFunction(e, data._id);
                }}></i>
                <i className={`bx bx-bookmark cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85] ${userSavedPosts?.includes(data._id) ? "bxs-bookmark": ""}`} onClick={(e) => {
                    e.currentTarget.classList.toggle('bxs-bookmark');
                    savePostFunction(data._id);
                }}></i>
              </div> */}
              <div className='dark:text-white text-base text-gray-800'>
                <span onClick={() => {
                  document.body.style.overflowY = 'hidden';
                  setIsLikeModal(true);
                }} 
                className='hover:text-blue-400 px-1 cursor-pointer active:text-blue-500'>{num} Likes</span>
              </div>
              <i className='bx bx-send cursor-pointer active:scale-[.85] dark:hover:text-gray-300 hover:text-gray-500 duration-100'></i>
            </div>
            <div className='flex items-end gap-4 '>
                <textarea
                value={newCommentText}
                onChange={(e) => {
                  setNewCommentText(e.target.value);
                }}
                placeholder='Add Comment...'
                className='focus:outline-none border-b-[1px] mb-[1px] w-full dark:text-white text-gray-800 bg-transparent resize-none h-12 placeholder:px-1 placeholder:bottom-1 placeholder:absolute focus-within:placeholder:text-transparent rounded-lg'
                />
                <button onClick={postComment} className='text-white hover:bg-[#5E52E3] hover:scale-95 duration-200 active:bg-[#574DD4] active:scale-90 bg-[#695CFE] px-4 py-1 h-fit rounded-xl'>Post</button>
            </div>
          </div>  
          {/*Likes && Add Comment*/}

        </div>{/*Caption, Comment and Likes Side*/}
      </motion.div>
      
      {isLikeModal && <LikesModalComp onClose ={() => {
        setIsLikeModal(false);
      }}/>}
    </div>
  )
}

function CommentBubble({commentData}){
    console.log("commentBubble", commentData);
    return (
      <div className='flex'>
        <div className='flex items-start gap-1'>
          <div className='h-10 w-10'>
            <img className='rounded-full h-full w-full' src={commentData.userId.imageurl} alt=""/>
          </div>
          <div className='flex flex-col w-[75%]'>
            <p className='italic text-sm font-medium'>{commentData.userId.username}</p>
            <p className='italic text-sm text-wrap break-all whitespace-normal w-full max-w-full'>{commentData.text}</p>
          </div>
        </div>
      </div>
    )
}

export default ModalPost