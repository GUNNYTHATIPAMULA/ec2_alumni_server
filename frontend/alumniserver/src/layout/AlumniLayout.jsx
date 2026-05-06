import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'

const AlumniLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const user = {
    role: "alumni"
  }

  return (
    <div className='min-h-screen'>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>

      {isOpen && (
        <div
          className="fixed inset-100 bg-transparent bg-opacity-100 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
            fixed top-16 left-0 h-full bg-white shadow-md z-50
            transition-transform duration-300
            w-64
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
      >
        <SideBar user={user} onClose={() => setIsOpen(false)} />

      </div>
      <div className="flex pt-16">
        <div
          className={`
            flex-1 md:p-4 p-2 transition-all duration-300
            md:ml-64
          `}
        >
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default AlumniLayout