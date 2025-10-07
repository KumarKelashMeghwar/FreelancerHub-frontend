import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Profile = () => {

    const [user, setUser] = useState(null);

    const fetchProfile = async () => {
        const response = await axios.get("http://localhost:8080/me", {
            "Content-Type": "application/json",
            headers: {
                withCredentials: true,
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

    }

    useEffect(() => {

        fetchProfile();


    }, []);


    return (
        <div>Profile</div>
    )
}

export default Profile