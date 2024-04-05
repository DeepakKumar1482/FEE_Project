import React, { useEffect, useState } from 'react'
import {useNavigate, NavLink, Link} from "react-router-dom"
// import {Button} from '../index'

function SideBar() {
  const navItems = [
    {
      name: 'Home',
      slug: '/',
      icon: 'home'
    },
    {
      name: 'Search',
      slug: '/search',
      icon: 'search'
    },
    {
      name: 'Messages',
      slug: '/messages',
      icon: 'chat'
    },
    {
      name: 'Saved',
      slug: '/saved',
      icon: 'bookmark'
    }, 
    {
      name: 'Notifications',
      slug: '/notifications',
      icon: 'bell'
    }, 
  ];

  function handleSize() {
    if(window.innerWidth <= 1024){
      console.log("running");
      return false;
    }
    else{
      return true;
    }
  }
  const [open, setOpen] = useState(handleSize);

  // useEffect(() => {
  //   window.addEventListener('resize', function handleChange(){
  //     if(window.innerWidth <= 1024){
  //       setOpen(false);
  //       console.log('inside');
  //     }
  //     else{
  //       setOpen(true);
  //     }
  //   });
  // })
  window.addEventListener('resize', function handleChange(){
    if(window.innerWidth <= 1024){
      setOpen(false);
    }
    else{
      setOpen(true);
    }
  });

  return (
    <div className={`fixed left-0 ${open ? "w-64" : "w-16"} duration-300 h-screen dark:bg-[#242526] bg-white dark:border-[#3A3B3C] border-r-[1px]`}>
      <div className="flex items-center py-5 ">
        <Link 
          to="/"
          className='flex text-[#695CFE] cursor-pointer flex-row items-center h-12 dark:hover:text-gray-300 hover:text-gray-800 mb-2'>
        <div className='flex justify-start items-center'>
          <span className="inline-flex items-center justify-center h-12 w-12 text-5xl ml-2"><i className={`bx bx-user`}></i></span>
          <div className={`flex flex-col justify-center ml-1 ${open ? "" : "scale-0"} duration-300`}>
            <p className='text-2xl font-[550] '>CODEBUDDY</p>
            <p className='text-gray-800 font-medium text-xs ml-[2px] dark:text-white'>Coding Together Now</p>
          </div>
        </div>
        </Link>
      </div>
      {/* <hr className='h-[2px] dark:h-[1px] -mt-1 mb-3 w-full bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent' /> */}
      <div>
        <ul className='flex flex-col py-4 px-2'>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
              to={item.slug}
              className='flex cursor-pointer flex-row items-center h-12 duration-200 text-gray-800 dark:text-white dark:hover:text-gray-300 mb-3 hover:scale-105 hover:bg-[#695CFE] hover:text-white rounded-lg dark:hover:bg-[#3A3B3C] transition-bg-color justify-between'
              >
                <div className='flex justify-start items-center'>
                  <span className="inline-flex relative items-center justify-center h-12 w-12 mr-1 text-2xl"><i className={`bx bx-${item.icon}`}>{((item.name == "Notifications" || item.name == "Messages") && !open) ? <div className='w-2 h-2 bg-red-500 rounded absolute top-2'></div> : null}</i></span>
                  <span className={`text-base font-[550] ${open ? "" : "scale-0"} duration-300`}>{item.name}</span>
                </div>
                <span className={`${((item.name == "Notifications" || item.name == "Messages") && open) ? "" : "scale-0"} mr-6 text-sm bg-red-100 rounded-full float-right px-3 py-px text-red-500`}>5</span>
                {/* {((item.name == "Notifications" || item.name == "Messages") && open) ? <span className="mr-6 text-sm bg-red-100 rounded-full float-right px-3 py-px text-red-500">5</span> : null} */}
              </Link>
            </li>
          ))}
        </ul>
        <div className='absolute bottom-2 w-full px-2'>
          <NavLink 
          to='/'
          className={({isActive}) => 
          `flex flex-row items-center  h-12 duration-200 text-gray-800 dark:text-white dark:hover:text-gray-300 mb-3 hover:scale-105 hover:bg-[#695CFE] hover:text-white rounded-lg dark:hover:bg-[#3A3B3C] ${isActive? "text-gray-500" : "text-gray-800"}`}
          >
            <div className='flex justify-start items-center'>
              <span className="inline-flex items-center justify-center h-12 w-12 text-2xl mr-1"><i className={`bx bx-user`}></i></span>
              <span className={`text-base font-[550] ${open ? "" : "scale-0"}`}>Profile</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default SideBar