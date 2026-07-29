import User from "../components/user";

function inspectUser(props){
    return(
        <div>
        <User name ={props.name} age ={props.age} />
        <div>
        </div>
            <div>
                <p>1st Degree friends</p>
                <ul>
                {props.friends1.map(friend1 => (<li>{friend1}</li>))}
                </ul>
            </div>
            <div>
                <p>2nd Degree friends</p>
                <ul>
                {props.friends2.map(friend2 => (<li>{friend2}</li>))}
                </ul>
            </div>
            <div>
                <p>3rd Degree friends</p>
                <ul>
                {props.friends3.map(friend3 => (<li>{friend3}</li>))}
                </ul>
            </div>
        </div>
    )
}

export default inspectUser;