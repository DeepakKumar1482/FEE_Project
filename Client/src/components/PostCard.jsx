import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

function PostCard() {
    const postData = {
        avatar: 'https://google.com',
        name: 'Aryan Singh',
        username: 'aryansingh645',
        postImage: 'https://media.istockphoto.com/id/649356542/photo/adventurous-people-making-ascent-to-high-mountain-walking-on-glacier.jpg?s=2048x2048&w=is&k=20&c=9DT0JR9qlhdI2dfFHKQ5V7vuIRYb0AilSk7y_c1EmpE=',
        techStack: ['React', 'Antd', 'Mongo DB', 'Firebase','gohoi','hhgaoag'],
        caption: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. A, rem maiores dolorum possimus delectus necessitatibus nemo itaque libero voluptatem fugit loreanong bohghang  sdnjbgkkd  hoisgonn  agboan',
        timeOfPost: '02:03 PM Apr 4, 2024',
        gitHubRepo: 'https://github.com/',
        comments : {},
        likes: [],
        saved: true
    };

    const[isOpen, setIsOpen] = useState(false);

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
    <div className='flex flex-col gap-2 w-[28rem]  px-5 py-8 rounded-xl justify-evenly min-h-screen'>
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
        <div  className='flex justify-center'>
            <img className='rounded-xl' src={postData.postImage} alt="" />
        </div> {/* post image */}

        <div id='tech-stack-postcard' className='flex gap-2 overflow-x-scroll'>
            {postData.techStack.map((tech) => (
                <div className='flex items-center gap-1 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 min-w-fit'>
                    <div className='bg-green-600 w-2 h-2 rounded'></div>
                    <p>{tech}</p>
                </div>
            ))}
        </div> {/* tech stack */}

        <div  className='dark:text-white text-gray-800 '>
            <p ref={myRef} className='h-[4.5rem] overflow-y-hidden' onc>{postData.caption}</p>
            {isOpen? <div className='cursor-pointer text-indigo-400 hover:text-indigo-500'>view more...</div> : null}
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
            <i className='bx bx-message-rounded cursor-pointer dark:hover:text-gray-300'></i>
            <i className='bx bx-heart cursor-pointer dark:hover:text-gray-300' onClick={(e) => {
                e.currentTarget.classList.toggle('bxs-heart');
            }}></i>
            <i className='bx bx-bookmark cursor-pointer dark:hover:text-gray-300' onClick={(e) => {
                e.currentTarget.classList.toggle('bxs-bookmark');
            }}></i>
        </div> {/* comments like and bookmark button */}
        <hr className='dark:bg-white bg-gray-700 h-[1.5px]' />
    </div>
  )
}

export default PostCard