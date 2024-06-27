import React, {useState,useContext} from 'react'
import './oneactivity4.scss'
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SeniorityContext } from '../../../../../context/SeniorityProvider'


export const OneActivity4 = ({resultActAleatorias}) => {
    const { usertoken } = useContext(SeniorityContext);
    const userID = usertoken?.user.id
    const navigate = useNavigate();
  

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

      const [show, setShow] = useState(false);
      const handleShow = () => setShow(true);
    

  return (
    <div className='container allActivities2 p-0 act-alea'>
        <h1>Puede que también te interese</h1>
          <div className="row categories">
            <div className='col-12 p-0'>
              <div className="colCard">
                {resultActAleatorias.map((acti, index) => {
                    const finalprice = acti?.price - parseFloat(acti?.price * acti?.discount / 100).toFixed(2);;
                  return (
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-3 p-0" key={index}>
                      <Card>
                        <div className="card-header p-0">
                          <Card.Img
                            variant='top'
                            src='/images/seniority/PlayVideoIMG/video1.png'
                            maxWidth={'280px'}
                            height={'157.5px'}
                          />
                        </div>
                        <Card.Body>
                          <div className="cardBody_inside">
                            <Card.Title>{acti.title}</Card.Title>
                            <Card.Text>
                              <p>
                                Un curso con <span className="black">{acti.name}</span>
                              </p>
                              <p className="date">{acti.week_day} - {acti.start_date?.toLocaleString("medium")}</p>
                              <p className="time">{!acti.end_hour ? acti.start_hour : acti.start_hour + " - " + acti.end_hour}</p>
                              <p className="places">{acti.city_name}, {acti.province_name}</p>

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
                  );
                })}
              </div>
            </div>
          </div>
        
      
    </div>
  )
}
