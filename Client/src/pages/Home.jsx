import React, { useContext, useEffect, useState } from 'react'
import { PostCard } from '../components'
import { useSocket } from '../context/Socket';

function Home() {
  const {socketInstance, username} = useSocket();
  const [message, setMessage] = useState('');
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
    <div className=''>
        <PostCard/>
    </div>
  )
}

export default Home