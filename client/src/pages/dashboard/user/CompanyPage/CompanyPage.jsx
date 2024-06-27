import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import jwtDecode from "jwt-decode";
import { useNavigate, useParams } from 'react-router-dom'
import { SeniorityContext } from '../../../../context/SeniorityProvider';
import { CompanyData } from '../../../../components/companyPage/CompanyData';
import { AllCompActivities } from '../../../../components/companyPage/CompActivities/AllCompActivities';
import { CompConfig } from '../../../../components/companyPage/CompanyConfig/CompConfig';


import "./CompanyPage.scss"
import { CompanyProf } from '../../../../components/companyPage/CompanyProf/CompanyProf';

export const CompanyPage = ({ setuser_type, componente, setComponente }) => {

  const user_id = useParams().user_id;

  const [company, setCompany] = useState([])

  const [showCompPage, setShowCompPage] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [focus, setFocus] = useState(0);

  const { isLogged, setIsLogged, setUserToken } = useContext(SeniorityContext);
  const navigate = useNavigate();

  const click = (number) => {
    setFocus(number);
  }



  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/company/${user_id}`)
      .then((res) => {
        setCompany(res.data[0])
        if (window.localStorage.getItem("token")) {
          if (user_id == jwtDecode(window.localStorage.getItem("token")).user.id) {
            setShowCompPage(true)
          }
        }

      })
      .catch((err) => {
        return (console.log(err))
      })

  }, [showForm, componente])


  const logOut = () => {
    setComponente(0);
    window.localStorage.removeItem("token")
    setUserToken(null);
    setIsLogged(false);
    setuser_type(0)
    navigate("/")
  }



  return (

    <>
      {showCompPage === true ?

        <div className='container-fluid companyPageBody'>
          <div className='headerCompanyPage'>

            <img className='imagenemp' src={`/images/seniority/userImages/${company.img}`} />

            <p className='nombreemp'>{company.name}</p>



          </div>
          <div className="row">
            <div className='col-12 col-lg-3 divizq'>
              <div className='izq'>
                <a onClick={() => (setComponente(0), click(0))} className={focus === 0 ? 'selected' : 'noselected'}>Datos Empresa</a>
                <a onClick={() => (setComponente(1), setShowEditForm(false), setShowForm(false), click(1))} className={focus === 1 ? 'selected' : 'noselected'}>Equipo de profesionales</a>
                <a onClick={() => (setComponente(2), click(2))} className={focus === 2 ? 'selected' : 'noselected'}>Calendario</a>
                <a onClick={() => (setComponente(3), setShowForm(false), click(3))} className={focus === 3 ? 'selected' : 'noselected'}>Actividades</a>
                <a onClick={() => (setComponente(4), click(4))} className={focus === 4 ? 'selected' : 'noselected'}>Estadisticas</a>
                <a onClick={() => (setComponente(5), click(5))} className={focus === 5 ? 'selected' : 'noselected'}>Ayuda</a>
                <a onClick={() => (setComponente(6), click(6))} className={focus === 6 ? 'selected' : 'noselected'}>Configuracion</a>
                <a onClick={logOut} className={'noselected'}>Cerrar sesión</a>
              </div>

            </div>
            <div className='col-12 col-lg-9 rojo'>

              {componente === 0 &&
                <CompanyData
                  company={company}
                />
              }

              {componente === 1 &&

                <CompanyProf
                  company={company}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  showEditForm={showEditForm}
                  setShowEditForm={setShowEditForm}
                  componente={componente}
                  setComponente={setComponente}

                />


              }

              {componente === 3 &&

                <AllCompActivities
                  company={company}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  setComponente={setComponente}
                />

              }


              {componente === 6 &&

                <CompConfig
                  company={company}
                />

              }

            </div>
          </div>

        </div>

        :
        <div className="" style={{ height: "calc( 100vh - 554px)" }}>
          <h2 className='text-center py-5'>Hay que iniciar sesión para acceder.</h2>
        </div>


      }

    </>

  )
}
