import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'
import Snowfall from 'react-snowfall'

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false)
  const user = {
    role: "guest"
  }

  return (
    <div className="min-h-screen">
      <Snowfall snowflakeCount={100} color='black' />
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>

      {/* Overlay (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-100 bg-transparent bg-opacity-100 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex pt-16">
        <div
          className={`
            fixed top-16 left-0 h-full bg-white shadow-md z-50
            transition-transform duration-300
            w-64 md:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          <SideBar user={user} onClose={() => setIsOpen(false)} />

        </div>

        {/* Main Content */}
        <div
          className={`
            flex-1 md:p-4 p-2 transition-all duration-300
          `}
        >
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default MainLayout