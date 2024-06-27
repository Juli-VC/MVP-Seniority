import axios from 'axios';
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

import linksNavbar from "./linksNavbar.scss";
import { SeniorityContext } from '../../../context/SeniorityProvider';
import { Dropdown } from 'react-bootstrap';

export const LinksNavbars = ({ setshowMenuOptions }) => {
  const navigate = useNavigate();
  const [allcategories, setAllcategories] = useState();
  const [userId, setUserId] = useState("");

  const { isLogged, setIsLogged, usertoken, setUserToken } = useContext(SeniorityContext);





  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      let token = window.localStorage.getItem("token");
      setUserId(jwtDecode(window.localStorage.getItem("token")).user.id)

    }
    axios
      .get("http://localhost:4000/")
      .then((res) => {
        setAllcategories(res.data);


      })
      .catch((error) => {
        console.log("Error en el axios", error);

      });

  }, [isLogged])

  const logOut = () => {
    window.localStorage.removeItem("token")
    setUserToken(null);
    setIsLogged(false);
    setshowMenuOptions(1)
    navigate("/")
  }

  console.log("userId", userId);
  const inicioSenior = () => {
    setshowMenuOptions(1)
    navigate(`/users/user/${userId}`)
  }
  const seniorMenuClick = (x) => {

    setshowMenuOptions(x)
    navigate(`/users/user/${userId}`)
  }


  return (
    <>
      <Navbar collapseOnSelect expand="xxl" className="" id='navbar'  >
        <Container fluid className='containerLinks '>
          <Navbar.Brand onClick={() => navigate("/")}><img className='logoHeader' src="/seniority_logoprincipal_sinfondo.png" alt="" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xxl" />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-xxl`}
            aria-labelledby={`offcanvasNavbarLabel-expand-xxl`}
            placement="end"

          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xxl`}>
                Seniority
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className='justify-content-end align-items-center' >
              <Nav className="linksbody   ">
                {isLogged === false ?
                  <Nav.Link onClick={() => navigate("/")}  >Inicio</Nav.Link>
                  :
                  <Nav.Link onClick={inicioSenior} >Inicio</Nav.Link>
                }
                <Nav.Link onClick={() => navigate("/About")}  >¿Quienes somos?</Nav.Link>
                <NavDropdown title="Actividades" id="collasible-nav-dropdown">
                  <NavDropdown.Item onClick={() => navigate("/activities")} >Todas las actividades</NavDropdown.Item>
                  {
                    allcategories && allcategories.map((elem, index) => {
                      return (
                        <NavDropdown.Item onClick={() => navigate(`/activities/AllActivities/categories/${elem.category_name}`)} key={index} >Categoría: {elem.category_name} </NavDropdown.Item>
                      )
                    })
                  }

                  <NavDropdown.Item disabled>...</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Todas las categorías
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link onClick={() => navigate("/Contact")}>Contactar</Nav.Link>
                <Dropdown className='idioma'>
                  <Dropdown.Toggle id="dropdown-basic">
                    Idioma
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">English</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">German</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">French</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {isLogged === false ?
                  <>
                    <Nav.Link onClick={() => navigate("/users/login")}>Entrar</Nav.Link>
                    <button className='botoncrearCuenta' onClick={() => navigate("/RegisterSenior")}>
                      Crear Cuenta
                    </button>
                  </>
                  :
                  <>
                    <div>
                      <img src={`/images/seniority/usersImg/${(jwtDecode(window.localStorage.getItem("token")).user.img)}`} alt=""
                        height={"50px"} width={"50px"} />
                    </div>
                    <NavDropdown title="Mi perfil" id="collasible-nav-dropdown">
                      <NavDropdown.Item disabled><strong>Perfil</strong></NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => seniorMenuClick(2)} >Mis datos</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => seniorMenuClick(3)} >Mis intereses</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => seniorMenuClick(4)} >Calendario</NavDropdown.Item>
                      <NavDropdown.Item onClick={() => seniorMenuClick(5)} >Mis actividades</NavDropdown.Item>
                      <NavDropdown.Item  >Mis amistades</NavDropdown.Item>
                      <NavDropdown.Item  >Ayuda</NavDropdown.Item>
                      <NavDropdown.Item onClick={logOut} >Cerrar sesión</NavDropdown.Item>
                    </NavDropdown>
                  </>
                }


              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}


