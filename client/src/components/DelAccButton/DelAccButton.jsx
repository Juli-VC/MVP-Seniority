import React, { useContext } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { SeniorityContext } from '../../context/SeniorityProvider'

import "./DelAccButton.scss"

export const DelAccButton = ({user_id}) => {

  const { setIsLogged, setUserToken} = useContext(SeniorityContext);
  const navigate = useNavigate();

  

  const eliminarCuenta = () => {

    axios
      .put(`http://localhost:4000/users/deleteUser/${user_id}`)
      .then(() => {
        
      })
      .catch((err)=> console.log(err) )
      
    window.localStorage.removeItem("token")
    setUserToken(null);
    setIsLogged(false);
    navigate("/")
    
  }

  return (
    <>
        <Button className="confirmar" onClick={() => eliminarCuenta()}>Eliminar cuenta</Button>
    </>
  )
}
