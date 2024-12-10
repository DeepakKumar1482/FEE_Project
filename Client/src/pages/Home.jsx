import React, { useContext, useEffect, useState } from 'react'
import { PostCard } from '../components'
import { useSocket } from '../context/Socket';

function Home() {
  const {socketInstance, username} = useSocket();
  console.log(socketInstance, "home compo")
  // useEffect(() => {
  //   console.log(socketInstance, "home compo inside")
  //   if(socketInstance){
  //     console.log(socketInstance, "home compo inside socket")
  //     socketInstance.on('connect' , () => {
  //       console.log('connect');
  //       socketInstance.emit('login' , {username});
  //     })
  //   }
  // }, [socketInstance])

  return (
    <div className='flex flex-col items-center w-full'>
        <PostCard/>
    </div>
  )
}

export default Home