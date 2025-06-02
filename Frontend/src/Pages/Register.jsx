import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev)
    }

    const [registerInfo, setRegisterInfo] = useState({
        name: '',
        email: '',
        password: '',
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:4000/api/user/register', registerInfo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const { name, token } = response.data

            localStorage.setItem('name', name)
            localStorage.setItem('token', token)

            if (response.data && response.data.success) {
                toast.success(response.data.message || 'User Registered Successfully!');
                setTimeout(() => {
                    navigate('/home')
                }, 1500)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Something went wrong';
            toast.error(errorMsg);
        }
    }

    return (
        <>
            <div className='min-h-screen bg-black'>
            <h1 className="text-3xl font-bold mb-8 text-center text-green-500">Welcome to Registration Page</h1>
            <br /><br />
            <form onSubmit={handleRegister} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <label className="block mb-2 text-gray-700 font-semibold">Name</label>
                <input className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder='Enter your Name' name='name' onChange={handleChange} />
                <br />
                <label className="block mb-2 text-gray-700 font-semibold">Email</label>
                <input className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required type="email" placeholder='Enter your Email' name='email' onChange={handleChange} />
                <br />
                <label className="block mb-2 text-gray-700 font-semibold">Password</label>
                <input className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required type={showPassword ? 'text' : 'password'} placeholder='Enter your Password' name='password' onChange={handleChange} />
                <div className="flex items-center mb-6">
                    <input className="mr-2" type="checkbox" onChange={handleTogglePassword} /><label className="text-gray-700 select-none">Show Password</label>
                </div>
                <br />
                <button className="w-full bg-green-700 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition" type='submit'>Register</button>
                <br /><br />
                <p className="mt-6 text-center text-gray-600">Already have an Account.<Link to='/login' className="text-blue-600 hover:underline">Click here to login</Link></p>
            </form>
            </div>
        </>
    )
}

export default Register