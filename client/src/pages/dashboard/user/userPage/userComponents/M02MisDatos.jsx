import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import m02MisDatos from "./m02MisDatos.scss"
import { EditSenior } from './EditSenior';
import { Button, Modal } from 'react-bootstrap';

import { DelAccButton } from '../../../../../components/DelAccButton/DelAccButton';

export const M02MisDatos = ({ user_id }) => {
    const [seniorData, setseniorData] = useState([])
    const [showEdit, setshowEdit] = useState(false)



    useEffect(() => {
        axios
            .get(`http://localhost:4000/users/seniorData/${user_id}`)
            .then((res) => {
                setseniorData(res.data[0])

            })
            .catch((err) => {
                return (console.log(err))
            })
    }, [showEdit])

    const edit = () => {

    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {!showEdit ?
                <div className='container misDatos ' >
                    <div className="row datosInt">
                        <div className="col d-flex flex-column align-items-center mt-4 ">
                            <img className='seniorIMG' src={`/images/seniority/usersImg/${seniorData.img}`} alt="" />
                        </div>
                        <div className="col mt-4">
                            <div className='d-flex justify-content-between align-items-center w-100 mb-3'>
                                <h3>Mis datos</h3>
                                <div className='editbtn d-flex justify-content-end align-items-center'
                                    onClick={() => setshowEdit(true)}>
                                    <h3>Editar</h3>
                                    <img src="/images/seniority/icons/lapizEditar.png" alt="" width={"15px"} height={"18px"} />
                                </div>
                                <>
                                    <Button variant="primary" onClick={handleShow}>
                                        Eliminar cuenta
                                    </Button>

                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>¿Seguro que quieres eliminar la cuenta?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Cerrar
                                            </Button>
                                            <DelAccButton user_id={user_id} />
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            </div>
                            <p>Nombre y apellidos</p>
                            <p className="blue">{seniorData.name} {seniorData.lastname} </p>
                            <p>Email</p>
                            <p className="blue">{seniorData.email}</p>
                            <p>Dirección</p>
                            <p className="blue">{seniorData.address}</p>
                            <p>Teléfono de contacto</p>
                            <p className="blue">{seniorData.phone}</p>
                            <p>Provincia</p>
                            <p className="blue">{seniorData.province_name}</p>
                            <p>Ciudad/municipio</p>
                            <p className="blue">{seniorData.city_name}</p>
                        </div>
                    </div>
                </div>
                :
                <>
                    <EditSenior seniorData={seniorData} setshowEdit={setshowEdit} />


                </>
            }
        </>

    )
}
