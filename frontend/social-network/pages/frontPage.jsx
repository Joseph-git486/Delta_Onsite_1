import { useEffect } from "react";
import User from "../components/user";
import api from '../src/api/api';
import { useEffect, useState } from "react";

function frontPage(props){
    const [userName, setUserName] = useState([]);
    useEffect( ()=>
        {async function getAllUser(){
            const res = await api.get(`/api/connections/get-all-users`);
            setUserName(res.data.users);
        }
    },[]);
    async function handleConnect(event, user){
        event.prevent.Default();
        const res = api.post(`/api/connections/create`,
            {userName: user}
        )
    }

    return(
        <div>
            <div>
                <p>All Users</p>
                <ul>
                {userName.map(user =>(<li><p>{user}</p><button onClick={(event, user) => handleConnect} >Connect</button></li>))}
                </ul>
            </div>
        </div>
    )
}

export default frontPage;