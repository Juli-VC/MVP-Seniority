import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModalReservationPayment } from '../../../../components/Modal_Reservation_Payment/ModalReservationPayment';

import filterActivity from "./filterActivity.scss"

export const FilterActivity = () => {

    const location = useLocation();
    const { state } = location;
    const [resultFilter, setresultFilter] = useState()

    const navigate = useNavigate();
    //Modal
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        axios
            .get("http://localhost:4000/activities/filter", {
                headers: {
                    Authorization: JSON.stringify(state)
                }
            })
            .then((res) => {
                setresultFilter(res.data)
            })
            .catch((err) => { })
    }, [])

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
            finalprice: finalprice
        }
        navigate(`/payment/${acti.activity_id}`, { state: { otherData } });
    };

    return (
        <div className="container filterSearch">
            <div className="row colCard">

                {resultFilter && resultFilter.map((acti, index) => {
                    const finalprice = acti.price - parseFloat(acti.price * acti.discount / 100).toFixed(2);
                    return (
                        <>
                            <div className="col" >
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
                                show={show} setShow={setShow}
                                acti={acti} finalprice={finalprice} />
                        </>
                    )
                }
                )}
            </div>

        </div>
    )
}
