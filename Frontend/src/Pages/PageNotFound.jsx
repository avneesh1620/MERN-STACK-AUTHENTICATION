import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {

    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    const handleNavigateLogin = () => {
        if(token){
            navigate('/home')
        }
        else{
            navigate('/login')
        }
    }

  return (
    <>
        <h1>Error 404 : Page Not Found </h1>
        <br />
        <br />
        <button onClick={handleNavigateLogin}>{token ? "Go to Home Page" : "Click here to Login"}</button>
    </>
  )
}

export default PageNotFound