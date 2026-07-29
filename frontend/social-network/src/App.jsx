import {useEffect, useState } from "react";
import inspectUser from '../pages/InspectUser';
import api from './api/api';
import { getAccessToken,setAccessToken } from "../tokenStore";

function App(){
  useEffect(() => {
      api.get('api/auth/refresh', { withCredentials: true })
          .then(res => setAccessToken(res.data.accessToken))
          .catch(() => setAccessToken(null));  // no valid refresh cookie = not logged in
  }, []);

  return(
    <div>
      <Navbar />
      <Routes>
        <Route path ="/inspect-page/:id" element = {<inspectUser/>}/>
      </Routes>  
    </div>
  );
}

export default App;