import User from "../components/user";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function inspectUser(){
    const {id} = useParams();
    const [friends,setFriends] = useState({}); 
    async function getAllConnections(){
        const res = await api.get(`/api/connections/get-connections/${id}`);
        setFriends(res.data);
    }

    useEffect(()=>{
        getAllConnections();
    },[id]);

    return(
        <div>
        <User name ={friends.userName}/>
        <div>
        </div>
            <div>
                <p>1st Degree friends</p>
                <ul>
                {friends.friend1.map(friend1 =>(<li>{friend1}</li>))}
                </ul>
            </div>
            <div>
                <p>2nd Degree friends</p>
                <ul>
                {friends.friend2.map(friend2 =>(<li>{friend2}</li>))}
                </ul>
            </div>
            <div>
                <p>3rd Degree friends</p>
                <ul>
                {friends.friend3.map(friend3 =>(<li>{friend3}</li>))}
                </ul>
            </div>
        </div>
    )
}

export default inspectUser;