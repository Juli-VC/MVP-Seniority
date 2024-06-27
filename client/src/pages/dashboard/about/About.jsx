import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './About.scss';

export const About = () => {
  return (
    <div className="about-page">
      <Container>
        <Row>
          <Col lg={6} md={12} className='foto'>
          <img src="/seniority_logoprincipal_sinfondo_blanco.png"alt="About" className="about-image" />
          </Col>
          <Col lg={6} md={12}>
            <div className="about-content">
        
              <p>
                En Seniority, nos dedicamos a brindar una comunidad inclusiva y enriquecedora para las personas mayores de 60 años. Nuestro objetivo es
                ofrecer actividades, experiencias y oportunidades de socialización adaptadas a los intereses y necesidades de nuestros miembros.
              </p>
              <p>
                Valoramos la diversidad y fomentamos la participación activa de nuestros usuarios. Nuestra plataforma cuenta con una amplia variedad de
                actividades en diferentes categorías, como arte, cultura, deportes, viajes y mucho más. Además, colaboramos con profesionales y expertos
                para garantizar la calidad y el enriquecimiento de cada experiencia.
              </p>
              <p>
                Creemos en la importancia de disfrutar de la vida después de los 60 años y en la capacidad de aprender, descubrir y compartir momentos
                significativos. Seniority es el lugar perfecto para conectar con otros miembros de la comunidad, hacer nuevos amigos y crear recuerdos
                inolvidables.
              </p>
              <p>
                Únete a Seniority hoy mismo y comienza a explorar todas las oportunidades que tenemos para ti. ¡Descubre nuevas pasiones, amplía tus
                horizontes y vive la vida al máximo!
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};


