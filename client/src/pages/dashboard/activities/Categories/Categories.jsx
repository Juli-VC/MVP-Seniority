import React, { useContext, useEffect, useState } from "react";
import "./categories.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ModalReservationPayment } from '../../../../components/Modal_Reservation_Payment/ModalReservationPayment';
import { SeniorityContext } from "../../../../context/SeniorityProvider";

export const Categories = () => {
  const [category, setCategory] = useState([]);
  const categoria = useParams().category_name;
  const navigate = useNavigate();

  const { usertoken } = useContext(SeniorityContext);
  const userID = usertoken?.user.id

  useEffect(() => {

    axios
      .get(
        `http://localhost:4000/activities/AllActivities/categories/${categoria}`
      )
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => console.log(error));
  }, [categoria]);

  useEffect(() => {
  }, [category]);

  const vistaOneActivity = (category, activity) => {
    navigate(`/activities/${activity}`, {
      state: {
        category_name: category,
      }
    })

  }

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

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

  return (
    <>
      <div className='container allActivities3 '>


        <div className="row categories " >
          <h3>{categoria}</h3>

          <div className='col-12 p-0 '>
            <div className=" colCard ">
              {category.map((acti, index) => {

                const finalprice = acti.price - parseFloat(acti.price * acti.discount / 100).toFixed(2);

                if (acti.price == null || acti.price == 0 || acti.price == undefined) {
                  finalprice = acti.price;
                }

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
                          <button className="my-2" onClick={handleShow} >Reservar</button>
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



      </div>
    </>
  );
};
