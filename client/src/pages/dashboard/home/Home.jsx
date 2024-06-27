import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './home.scss';

export const Home = () => {
  const navigate = useNavigate();
  const [highlightedActivities, setHighlightedActivities] = useState([]);
  const [homeCompanies, setHomeCompanies] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:4000/activities/highlightedActivities')
      .then((res) => {
        setHighlightedActivities(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/users/homeCompany')
      .then((res) => {
        setHomeCompanies(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const vistaOneActivity = (activity) => {
    navigate(`/activities/${activity}`);
  };

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
    };
    navigate(`/payment/${acti.activity_id}`, { state: { otherData } });
  };
  return (
    <div className='bodyIndex'>
      <div className='portada container-fluid p-0'>
        <div className='row w-100 m-0 portadaInt'>
          <div className='blueScreen col-12 col-xl-6'>
            <h1>Seniority es la comunidad para disfrutar de tu tiempo</h1>
            <p>
              Disfruta de tu tiempo haciendo todo lo que te gusta y forma parte de la comunidad de seniors con quienes podrás compartir las risas y experiencias.
            </p>
            <div className='d-flex w-100 justify-content-around'>
              <div className='b1 w-50'>
                <button className='boton1 w-75' onClick={() => navigate('/activities')}>
                  Ver las actividades
                </button>
              </div>
              <div className='b2 w-50'>
                <button className='boton2 w-75' onClick={() => navigate('/RegisterSenior')}>
                  Crea tu cuenta gratis
                </button>
              </div>
            </div>
          </div>
          <div className='picture col-12 col-xl-6'>
            <img src='images/portadaBig.jpg' alt='' className='' />
          </div>
        </div>
      </div>
      <div className='container-fluid actis '>
        <h3 className='seniority-title'>Actividades destacadas</h3>
        <div className='row row4filas'>
          {highlightedActivities.map((activity, index) => {

            const finalprice = activity.price - parseFloat(activity.price * activity.discount / 100).toFixed(2);

            if (activity.price === null || activity.price == 0 || activity.price === undefined) {
              finalprice = activity.price;
            }

            return (
              <div className='col  cardActivities mb-5' key={index}>
                <Card className='cardmapeo' onClick={() => vistaOneActivity(activity.activity_id)}>
                  <div className='card-header p-0 w-100'>
                    <div className='tagNuevo'>Nuevo</div>
                    <Card.Img variant='top' src='/images/seniority/PlayVideoIMG/video1.png' />
                  </div>
                  <Card.Body >
                    <div className='cardBody_inside'>
                      <Card.Title>{activity.title}</Card.Title>
                      <Card.Text>
                        <p>
                          Un curso con <span className='black'>{activity.name}</span>
                        </p>
                        <p className='date'>
                          {activity.week_day} - {new Date(activity.start_date).toISOString().split('T')[0]}
                        </p>
                        <p className='time'>{!activity.end_hour ? activity.start_hour : activity.start_hour + ' - ' + activity.end_hour}</p>
                        <p className='places'>
                          {activity.city_name}, {activity.province_name}
                        </p>
                        <div className='iconitos'>
                          <div>
                            <img className='me-2' src='/images/seniority/icons/person.png' alt='' width={'20px'} height={'20px'} />{' '}
                            Asistentes: {activity.asistentes}
                          </div>
                          <div>
                            <img className='me-2' src='/images/seniority/icons/thumb.png' alt='' width={'20px'} height={'20px'} /> ({activity.likes})
                          </div>
                        </div>
                        <div className={activity.discount == null || activity.discount == 0 || activity.discount == undefined ? "hidden" : "discount"}>
                          -{activity.discount}% Dto. Antes <span className='tachado'>{activity.price}€</span>
                        </div>
                      </Card.Text>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <button onClick={() => rerservPayment({ acti: activity, finalprice: activity.finalprice })}>
                      <img src='/images/seniority/icons/icon cart.png' alt='' />
                      Comprar {finalprice}€
                    </button>
                  </Card.Footer>
                </Card>
              </div>

            )
          })}
        </div>
      </div>
      <div className='botonconocer'>
        <button className='bot' onClick={() => navigate('/activities')}>Conocer más actividades
          <img src="/images/seniority/icons/arrow.png" alt="" /></button>
      </div>
      <div className='container seniority-section '>
        <div className="row ">
          <h3 className='seniority-title mb-5'>Seniority te ofrece</h3>
          <div className='col-12 col-md-12 col-lg-6 mb-5 seniority-icons'>
            <div className='seniority-icon'>
              <img src='images/carafeliz.png' alt='Actividades' />
              <p>Actividades que se adaptan a ti</p>
            </div>
            <div className='seniority-icon'>
              <img src='images/personas.png' alt='Equipos profesionales' />
              <p>Equipos profesionales</p>
            </div>
            <div className='seniority-icon'>
              <img src='images/disfruta.png' alt='Conoce a nuevas personas' />
              <p>Conoce a nuevas personas</p>
            </div>
          </div>
          <div className='col-12 col-md-12 col-lg-6 mb-5 seniority-icons'>
            <div className='seniority-icon'>
              <img src='images/badge.png' alt='Compartir con tus seres queridos' />
              <p>Compartir con tus seres queridos</p>
            </div>
            <div className='seniority-icon'>
              <img src='images/diversity_1.png' alt='Disfruta de tu tiempo' />
              <p>Disfruta de tu tiempo</p>
            </div>
            <div className='seniority-icon'>
              <img src='images/paid.png' alt='Puedes pagar en efectivo, con tarjeta o bizum' />
              <p>Puedes pagar en efectivo, con tarjeta o bizum</p>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="container empresasContainer">
        <h3 className='seniority-title'>Profesionales de Seniority</h3>
        <div className="row">
          {homeCompanies.map((company, index) => (
            <div className='col-12 col-sm-6 col-md-4 col-lg-3 cardActivities' key={index}>
              <Card>
                <div className='card-header p-0 w-100'>
                  <Card.Img variant='top' src='/images/seniority/PlayVideoIMG/video1.png' />
                </div>
                <Card.Body>
                  <div className='cardBody_inside'>
                    <Card.Title>{company.name}</Card.Title>
                    <Card.Text>
                      <p className='places'>{company.city_name}, {company.province_name}</p>
                      <div className='iconitos'>
                        <div>
                          <img className='me-2' src='/images/seniority/icons/thumb.png' alt='' width={'20px'} height={'20px'} /> ({company.likes})
                        </div>
                      </div>
                    </Card.Text>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <button className='boton1 ' onClick={() => navigate('/activities')}>
                    Actividades
                  </button>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <br />
      <div className='botonconocer'>
        <button className='bot' onClick={() => navigate(`/users/company/${homeCompanies[0].user_id}`)}>Conocer todas las empresas
          <img src="/images/seniority/icons/arrow.png" alt="" /></button>
      </div>
      <div className='container haztePartner  d-flex justify-content-center'>
        <div className="row   gap-5 gap-sm-5 gap-md-5 gap-lg-0">
          <div className='primer  col-12 col-md-12 col-lg-6 d-flex justify-content-center flex-column align-items-md-start '>
            <h3 className='titulo'>Hazte Partner</h3>
            <p className='parrafo'>
              Únete a nuestro programa de socios y crece con nosotros. Obtén acceso exclusivo a beneficios, oportunidades y una comunidad de profesionales apasionados. Descubre un mundo de colaboración, networking y desarrollo empresarial. ¡Únete hoy y sé parte del éxito!
            </p>
            <div className='botones'>
              <button className='boton' onClick={() => navigate('/RegisterCompany')}>
                Quiero información
              </button>
              <a className='consulta' href=''>
                Consulta condiciones
              </a>
            </div>
          </div>
          <div className='img-pc col-12 col-md-12 col-lg-6 d-flex justify-content-center flex-column align-items-center ' >
            <img src='images/haztepartner.png' alt='' className='img-fluid' />
          </div>
        </div>

      </div>
      <div className='opiniones row py-5 px-3 text-center'>
        <h3 className='tituloopiniones'>Qué opinan de Seniority</h3>
        <br />
        <br />
        <br />
        <div className='col-12 col-md-4 opi'>
          <img src='images/angeles.png' alt='' />
          <br />
          <br />
          <p>“ Por fin puedo disfrutar de mi tiempo con actividades hechas para mí ”</p>
          <p className='nombres'>Ángeles López</p>
        </div>
        <div className='col-12 col-md-4 opi'>
          <img src='images/luisa.png' alt='' />
          <br />
          <br />
          <p>“ Por fin puedo disfrutar de mi tiempo con actividades hechas para mí ”</p>
          <p className='nombres'>Luisa M.</p>
        </div>
        <div className='col-12 col-md-4 opi'>
          <img src='images/pedro.png' alt='' />
          <br />
          <br />
          <p>“ Por fin puedo disfrutar de mi tiempo con actividades hechas para mí ”</p>
          <p className='nombres'>Pedro A.</p>
        </div>
      </div>
    </div>
  );
};