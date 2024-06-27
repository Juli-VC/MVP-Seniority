import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import m05MisActividades from "./m05MisActividades.scss"
export const M05MisActividades = ({ user_id }) => {

    const [upcomingActivities, setUpcomingActivities] = useState([]);
    const [pastActivities, setPastActivities] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:4000/users/seniorActivities/${user_id}`)
            .then((res) => {
                const currentDate = new Date();
                setUpcomingActivities(res.data.filter(activity => new Date(activity.start_date) >= currentDate));
                setPastActivities(res.data.filter(activity => new Date(activity.start_date) < currentDate));
            })
            .catch((err) => {
                return (console.log(err))
            })
    }, [])

    return (
        <div className='container seniorActivities'>
            <h2>Historial de mis actividades</h2>
            {upcomingActivities &&
                <div className="row activity1 my-5" style={{ border: "2px dotted #228b22" }}>
                    <h3 className='my-3'>Actividades cercanas</h3>
                    {
                        upcomingActivities.map((acti, index) => {
                            return (
                                <div className="col mb-4" key={index} >
                                    <Card  >
                                        <Card.Img className='fotoCard' variant='top' src='/images/seniority/PlayVideoIMG/video1.png' />
                                        <Card.Body >
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
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            }
            {pastActivities &&
                <div className="row activity2 " style={{ border: "2px dotted #8b0000" }}>
                    <h3 className='my-3'>Actividades realizadas</h3>
                    {
                        pastActivities.map((acti, index) => {
                            return (
                                <div className="col mb-4" key={index}>
                                    <Card style={{ opacity: "0.7" }} >
                                        <Card.Img className='fotoCard' variant='top' src='/images/seniority/PlayVideoIMG/video1.png' />
                                        <Card.Body >
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
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}
