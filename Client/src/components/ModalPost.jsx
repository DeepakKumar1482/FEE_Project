import React, { useRef } from 'react';
import {motion} from "framer-motion";

function ModalPost({onClose,data}) {
  console.log("This is from props -> ",data);
  

const overlayDivRef = useRef(null);

const closeModal = (e) => {
  if(overlayDivRef.current == e.target){
    onClose();
  }
}

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
          {
            data.imageurls.map((url)=>(
          <img key={url} src={url} alt="" srcset="" />  
            ))
          }
        </div> {/*Post Media Side*/}
        <div className=' dark:bg-[#242526] bg-white hide-scrollbar w-1/2 overflow-y-scroll relative h-full px-0 pt-4 rounded-lg'>
          <div className='flex gap-1 px-3 items-center'>
            <div className='rounded text-lg dark:text-white text-gray-800'>
              <img className='w-10 h-10 rounded-full' src={data.avatar} alt="" srcset="" />
              {/* <i className='bx bx-user'></i> */}
            </div>
            <div className='dark:text-white text-gray-800'>
              <p>@ {data.username}</p>
            </div>
          </div>
          <div className='dark:text-white px-3 text-gray-800'>
            <p>{data.description}</p>
          </div>{/*Caption*/}

          <div className='px-3'>
            <hr className='my-4' />
          </div>

          {/* <div className='flex flex-col px-3 dark:text-white bg-purple-600 text-gray-800'>
            {postData.comments.map(commentData => (
              <div key={commentData} className='my-2'>
              <span>
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
          </div> */}
          <div className='sticky w-full px-3 py-1 pb-2 flex flex-col gap-2 bottom-0 dark:bg-[#242526] bg-white'>
            <hr />
            <div className='flex text-3xl justify-between dark:text-white text-gray-800 gap-5'>
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
            <div className='relative'>
                <textarea 
                placeholder='Add Comment...'
                className='focus:outline-none focus:border-b-[1px] mb-[1px] w-full dark:text-white text-gray-800 bg-transparent resize-none h-12 placeholder:align-text-bottom'
                />
                <button className='absolute right-0 bottom-3 text-white hover:bg-[#5E52E3] hover:scale-95 duration-200 active:bg-[#574DD4] active:scale-90 bg-[#695CFE] px-4 py-1 rounded-xl'>Post</button>
            </div>
          </div>{/*Likes && Add Comment*/}
        </div>{/*Caption, Comment and Likes Side*/}
      </motion.div>
      <div>
        <i onClick={onClose} className='bx bx-x absolute top-0 dark:text-white text-gray-800 text-5xl cursor-pointer'></i>
      </div>
    </div>
  )
}

export default ModalPost