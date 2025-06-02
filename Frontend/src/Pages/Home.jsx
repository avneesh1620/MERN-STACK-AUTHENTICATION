import React from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()

  const name = localStorage.getItem('name')

  const handleLogout = async (e) => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')

    try {

      const response = await axios.post('http://localhost:4000/api/user/logout')

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Logged Out Successfully")
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      }
    } catch (error) {
      const errorMsg = (error.response?.data?.error || error.response?.data?.message || "Error while Logging Out")
      toast.error(errorMsg)
    }
  }

  const handleMyProfile = () => {
    navigate('/my-profile')
  }


  return (
    <>
      <div className='min-h-screen bg-black'>
      <nav className='flex justify-between bg-green-600 p-4'>
        <h1>Welcome to Home Page</h1>
        <div className='flex gap-10'>
          <button className='hover:text-white' onClick={handleMyProfile}>My Profile</button>
          <button className='hover:text-white' type='submit' onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <br /><br />
      <h3 className='flex justify-center text-2xl text-white'>Welcome {name} </h3>
      </div>
    </>
  )
}

export default Home