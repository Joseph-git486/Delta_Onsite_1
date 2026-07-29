import User from "../components/user";

function inspectUser(props){
    const res = await api.get(`/api/connections/get-connections`);
    return(
        <div>
        <User name ={res.data.userName}/>
        <div>
        </div>
            <div>
                <p>1st Degree friends</p>
                <ul>
                {res.data.friend1.map(friend1 =>(<li>{friend1}</li>))}
                </ul>
            </div>
            <div>
                <p>2nd Degree friends</p>
                <ul>
                {res.data.friend2.map(friend2 =>(<li>{friend2}</li>))}
                </ul>
            </div>
            <div>
                <p>3rd Degree friends</p>
                <ul>
                {res.data.friend3.map(friend3 =>(<li>{friend3}</li>))}
                </ul>
            </div>
        </div>
    )
}

export default inspectUser;