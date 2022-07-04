import React from 'react'

export const NavButton = (props) => {
  return (
    <div className='m-1'>
        <a href="#_" className="border-2 border-indigo-100 px-5 py-2.5 font-medium bg-blue-50 hover:bg-blue-100 hover:text-blue-600 text-blue-500 rounded-lg text-sm">
            {props.name}
        </a>
    </div>
  )
}