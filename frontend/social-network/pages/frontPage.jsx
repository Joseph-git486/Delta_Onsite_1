import User from "../components/user";

function frontPage(props){
    const res = await api.get(`/api/connections/get-all-users`);
    return(
        <div>
            <div>
                <p>All Users</p>
                <ul>
                {res.data.users.map(user =>(<li>{user}</li>))}
                </ul>
            </div>
        </div>
    )
}

export default frontPage;