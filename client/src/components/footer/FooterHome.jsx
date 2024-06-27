import React from 'react';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import './footer.scss';

export const FooterHome = () => {
  return (
    <footer className=" footersen">
      <div className="row footer-logo">
        <div className="col-12 col-sm-6">
          <img src="/seniority_logoprincipal_sinfondo_blanco.png" alt="" />
        </div>
      </div>
      <div className="row segunda">
        <div className="col-12 col-sm-6 col-md-8 col-lg-8 col-xl-10 footerlinks">
          <a href="#"><b>Ayuda</b></a>
          <a href="#">Preguntas Frecuentes</a>
          <a href="/Contact">Contactar</a>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2 footerlink">
          <a href="#"><b>Contacto</b></a>
          <a href="#">✉ info@seniority.com</a>
          <a href="#">✆ +34 600 000 000</a>
          <div className="footer-social-icons d-flex gap-3">
            <a href="#" className="socialIcon"><FaFacebook /></a>
            <a href="#" className="socialIcon"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="footer-info">
        <span>&copy; Seniority 2023</span>
        <span><a href="#"><u><i>Condiciones de Uso</i></u></a></span>
        <span><a href="#"><u><i>Política de Privacidad</i></u></a></span>
        <span><a href="#"><u><i>Política de Cookies</i></u></a></span>
      </div>
    </footer>
  );
};


