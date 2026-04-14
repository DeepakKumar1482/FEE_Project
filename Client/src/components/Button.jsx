import React from 'react'

function Button({children,type = 'button',className = '',...props}) {
  return (
    <button className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800 ${className}`} {...props}>
      <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-red-400"><i className="bx bx-home"></i></span>
      <span className="text-sm font-medium">{children}</span>
    </button>
  )
}

export default Button