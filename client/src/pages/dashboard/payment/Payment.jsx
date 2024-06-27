import React, { useEffect, useState } from 'react'
import { CardElement, Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import payment from "./payment.scss"
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51NETCXFYZq5WNJpU6IhNuxE8j13RcQeYKVFU21XyZkvDKdEJ6hcvEPzgE4guQ3CrkNEbd3g7F362AtrfbQS0829z00Nev6mbN7');


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [showerrorMsg, setShowErrorMsg] = useState(false)
  const [showPayOk, setshowPayOk] = useState(false)

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { otherData } = location.state;
  const descriptionString = Object.values(otherData).join(" - ");

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
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/checkout",
          {
            id,
            amount: otherData?.finalprice * 100, //cents
            userID: otherData.userID,
            resultActivity: otherData
          }
        );
        elements.getElement(CardElement).clear();

        if (data.message !== "Successful Payment") {
          setShowErrorMsg(true)
        }
        if (data.message === "Successful Payment") {
          setShowErrorMsg(false)
          setshowPayOk(true)
        }

      } catch (error) {
        setShowErrorMsg(true)
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

  const myprofileActivities = () => {
    navigate(`/users/user/${otherData.userID}`)
  }

  return (
    <>
      {!showPayOk ?
        <form className="card card-body paymentPage" onSubmit={handleSubmit}>

          <Form noValidate validated={validated} onSubmit={handleSubmit2}>
            <Row className="mb-3 interior">
              <h4>Datos de la actividad</h4>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Nombre del/la titular de la tarjeta</Form.Label>
                <Form.Control
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
                {showerrorMsg && <p className="error" style={{ color: "red" }}>Ha habido un error. Compruebe los datos e inténtelo de nuevo. O contacte con el administrador. </p>}
              </Form>

            </Row>
          </Form>


          <button disabled={!stripe} className="btn btn-success paybutton">
            {loading ? (
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Comprar"
            )}
          </button>

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
    </>);
};

function Payment() {

  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row h-100">
          <div className="col h-100 d-flex flex-column align-items-center">

            <CheckoutForm />

          </div>
        </div>
      </div>
    </Elements>
  );
}

export default Payment;
