import React, { useRef } from 'react'

function LikesModalComp({onClose}) {
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
    const myRef = useRef();
    const onCloseLikeModal = (e) => {
      if(myRef.current == e.target){
        onClose();
      }
    }
  return (
    <div ref={myRef} onClick={onCloseLikeModal} className='fixed inset-0 flex bg-opacity-10 backdrop-blur-sm bg-black dark:bg-white dark:bg-opacity-5 justify-center items-center'>
        <div className='flex flex-col justify-start dark:bg-[#242526] bg-white rounded-lg w-[22rem] h-[19rem] pl-3 py-3'>
            <div className='flex flex-col items-center justify-center relative dark:text-white text-gray-800 gap-1 pr-3'>
                <p className=''>Likes</p>
                <i onClick={onClose} className=' absolute right-0 -top-[0.4rem] bx bx-x text-3xl cursor-pointer'></i>
                <hr className='w-full dark:border-t border-t-2 ' />
            </div>
            <div className='dark:text-white text-gray-800 overflow-y-scroll pr-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                {postData.likes.map((like) => (
                    <div className='flex gap-3 items-center justify-between' key={like.username}>
                        <div className='flex items-center gap-2'>
                            <span className='text-[2.2rem]'><i className='bx bx-user'></i></span>
                            <div className='flex flex-col'>
                                <span className='text-base'>{like.name}</span>
                                <span className='dark:text-gray-500 text-gray-400 text-sm -mt-1'>{like.username}</span>
                            </div>
                        </div>
                        <div>
                            <button className='bg-[#695CFE] text-sm tracking-wide px-2 py-1 rounded-lg text-white hover:bg-[#5E52E3] active:scale-[0.95] active:bg-[#695CFE]'>Connect</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default LikesModalComp

// market.pmnd