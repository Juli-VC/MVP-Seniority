import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { SeniorityContext } from '../../context/SeniorityProvider';
import "./navAdmin.scss"


export const NavbarAdmin = ({ setuser_type }) => {
  const [adminId, setadminId] = useState("");
  const navigate = useNavigate();

  const { isLogged, setIsLogged, usertoken, setUserToken, user_type } = useContext(SeniorityContext);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      setadminId(jwtDecode(window.localStorage.getItem("token")).user.id)
    }


  }, [])



  const logOut = () => {
    window.localStorage.removeItem("token")
    setUserToken(null);
    setIsLogged(false);
    navigate("/")
    setuser_type(0)
  }


  const handleSearch = (event) => {
    event.preventDefault();
    // Lógica para realizar la búsqueda
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" id="navbar2">
        <Container className="d-flex align-items-center justify-content-between">
          <div>
            <img className="logoHeader" src="/seniority_logoprincipal_sinfondo.png" alt="" />
          </div>
          <Form className="d-flex align-items-center">
            <Form.Control id="search" type="search" placeholder="Buscar" name="compare" style={{ width: '150px', height: '35px' }} />
            <Form.Select aria-label="Filtro" className="ms-2" style={{ height: '35px' }}>
              <option value="provincias">Provincias</option>
              {/* Otras opciones de filtro */}
            </Form.Select>
            <Button variant="outline-success" className="ms-2">Buscar</Button>
            <Button variant="outline-secondary" className="ms-2" style={{ height: '38px' }}>Borrar</Button>
          </Form>
          <div>
            <Nav>

              <NavDropdown title="Mi perfil" id="collasible-nav-dropdown">


                <NavDropdown.Item>Estadisticas</NavDropdown.Item>
                <NavDropdown.Item >Ayuda</NavDropdown.Item>
                <NavDropdown.Item >Configuracion</NavDropdown.Item>
                <NavDropdown.Item onClick={logOut}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>







    </>
  );
};



