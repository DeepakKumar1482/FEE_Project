import React, { useEffect, useState } from 'react'
import {Outlet} from "react-router-dom"
import { SideBar, } from './components'
import { useSocket } from './context/Socket';

function Layout() {
  const {username, socketInstance, setSocketInstance} = useSocket();
  useEffect(() => {
   if(socketInstance){
    socketInstance.on('disconnect', {username});
   }
    return () => {
      if(socketInstance)socketInstance.disconnect();
    };
  },[socketInstance])
  return (
      <div className='flex justify-between'>
          <SideBar/>
          <main className='w-full flex justify-center '>
              <Outlet/>
          </main>
          {/* <Footer/> */}
      </div>
  )
}

export default Layout