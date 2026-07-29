import  {createContext, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {getAccessToken, setAccessToken} from '..tokenStore/';

const AuthContext = createContext();

export function AuthProvider(props){
    const [token ,setToken] = useState(getAccessToken());
    const userId = token ? jwtDecode(token): null;
    return(
        <AuthContext.Provider value = {{token, setToken, userId}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export {AuthContext};