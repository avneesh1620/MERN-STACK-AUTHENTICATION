import React from 'react'

const MyProfile = () => {

    const name = localStorage.getItem('name');

  return (
    <>
        <h1>My Profile</h1>
        <br /><br />
        <h3>Name : {name}</h3>
    </>
  )
}

export default MyProfile