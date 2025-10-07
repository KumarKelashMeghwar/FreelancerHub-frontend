import { AuthContext } from '../../context/AuthContext.jsx';
import React, { useContext } from 'react'

const Dashboard = () => {
    let {user} = useContext(AuthContext);
    user = user || JSON.parse(localStorage.getItem("user"));

  return (
    <div>
        <h3>Freelancer Dashboard</h3>
        <h1>name: {user?.firstName}</h1>
        <h1>email: {user?.email}</h1>
    </div>
  )
}

export default Dashboard;