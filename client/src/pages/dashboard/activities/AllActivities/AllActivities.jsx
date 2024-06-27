import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { SeniorityContext } from '../../../../context/SeniorityProvider'
import { allActivities } from "./allActivities.scss"
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { ModalReservationPayment } from '../../../../components/Modal_Reservation_Payment/ModalReservationPayment';



export const AllActivities = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [catg, setCatg] = useState([]);

  const { usertoken } = useContext(SeniorityContext);

  const userID = usertoken?.user.id
  const navigate = useNavigate();


  useEffect(() => {

    axios
      .get('http://localhost:4000/activities', {
        headers: {
          Authorization: window.localStorage.getItem("token") ? jwtDecode(window.localStorage.getItem("token")).user.province_id : ""
        },
      })
      .then((res) => {
        setAllActivities(res.data);
        const categories = res.data.map((activity) => activity.category_name);
        const uniqueCategories = [...new Set(categories)];
        setCatg(uniqueCategories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [usertoken]);




  const vistaOneActivity = (category, activity) => {
    navigate(`/activities/${activity}`, {
      state: {
        category_name: category,
      }
    })

  }

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

  //Modal
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className='container allActivities p-0'>
        <div className=" row tituloActivities">
          <p className='titulo'>Actividades pensadas para ti.</p>
        </div>

        {catg?.map((elem, index) => {
          const filteredActivities = allActivities.filter((acti) => acti.category_name === elem);
          return (
            <div key={index} className="row categories " >
              <div className="col-12">
                <h2 className='titleCategory'>{elem}</h2>
              </div>

              <div className='col-12 p-0 '>
                <div className=" colCard ">
                  {filteredActivities.map((acti, index) => {
                    const finalprice = acti.price - parseFloat(acti.price * acti.discount / 100).toFixed(2);

                    return (
                      <>
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-3 p-0" >
                          <Card key={index} >
                            <div className="card-header p-0">
                              <div className="tagNuevo">Nuevo</div>
                              <Card.Img variant='top' src='/images/seniority/PlayVideoIMG/video1.png' maxWidth={'280px'} height={'157.5px'} />
                            </div>
                            <Card.Body onClick={() => vistaOneActivity(acti.category_name, acti.activity_id)}>
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
                              <button onClick={handleShow} >Reservar</button>
                            </Card.Footer>
                          </Card>
                        </div>
                        <ModalReservationPayment
                          show={show} setShow={setShow} userID={userID}
                          resultActivity={acti} finalprice={finalprice} />
                      </>
                    )
                  }
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};