import React from 'react'
import {Link} from "react-router-dom"
import {Button} from '../index'

function SideBar() {
  const navItems = [
    {
      name: 'Home',
      slug: '/'
    },
    {
      name: 'Search',
      slug: '/search'
    },
    {
      name: 'Messages',
      slug: '/messages'
    },
    {
      name: 'Saved',
      slug: '/saved'
    }, 
  ];

  return (
    <div>
      <div>
        <p>CodeBuddy</p>
      </div>
      <div>
        <ul className='flex flex-col py-4'>
          {navItems.map((item) => (
            <li>
              <Link 
              to={item.slug}
              className='flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800'
              >
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><i class="bx bx-home"></i></span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SideBar