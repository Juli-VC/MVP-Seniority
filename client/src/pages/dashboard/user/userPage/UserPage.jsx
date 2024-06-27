import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { SeniorityContext } from '../../../../context/SeniorityProvider'
import { Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'
import "./UserPage.scss"
import { M02MisDatos } from './userComponents/M02MisDatos';
import { M03MisIntereses } from './userComponents/M03MisIntereses';
import { M04MiCalendario } from './userComponents/M04MiCalendario';
import { M05MisActividades } from './userComponents/M05MisActividades';

import { ModalReservationPayment } from '../../../../components/Modal_Reservation_Payment/ModalReservationPayment';


export const UserPage = ({ showMenuOptions, setshowMenuOptions }) => {

  const [showUserPage, setShowUserPage] = useState(false)
  const [mensajeUser, setMensajeUser] = useState("")
  const [allActivities, setAllActivities] = useState([]);
  const [show, setShow] = useState(false);

  const tokenLocalStore = jwtDecode(window.localStorage.getItem("token"));
  const handleShow = () => setShow(true);

  const { usertoken } = useContext(SeniorityContext);

  const user_id = useParams().user_id;
  const userID = usertoken?.user.id;
  let id_url = useParams().user_id;

  const navigate = useNavigate();

  useEffect(() => {

    if (tokenLocalStore) {
      const { id } = tokenLocalStore.user;

      if (id == id_url) {
        setShowUserPage(true);

        axios
          .get('http://localhost:4000/users/viewUserHomePage', {
            headers: {
              Authorization: jwtDecode(window.localStorage.getItem("token")).user.province_id
            },
          })
          .then((res) => {
            setAllActivities(res.data);

          })
          .catch((error) => {
            console.log(error);
          });


      }
      else {
        setMensajeUser("No puedes pasar")
      }
    }
  }, [usertoken])


  const rerservPayment = (datos) => {
    const { acti, finalprice } = datos;
    const otherData = {
      activity_id: acti.activity_id,
      title: acti.title,
      name: acti.name,
      week_day: acti.week_day,
      start_date: acti.start_date,
      end_date: acti.end_date,
      start_hour: acti.start_hour,
      end_hour: acti.end_hour,
      city_name: acti.city_name,
      province_name: acti.province_name,
      finalprice: finalprice,
      userID: userID
    }
    navigate(`/payment/${acti.activity_id}`, { state: { otherData } });
  };

  const vistaOneActivity = (category, activity) => {
    navigate(`/activities/`)
  }

  return (
    <>
      {showUserPage === false ?
        <div>
          <p>{mensajeUser}</p>
        </div>
        :
        <div className='container allActivitiesUserPage p-0'>
          {
            showMenuOptions === 1 ?
              <>
                <div className=" row tituloActivities">
                  <p className='titulo'>Actividades pensadas para ti, {jwtDecode(window.localStorage.getItem("token")).user.name}</p>
                </div>
                <div className=" colCard ">
                  {allActivities.map((acti, index) => {

                    const finalprice = acti.price - parseFloat(acti.price * acti.discount / 100).toFixed(2);

                    if (acti.price === null || acti.price == 0 || acti.price === undefined) {
                      finalprice = acti.price;
                    }


                    return (
                      <>
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-3 p-0">
                          <Card key={index} >
                            <div className="card-header p-0">
                              <div className="tagNuevo">Nuevo</div>
                              <Card.Img variant='top' src='/images/seniority/PlayVideoIMG/video1.png' maxWidth={'280px'} height={'157.5px'} />
                            </div>
                            <Card.Body>
                              <div className="cardBody_inside">
                                <Card.Title>{acti.title}</Card.Title>
                                <Card.Text >
                                  <p>Un curso con <span className="black">{acti.name}</span></p>
                                  <p className="date">{acti.week_day} - {new Date(acti.start_date).toISOString().split('T')[0]}</p>
                                  <p className="time">{!acti.end_hour ? acti.start_hour : acti.start_hour + " - " + acti.end_hour}</p>
                                  <p className="places">{acti.city_name}, {acti.province_name}</p>
                                  <div className='iconitos'>
                                    <div><img className='me-2' src="/images/seniority/icons/person.png" alt="" width={"20px"} height={"20px"} /> Asistentes: {acti.asistentes}</div>
                                    <div><img className='me-2' src="/images/seniority/icons/thumb.png" alt="" width={"20px"} height={"20px"} /> ({acti.likes})</div>
                                  </div>
                                  <div className={acti.discount == null || acti.discount == 0 || acti.discount == undefined ? "hidden" : "discount"}>
                                    -{acti.discount}% Dto. Antes <span className='tachado'>{acti.price}€</span>
                                  </div>

                                </Card.Text>
                              </div>
                            </Card.Body>
                            <Card.Footer >
                              <button onClick={() => rerservPayment({ acti: acti, finalprice: finalprice })}>
                                <img src="/images/seniority/icons/icon cart.png" alt="" />
                                Comprar {finalprice}€
                              </button>
                              <button className='my-2' onClick={handleShow} >Reservar</button>
                            </Card.Footer>
                          </Card>
                        </div>
                        <ModalReservationPayment show={show} setShow={setShow}
                          userID={userID} resultActivity={acti} finalprice={finalprice} />
                      </>
                    )
                  }
                  )}
                </div>
              </>
              :
              showMenuOptions === 2 ?
                <>
                  <M02MisDatos user_id={user_id} />
                </>
                :
                showMenuOptions === 3 ?
                  <>
                    <M03MisIntereses user_id={user_id} setshowMenuOptions={setshowMenuOptions} />
                  </>
                  :
                  showMenuOptions === 4 ?
                    <>
                      <M04MiCalendario user_id={user_id} />
                    </>
                    :
                    showMenuOptions === 5 ?
                      <>
                        <M05MisActividades user_id={user_id} />
                      </>
                      :
                      <p>Esta opción de menú de opciones no está disponible</p>
          }
        </div>
      }
    </>
  )
}
