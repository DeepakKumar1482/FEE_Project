import React, { useEffect, useRef, useState } from 'react'
import { Link} from 'react-router-dom';
import {ModalPost} from "./index"
import myImg from "../images/Screenshot 2024-03-29 112144.png";

function PostCard() {
    const postData = {
        postId: '',
        avatar: 'https://google.com',
        name: 'Aryan Singh',
        username: 'aryansingh645',
        postImage: myImg,
        techStack: ['React', 'Antd', 'Mongo DB', 'Firebase','gohoi','hhgaoag'],
        caption: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan',
        timeOfPost: '02:03 PM Apr 4, 2024',
        gitHubRepo: 'https://github.com/',
        comments : {},
        likes: {},
        saved: true
    };

    const[isOpen, setIsOpen] = useState(false);
    const[isModalPostOpen, setIsModalPostOpen] = useState(false);

    const myRef = useRef(null);
    useEffect(() => {
        const container = myRef.current;
        if(container.scrollHeight > container.clientHeight){
            setIsOpen(true);
        }
        else{
            setIsOpen(false);
        }
    },[postData])

  return (
    <div className='flex flex-col gap-2 w-[30rem] px-5 py-8 rounded-xl justify-evenly h-screen'>
        <div className='flex gap-2 items-center'>
            <div>
                {/* <img src={postData.avatar} alt="" /> */}
                <i className='bx bx-user text-4xl'></i>
            </div>
            <div className='flex flex-col'>
                <p className='dark:text-white text-gray-800 font-semibold font-sans'>{postData.name}</p>
                <p className='dark:text-white text-gray-800 font-semibold font-sans -mt-1'>@ {postData.username}</p>
            </div>
        </div> {/* avatar username */}
        <div  className= {`flex justify-center h-[300px] bg-black`}>
            <img className='rounded-xl object-contain' src={postData.postImage} alt="" />
        </div> {/* post image */}

        <div className='flex hide-scrollbar gap-2 overflow-x-scroll'>
            {postData.techStack.map((tech) => (
                <div key={tech} className='flex items-center gap-1 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 min-w-fit'>
                    <div className='bg-green-600 w-2 h-2 rounded'></div>
                    <p>{tech}</p>
                </div>
            ))}
        </div> {/* tech stack */}

        <div  className='dark:text-white text-gray-800 '>
            <p ref={myRef} className='h-[4.5rem] overflow-y-hidden' >{postData.caption}</p>
            {isOpen? <span onClick={() => {
                document.body.style.overflowY = 'hidden';
                setIsModalPostOpen(true);
                }} className='cursor-pointer text-blue-400 hover:text-blue-500 active:text-indigo-600'>view more...</span> : null}
        </div> {/* caption */}

        <div className='flex items-center justify-between pr-0'>
            <p className='dark:text-white text-gray-800'>{postData.timeOfPost}</p>
            <Link
            to={postData.gitHubRepo}
            className='flex items-center gap-1 bg-cyan-600 hover:bg-cyan-700 rounded-lg px-2 py-1 text-white'
            >
                <i className='bx bxl-github'></i>
                <span className='font-sans font-medium'>GitHub Repo</span>
            </Link>
        </div> {/* time and github repo button */}
        <div className='flex text-3xl dark:text-white text-gray-800 gap-5'>
            <i onClick={() => {
                document.body.style.overflowY = 'hidden';
                setIsModalPostOpen(true);
                }} 
                className='bx bx-message-rounded cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]'></i>
            <i className='bx bx-heart cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]' onClick={(e) => {
                e.currentTarget.classList.toggle('bxs-heart');
            }}></i>
            <i className='bx bx-bookmark cursor-pointer dark:hover:text-gray-300 hover:text-gray-500 active:scale-[.85]' onClick={(e) => {
                e.currentTarget.classList.toggle('bxs-bookmark');
            }}></i>
        </div> {/* comments like and bookmark button */}
        <hr className='dark:bg-white bg-gray-700 h-[1.5px]' />
        {isModalPostOpen && <ModalPost onClose ={() => {
            document.body.style.overflowY = 'visible';
            setIsModalPostOpen(false);
            }}/>}
    </div>
  )
}

export default PostCard