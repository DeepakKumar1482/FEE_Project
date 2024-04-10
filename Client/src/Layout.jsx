import React from 'react'
import {Outlet} from "react-router-dom"
import { SideBar, } from './components'

function Layout() {
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