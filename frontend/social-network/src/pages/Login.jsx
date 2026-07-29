import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {getAccessToken, setAccessToken} from '../tokenStore';

function Login(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const {setToken} = useContext(AuthContext);
    const [popUp, setPopUp] = useState({show:false, message: "", type: ""});

    useEffect( ()=>{
        if(!popUp.show){
            return;
        }
        const popUpTimer = setTimeout( ()=>{
            setPopUp((prev)=> ({...prev, show:false}));
        }, 4000 );
        return ()=> {clearTimeout(popUpTimer)};
    },[popUp.show] );

    async function handleSubmit(event){
        event.preventDefault();
        try{
            const res = await fetch(`http://localhost:5000/api/auth/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({userName, password})
            });
            const data = await res.json();
            if(!res.ok){
                setPopUp({show: true, message:data.message, type: "error"});
                return;
            }
            setAccessToken(data.token);
            setToken(data.token);
            navigate('/');
            } catch(err){   
                setPopUp({show:true, message:"Network Error. Please try again.", type:"error"});
            }
        }

    function handleForgotPassword(){
        navigate('/forgot-password');
    }

    return(
    <div className="login-page">
    <form className="login-form" onSubmit = {handleSubmit}>
        <label>Username</label>
        <input value = {userName} onChange={(event)=> setUserName(event.target.value)}/>
        <label>Password</label>
        <input type = "password" value = {password} onChange={(event)=> setPassword(event.target.value)}/>
        <button className="btn-primary" type ="submit" >Login</button>
        <button className="btn-link" onClick = {handleForgotPassword} >Forgot Password</button>
        {popUp.show && (<div className={`popup-message popup-${popUp.type}`} ><p>{popUp.message}</p></div>)}
    </form>
    </div>
    );
}

export default Login;