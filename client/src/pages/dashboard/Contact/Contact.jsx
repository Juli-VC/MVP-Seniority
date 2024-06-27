import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Contact.scss';
import axios from 'axios';

export const Contact = () => {
  const [emailForm, setemailForm] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target
    setemailForm({ ...emailForm, [name]: value })
  }
  const nodemailer = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:4000/nodemailer`)
  }


  return (
    <div className="contact-page">
      <Container>
        <Row>
          <Col>
            <h1 className='cont'>Contacto</h1>
            <p>
              ¿Tienes alguna pregunta, sugerencia o comentario? Estamos aquí para ayudarte. Por favor, completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={6} className='formu'>
            <br />
            <br />
            <br />
            <h2 className='conta'>Información de Contacto</h2>
            <p>
              Puedes comunicarte con nosotros a través de los siguientes medios:
            </p>
            <ul>
              <li>Teléfono: +34 600 000 000</li>
              <li>Email: info@seniority.com</li>
              <li>Dirección: Calle Principal 123, Ciudad, País</li>
            </ul>
          </Col>
          <Col md={6} className='formu'>
            <br />
            <h2 className='cont'>Formulario de Contacto</h2>
            <form>
              <div className="contact-form">
                <label htmlFor="name">Nombre</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="contact-form">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="contact-form">
                <label htmlFor="message">Mensaje</label>
                <textarea id="message" name="message" rows="6" required></textarea>
              </div>
              <button type="submit" className='boton' onClick={nodemailer} >Enviar Mensaje</button>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

