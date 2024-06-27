import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import "./NavbarCompany.scss";
import { SeniorityContext } from '../../context/SeniorityProvider';

export const NavbarCompany = ({ setuser_type, setComponente }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const { isLogged, setIsLogged, usertoken, setUserToken } = useContext(SeniorityContext);

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      setUserId(jwtDecode(window.localStorage.getItem("token")).user.id)
    }


  }, [])



  const logOut = () => {
    window.localStorage.removeItem("token")
    setUserToken(null);
    setIsLogged(false);
    setuser_type(0)
    navigate("/")
  }

  let img = "avatar.png";
  if (usertoken) {
    img = usertoken.user.img;
  }

  return (
    <>
      <Navbar collapseOnSelect expand="xxl" className="navbarCompany" id='navbar'  >
        <Container fluid className='containerIzq'>
          <Navbar.Brand onClick={() => navigate("/")}>
            <div className="col-6 icono"><img className='logoHeader' src="/seniority_logoprincipal_sinfondo.png" alt="" /></div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xxl" />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-xxl`}
            aria-labelledby={`offcanvasNavbarLabel-expand-xxl`}
            placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xxl`}>
                Seniority
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='justify-content-end align-items-center'>
              <Nav className="ms-auto gap-2">
                <Nav.Link onClick={() => (navigate(`/users/company/${userId}`), setComponente(0))}>Inicio</Nav.Link>

                <Nav.Link onClick={() => (navigate(`/users/company/${userId}`), setComponente(3))}>Actividades</Nav.Link>

                <Nav.Link onClick={() => navigate(`/users/company/${userId}`)} disabled>Ayuda</Nav.Link>
                <NavDropdown title="Mi perfil" id="collasible-nav-dropdown">
                  <NavDropdown.Item disabled></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => (navigate(`/users/company/${userId}`), setComponente(0))} >Datos Empresa</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => (navigate(`/users/company/${userId}`), setComponente(1))} >Equipo de profesionales</NavDropdown.Item>
                  <NavDropdown.Item disabled onClick={() => (navigate(`/users/company/${userId}`), setComponente(2))} >Calendario</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => (navigate(`/users/company/${userId}`), setComponente(3))} >Actividades</NavDropdown.Item>
                  <NavDropdown.Item disabled onClick={() => (navigate(`/users/company/${userId}`), setComponente(4))} >Estadisticas</NavDropdown.Item>
                  <NavDropdown.Item disabled onClick={() => (navigate(`/users/company/${userId}`), setComponente(5))} >Ayuda</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => (navigate(`/users/company/${userId}`), setComponente(6))} >Configuracion</NavDropdown.Item>
                  <NavDropdown.Item onClick={logOut} >Cerrar sesión</NavDropdown.Item>
                </NavDropdown>
              </ Nav>
            </Offcanvas.Body>



          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}


