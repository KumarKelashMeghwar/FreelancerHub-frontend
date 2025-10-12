import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

const UserDetails = () => {

    const [user, setUser] = useState(null);

    const { id } = useParams();

    async function findUser(userId) {
        try {
            const response = await axios.get("http://localhost:8080/api/users/getUser?userId=" + userId);

            console.log(response)

        } catch (error) {
            console.log("Error while fetching user", error);
        }
    }

    useEffect(() => {

        findUser(id);

    }, [])

    return (
        <div>
            User details page
        </div>
    )
}

export default UserDetails
