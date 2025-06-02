import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import PageNotFound from './Pages/PageNotFound';
import ProtectedRoutes from './utils/ProtectedRoutes';
import MyProfile from './Pages/MyProfile';

const App = () => {

  const token = localStorage.getItem('token')

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={token ? <Navigate to='/home' /> : <Navigate to='/register' />} />
            <Route path='/register' element={!token ? <Register /> : <Navigate to="/home" replace />} />
            <Route path='/login' element={!token ? <Login /> : <Navigate to="/home"/>} replace />
            <Route path='/home' element={<ProtectedRoutes><Home/></ProtectedRoutes>} />
            <Route path='/my-profile' element={<ProtectedRoutes><MyProfile/></ProtectedRoutes>} />
            <Route path='*' element={<PageNotFound/>} />
          </Routes>
          <ToastContainer/>
        </BrowserRouter>
    </>
  )
}

export default App