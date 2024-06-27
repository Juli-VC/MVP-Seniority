import React, { useState } from 'react'
import "./oneactivity3.scss"
import { ModalReservationPayment } from '../../../../../components/Modal_Reservation_Payment/ModalReservationPayment';
import CalendarActivity from '../CalendarActivity'
export const OneActivity3 = ({resultActivity}) => {


  //Modal
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <>
    {/* precio */}
    <div className='precio'>
    <p>{resultActivity?.price} €</p>
    </div>
    {/* fecha y hora */}
    <div className='date2'>
      <div className='center'>
      <div className='fecha-hora'>
     <img src="/images/seniority/icons/calendario.png" alt="" />
    <p>{resultActivity?.week_day}</p>
    </div>
    <div className='fecha-hora'>
     <img src="/images/seniority/icons/reloj2.png" alt=""/>
    <p>{resultActivity?.start_hour}</p>
    </div>
    </div>
     </div>
    {/* calendario */}
      <div className='calendario'>
    <p><b>Selecciona un día</b></p>
    <CalendarActivity resultActivity={resultActivity} />
      </div>
      {/* pago */}
      <div className='pago'>
         <button onClick={handleShow} className='boton-pago'>Reservar</button>
          <ModalReservationPayment
            show={show} setShow={setShow}
             resultActivity={resultActivity} /*finalprice={finalprice} */ />
      </div>
     

    
   
        
    </>
  )
}
