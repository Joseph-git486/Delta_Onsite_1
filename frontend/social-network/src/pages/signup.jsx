import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Signup(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [popUp, setPopUp] = useState({show:false, message: "", type: ""});

    useEffect( ()=>{
        if(!popUp.show){
            return;
        }
        const popUpTimer = setTimeout( ()=>{
            setPopUp( (prev)=> ({...prev, show:false}));
        }, 4000 );
        return ()=> {clearTimeout(popUpTimer)};
    },[popUp.show]);

    async function handleSubmit(event){
        event.preventDefault();
        try{
            const res = await fetch(`http://localhost:5000/api/auth/signup`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({userName, email, password})
            });
            const data = await res.json();
            if(!res.ok){
                setPopUp({show:true, message: data.message, type:"error"});
                return;
            }
            setPopUp({show:true, message:data.message, type: "success"});
            setUserName("");
            setEmail("");
            setPassword("");
            setTimeout( ()=>{navigate('/login')},500 );    
            } catch(err){
                setPopUp({show:true, message: "Network Error. Please try again.", type:"error"});
            }
        }
    return(<div className="signup-page">
        <form className="signup-form" onSubmit = {handleSubmit}>
            <h2>Create Account</h2>
            <label>Username</label>
            <input value = {userName} onChange={(event) => { setUserName(event.target.value) }}/>
            <label>Email</label>
            <input value = {email} onChange={(event) => { setEmail(event.target.value) }}/>
            <label>Password</label>
            <input type = "password" value = {password} onChange={(event) => { setPassword(event.target.value) }}/>
            <button type ="submit">Signup</button>
            {popUp.show && (<div className={`popup-message popup-${popUp.type}`} ><p>{popUp.message}</p></div>)}
        </form>
        </div>
    )
}

export default Signup;