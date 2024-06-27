import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { SeniorityContext } from '../../../context/SeniorityProvider';
import jwtDecode from "jwt-decode";

import login from "./login.scss"

export const Login = ({ setuser_type }) => {

  const { setUser, setIsLogged, setToken, initialValue } = useContext(SeniorityContext);

  const [msg, setMsg] = useState();
  const [login, setLogin] = useState(
    {
      email: "",
      password: ""
    }
  );
  const [errorMsg, setErrorMsg] = useState("")

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!login.email || !login.password) {
      setMsg(true);

    }
    else {
      setMsg(false)
      axios
        .post(`http://localhost:4000/users/login`, login)
        .then((res) => {
          window.localStorage.setItem("token", res.data.token);
          setIsLogged(true);
          const type = res.data.user.user_type;
          const user_id = res.data.user.user_id;

          if (type === 1) {
            setuser_type(1)
            navigate(`/users/user/${user_id}`);

          }
          else if (type === 2) {
            setuser_type(2)
            navigate(`/users/company/${user_id}`);
          }
          else if (type === 3) {
            setuser_type(3)
            navigate(`/admin`);
          }
        })
        .catch((err) => {
          console.log("err", err)
          setErrorMsg(err.response.data)
        })
    }
  }

  return (
    <>
      <div className="bodyLogin">
        <div className="blanquito">
          <p>¿No tienes cuenta? Regístrate <a onClick={() => navigate("/RegisterSenior")}><u>aquí</u></a> </p>
          <div className="formLogin">
            <h3>¡Te damos la bienvenida a Seniority!</h3>
            <h5>Inicia sesión con tu cuenta y comienza a disfrutar</h5>
            <form className='inputs'>
              <label htmlFor="">
                <img src="/images/seniority/icons/arroba.png" alt="" height={"20px"} width={"20px"} />
                Correo electrónico
              </label>
              <input
                required
                type='email'
                placeholder='Email'
                name='email'
                value={login.email}
                onChange={handleChange}
              />
              <label htmlFor="">
                <img src="/images/seniority/icons/lock.png" alt="" height={"21px"} width={"16px"} />
                Escribe tu contraseña
              </label>
              <input
                required
                type='password'
                placeholder='Contraseña'
                name='password'
                value={login.password}
                onChange={handleChange}
              />
              <Button type='submit' onClick={onSubmit} >Aceptar</Button>
              {
                msg === true && <p> Hay algun campo vacio. Introduzca email y contraseña </p>
              }
              <p className="errorMsg" style={{ color: "red" }}>{errorMsg}</p>

            </form>
          </div>
        </div>
      </div>







    </>
  )
}
