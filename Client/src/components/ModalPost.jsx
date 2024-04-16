import React, { useRef, useState } from 'react';
import {motion} from "framer-motion";
import {LikesModalComp} from "./index.js"
function ModalPost({onClose}) {

  const postData = {
    postId: '',
    avatar: 'https://google.com',
    name: 'Aryan Singh',
    username: 'aryansingh645',
    postImage: 'https://media.istockphoto.com/id/649356542/photo/adventurous-people-making-ascent-to-high-mountain-walking-on-glacier.jpg?s=2048x2048&w=is&k=20&c=9DT0JR9qlhdI2dfFHKQ5V7vuIRYb0AilSk7y_c1EmpE=',
    techStack: ['React', 'Antd', 'Mongo DB', 'Firebase','gohoi','hhgaoag'],
    caption: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan',
    timeOfPost: '02:03 PM Apr 4, 2024',
    gitHubRepo: 'https://github.com/',
    comments : [
      {
        username: 'tyson007',
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan'
      },
      {
        username: 'tyson007',
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan'
      },
      {
        username: 'tyson007',
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan'
      },
      {
        username: 'tyson007',
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan'
      },
      {
        username: 'tyson007',
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan'
      },
      {
        username: 'tyson007',
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan'
      },
  ],
    likes: [
        {
        name: "Aryan Singh",
        username: "tyson001"
        },
        {
        name: "Aryan Singh",
        username: "tyson002"
        },
        {
        name: "Aryan Singh",
        username: "tyson003"
        },
        {
        name: "Aryan Singh",
        username: "tyson004"
        },
        {
        name: "Aryan Singh",
        username: "tyson005"
        },
        {
        name: "Aryan Singh",
        username: "tyson006"
        },
        {
        name: "Aryan Singh",
        username: "tyson007"
        },
],
    saved: true
};

const overlayDivRef = useRef(null);

const closeModal = (e) => {
  if(overlayDivRef.current == e.target){
    onClose();
  }
}

const [isLikeModal, setIsLikeModal] = useState(false);
const num = 1234555;


  return (
    <div 
    ref={overlayDivRef} 
    onClick={closeModal}
    className='fixed inset-0 flex bg-opacity-10 backdrop-blur-sm bg-black dark:bg-white dark:bg-opacity-5 justify-center items-center'>
      <motion.div 
      initial={{scale: 0}}
      animate={{scale: 1}}
      className='flex justify-center items-center dark:bg-[#242526] bg-white rounded-lg w-[65rem] h-[40rem]'>
        <div className='w-1/2'>
          <img src={postData.postImage} alt="" srcset="" />
        </div> {/*Post Media Side*/}
        <div className=' dark:bg-[#242526] bg-white hide-scrollbar w-1/2 overflow-y-scroll relative h-full px-0 pt-4 rounded-lg'>
          <div className='flex gap-1 px-3 items-center'>
            <div className='rounded text-lg dark:text-white text-gray-800'>
              {/* <img src={postData.avatar} alt="" srcset="" /> */}
              <i className='bx bx-user'></i>
            </div>
            <div className='dark:text-white text-gray-800'>
              <p>{postData.username}</p>
            </div>
          </div>
          <div className='dark:text-white px-3 text-gray-800'>
            <p>{postData.caption}</p>
          </div>{/*Caption*/}

          <div className='px-3'>
            <hr className='my-4' />
          </div>

          <div className='flex flex-col px-3 dark:text-white text-gray-800'>
            {postData.comments.map(commentData => (
              <div className='my-2'>
              <span>
                {/* <img src={} alt="" /> */}
                <i className='bx bx-user'></i>
              </span>
              <span className='font-bold mr-1'>
                {commentData.username}
              </span>
              <span className='ml-1'>
                {commentData.comment}
              </span>
            </div>
            ))}
          </div>{/*Comment*/}
          <div className='sticky w-full px-3 py-1 pb-2 flex flex-col gap-2 bottom-0 dark:bg-[#242526] bg-white'>
            <hr />
            <div className='flex text-3xl justify-between dark:text-white text-gray-800'>
              <div className='flex gap-2'>
                <i className='bx bx-message-rounded cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]'></i>
                <i className='bx bx-heart cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]' onClick={(e) => {
                    e.currentTarget.classList.toggle('bxs-heart');
                }}></i>
                <i className='bx bx-bookmark cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]' onClick={(e) => {
                    e.currentTarget.classList.toggle('bxs-bookmark');
                }}></i>
              </div>
              <i className='bx bx-send cursor-pointer active:scale-[.85] dark:hover:text-gray-300 hover:text-gray-500 duration-100'></i>
            </div>
            <div className='dark:text-white text-gray-800'>
              <span onClick={() => {
                document.body.style.overflowY = 'hidden';
                setIsLikeModal(true);
              }} 
              className='hover:text-blue-400 px-1 cursor-pointer active:text-blue-500'>{num.toLocaleString('hi-IN')} Likes</span>
            </div>
            <div className='flex items-end gap-4'>
                <textarea 
                placeholder='Add Comment...'
                className='focus:outline-none border-b-[1px] mb-[1px] w-full dark:text-white text-gray-800 bg-transparent resize-none h-12 placeholder:px-1 placeholder:bottom-1 placeholder:absolute focus-within:placeholder:text-transparent'
                />
                <button className='text-white hover:bg-[#5E52E3] hover:scale-95 duration-200 active:bg-[#574DD4] active:scale-90 bg-[#695CFE] px-4 py-1 h-fit rounded-xl'>Post</button>
            </div>
          </div>{/*Likes && Add Comment*/}
        </div>{/*Caption, Comment and Likes Side*/}
      </motion.div>
      <div>
        <i onClick={onClose} className='bx bx-x absolute top-0 dark:text-white text-gray-800 text-5xl cursor-pointer'></i>
      </div>
      {isLikeModal && <LikesModalComp onClose ={() => {
            setIsLikeModal(false);
            }}/>}
    </div>
  )
}

export default ModalPost