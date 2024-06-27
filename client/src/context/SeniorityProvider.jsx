import React, { createContext, useEffect, useState } from 'react'
import jwtDecode from "jwt-decode";


export const SeniorityContext = createContext();



export const SeniorityProvider = ({children}) => {

  
  const [isLogged, setIsLogged] = useState(false);
  const [usertoken, setUserToken] = useState(null);
  

  useEffect(() => {
    if(window.localStorage.getItem("token")){    
      setUserToken(jwtDecode(window.localStorage.getItem("token")))       
      setIsLogged(true)
    }


  }, [])
  /* console.log("settoken provider", usertoken); */

  return (
    <SeniorityContext.Provider value= {{
       isLogged, setIsLogged, usertoken, setUserToken, 
    }}
    >
      {children}
    </SeniorityContext.Provider>

  )
}
