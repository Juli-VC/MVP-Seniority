import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import axios from 'axios'
import { CreateActivity } from '../../../pages/dashboard/activities/CreateActivity/CreateActivity'

import "./AllCompActivities.scss"
import { useNavigate } from 'react-router-dom'
import { UserPublic } from '../UserPublic/UserPublic'



export const AllCompActivities = ({ company, showForm, setShowForm, setComponente }) => {


  const [editForm, setEditForm] = useState(false);
  const [compActFuturas, setCompActFuturas] = useState([])
  const [compActPasadas, setCompActPasadas] = useState([])
  const [showPublic, setShowPublic] = useState(false)

  const navigate = useNavigate();

  const user_id = company.user_id;
  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/company/${user_id}/FutureActs`)
      .then((res) => {
        setCompActFuturas(res.data)
      }).catch((err) => { console.log(err) })

    axios
      .get(`http://localhost:4000/users/company/${user_id}/PastActs`)
      .then((res2) => {
        setCompActPasadas(res2.data)
      })
      .catch((error) => { console.log(error) })

  }, [])


  const vistaAsistentes = () => {

    setShowPublic(true)
  }

  const edit = (activity_id) => {
    navigate(`/activities/editActivity/${activity_id}`)
  }

  return (
    <>

      {showForm === false &&
        <div className='toppadding'>
          <div className='centrado'>
            <button className='botoncrear'
              onClick={() => setShowForm(true)}>
              <img className='' src="/images/seniority/icons/plusCircle.png" alt="" width={"20px"} height={"20px"} />
              Crear Nueva Actividad
            </button>
            <p className='bajoboton'>Crea una actividad desde cero</p>
          </div>

          {showPublic && <UserPublic />}

          <div>

            <p className='tituloazul'>Actividades futuras</p>
            <div className=" colCard ">
              {compActFuturas.map((acti, index) => {

                return (
                  <>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-3 p-0" >
                      <Card key={index} className='Card-comp' >
                        <div className="card-header p-0  img-actcomp">
                          <Card.Img className=' img-actcomp' variant='top' src={`/images/seniority/activityIMG/${acti.file_name}`} maxWidth={'300px'} height={'157.5px'} />
                        </div>
                        <Card.Body>
                          <div className="cardBody_inside">
                            <Card.Title>{acti.title}</Card.Title>
                            <Card.Text >
                              <p className="date">{acti.week_day} - {new Date(acti.start_date).toISOString().split('T')[0]}</p>
                              <p className="time">{!acti.end_hour ? acti.start_hour : acti.start_hour + " - " + acti.end_hour}</p>
                              <p className="places">{acti.city_name}, {acti.province_name}</p>
                              <div className='iconitos'>
                                <div onClick={() => navigate(`/users/company/${user_id}/${acti.activity_id}/public`)}><img className='me-2' src="/images/seniority/icons/person.png" width={"20px"} height={"20px"} /> Asistentes: {acti.asistentes}</div>
                                <div><img className='me-2' src="/images/seniority/icons/thumb.png" width={"20px"} height={"20px"} /> ({acti.likes})</div>
                              </div>
                            </Card.Text>
                          </div>
                          <br />
                          <div className="botonesEditBorrar">
                            <button className='btn btn-primary' onClick={() => edit(acti.activity_id)} >Editar</button>
                            <button className='btn btn-danger'>Borrar</button>
                          </div>
                          <br />
                        </Card.Body>
                      </Card>


                    </div>

                  </>
                )

              }
              )}
            </div>

          </div>



          <p className='tituloazul'>Actividades pasadas</p>


          <div className=" colCard ">

            {compActPasadas.map((acti, index) => {
              return (
                <>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-3 p-0" >
                    <Card key={index} >
                      <div className="card-header p-0 centrado">
                        <Card.Img className='centrado' variant='top' src={`/images/seniority/activityIMG/${acti.file_name}`} maxWidth={'280px'} height={'157.5px'} />
                      </div>
                      <Card.Body>
                        <div className="cardBody_inside">
                          <Card.Title>{acti.title}</Card.Title>
                          <Card.Text >
                            <p className="date">{acti.week_day} - {new Date(acti.start_date).toISOString().split('T')[0]}</p>
                            <p className="time">{!acti.end_hour ? acti.start_hour : acti.start_hour + " - " + acti.end_hour}</p>
                            <p className="places">{acti.city_name}, {acti.province_name}</p>
                            <div className='iconitos'>
                              <div onClick={() => navigate(`/users/company/${user_id}/${acti.activity_id}/public`)}><img className='me-2' src="/images/seniority/icons/person.png" width={"20px"} height={"20px"} /> Asistentes: {acti.asistentes}</div>
                              <div><img className='me-2' src="/images/seniority/icons/thumb.png" width={"20px"} height={"20px"} /> ({acti.likes})</div>
                            </div>
                          </Card.Text>
                        </div>
                      </Card.Body>
                    </Card>


                  </div>
                  <br />

                </>
              )

            }
            )}
          </div>
        </div>




      }

      {showForm === true &&


        // {editForm = false ?
        <CreateActivity setShowForm={setShowForm}
          setComponente={setComponente} />

        // :



        // }

      }

    </>
  )
}
