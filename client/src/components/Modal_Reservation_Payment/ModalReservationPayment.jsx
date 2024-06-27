import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CardElement, Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

import Modal_reservation_Payment from "./Modal_Reservation_Payment.scss"
import jwtDecode from 'jwt-decode';

const stripePromise = loadStripe('pk_test_51NETCXFYZq5WNJpU6IhNuxE8j13RcQeYKVFU21XyZkvDKdEJ6hcvEPzgE4guQ3CrkNEbd3g7F362AtrfbQS0829z00Nev6mbN7');




const CheckoutForm = ({ show, setShow, setmodalStep, resultActivity, finalprice, userID }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const descriptionString = Object.values(resultActivity, finalprice).join(" - ");


    //Recoge el nombre del titular de la targeta. Para luego pasarselo
    // al billing_details, en paymentMethod.

    const [formPayment, setformPayment] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformPayment({ ...formPayment, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
            billing_details: {
                name: formPayment.cardName
            },
            metadata: {
                description: descriptionString
            }
        });
        setLoading(true);

        if (!error) {
            // console.log(paymentMethod)
            const { id } = paymentMethod;
            try {
                const { data } = await axios.post(
                    "http://localhost:4000/api/checkout",
                    {
                        id,
                        amount: finalprice * 100, //cents
                        resultActivity: resultActivity,
                        description: descriptionString,
                        billing_details: formPayment.cardName,
                        userID: userID
                    }
                );

                elements.getElement(CardElement).clear();
                setshowPayOk(true)

            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
    };

    /// React BS 
    const [validated, setValidated] = useState(false);

    const handleSubmit2 = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };
    const navigate = useNavigate();
    const [showPayOk, setshowPayOk] = useState(false)
    const myprofileActivities = () => {
        navigate(`/users/user/${userID}`)
    }

    return (
        <>
            {!showPayOk ?
                <form className="card card-body" onSubmit={handleSubmit}>
                    <Form noValidate validated={validated} onSubmit={handleSubmit2}>
                        <Row className="mb-3">
                            <p className='mb-4'>Por último, necesitamos los datos de la tarjeta bancaria con la que vas a realizar la compra de la actividad.</p>
                            <Form.Group controlId="validationCustom01" >
                                <Form.Label>Nombre del/la titular de la tarjeta</Form.Label>
                                <Form.Control
                                    className='cardname'
                                    required
                                    type="text"
                                    placeholder="Titular de la tarjeta"
                                    name='cardName'
                                    value={formPayment.cardName}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="validationCustom01" className='my-3'>
                                <Form.Label>Numero de la tarjeta</Form.Label>
                                <CardElement />
                                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
                            </Form.Group>
                            <Form className='mt-3 '>
                                <div key={`inline-checkbox`} className="mb-3 d-flex flex-column">
                                    <Form.Check
                                        inline
                                        label="Aceptar las Condiciones de Pago, la Política de Privacidad."
                                        name="group1"
                                        type="checkbox"
                                        id={`inline-checkbox-1`}
                                    />
                                </div>
                            </Form>
                            <Form className=''>
                                <div key={`inline-checkbox`} className="mb-3 d-flex flex-column">
                                    <Form.Check
                                        inline
                                        label="Quiero una factura"
                                        name="group1"
                                        type="checkbox"
                                        id={`inline-checkbox-1`}
                                    />
                                </div>
                            </Form>

                        </Row>
                    </Form>


                    <button disabled={!stripe} className="btn btn-success">
                        {loading ? (
                            // <div className="spinner-border text-success" role="status">
                            // <span className="sr-only">Loading...</span>
                            // </div> 
                            <> <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando...</>
                        ) : (
                            "Realizar Pago"
                        )}
                    </button>
                    <button onClick={() => setmodalStep(2)} className='secondButton'>Atrás</button>
                </form>
                :
                <div className="payOk">
                    <div className="msgPayOk">
                        <h3>Pago correcto</h3>
                        <p>Se ha realizado el pago de la actividad correctamente. Puede seguir buscando y reservando más actividades. Puede consultar la información de la actividad reservada en su página de perfil, en "Mis actividades". Si tiene algún problema o duda, no dude en contactar con el administrador, en la barra de navegación, en la pestaña "Contacta". </p>

                        <div className="botones">
                            <button onClick={() => navigate("/activities")}>Ir a todas las actividades</button>
                            <button onClick={myprofileActivities}>Mis actividades</button>
                        </div>
                    </div>
                </div>}
        </>
    );
};


export const ModalReservationPayment = ({ show, setShow, resultActivity, finalprice, userID }) => {
    const [modalStep, setmodalStep] = useState(1)
    const handleClose = () => {
        setShow(false);
        setmodalStep(1)
    }

    const navigate = useNavigate();

    return (
        <>
            {modalStep === 1 && <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reserva y compra tu actividad</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column align-items-center text-center'>
                    <img src="/images/seniority/icons/shoppingBags.png" alt="" height={"124px"} width={"124px"} />
                    <p>Confirma tu reserva de la actividad y elige el método de pago</p>

                    <button onClick={() => setmodalStep(2)} >Confirmar reserva</button>
                    <p onClick={handleClose} className='cancel' >Cancelar Reserva</p>
                </Modal.Body>
            </Modal>}
            {modalStep === 2 && <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Reserva y compra tu actividad</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column '>
                    <p>Hola, {"nombre"} </p>
                    <p>Primero a vamos a pedirte que, por favor, revises los datos de tu reserva y confirmes si está todo correcto.</p>
                    <h4>Datos de la actividad</h4>
                    <p>Nombre de la actividad:</p>
                    <p className="bold">{resultActivity?.title}</p>
                    <p>Lugar de la actividad:</p>
                    <p className="bold">{resultActivity?.province_name}, {resultActivity?.city_name}</p>
                    <p className="bold">{resultActivity?.activity_address}</p>
                    <p>Fecha de la actividad:</p>
                    <p className="bold">{resultActivity?.start_date}</p>
                    <p>Hora de la actividad:</p>
                    <p className="bold">{resultActivity?.start_hour + " - " + resultActivity?.end_hour}</p>


                    <button onClick={() => setmodalStep(3)} >Realizar el pago en la web</button>
                    <button onClick={() => navigate("/allActivities")} className='secondButton' >Pagar en efectivo el día de la actividad</button>
                    <p onClick={handleClose} className='cancel' >Cancelar Reserva</p>

                </Modal.Body>
            </Modal>}
            {modalStep === 3 && <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            /* size='lg' */
            >
                <Modal.Header closeButton ></Modal.Header>
                <Modal.Body className='d-flex flex-column align-items-center text-start'>
                    <p className='text-center'>Paso 2/2</p>
                    <Elements stripe={stripePromise}>
                        <div className="container">
                            <div className="row h-100 ">
                                <div className="col-md-10 offset-1 ">

                                    <CheckoutForm show={show} setShow={setShow} userID={userID}
                                        setmodalStep={setmodalStep} resultActivity={resultActivity} finalprice={finalprice} />

                                </div>
                            </div>
                        </div>
                    </Elements>

                </Modal.Body>
            </Modal>}
        </>
    )
}
