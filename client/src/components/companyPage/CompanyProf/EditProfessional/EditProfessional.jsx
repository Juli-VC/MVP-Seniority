import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import "./EditProfessional.scss"


export const EditProfessional = ({ company, profId, setShowEditForm, setComponente }) => {
    const [profForm, setProfForm] = useState([])
    const [profInfo, setProfInfo] = useState([])
    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        axios
            .get(`http://localhost:4000/users/company/${company.user_id}/${profId}/getOneProf`)
            .then((res) => {
                setProfInfo(res.data[0]);

            })
            .catch((err) => {
                return (console.log(err))
            })
    }, [profId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setProfInfo({ ...profInfo, [name]: value })
    }

    const addPhoto = (e) => {
        let photo = (e.target.files[0])
        setFiles(photo)

    }

    const submit = (e) => {
        e.preventDefault();

        const newFormData = new FormData();
        newFormData.append("profInfo", JSON.stringify(profInfo));
        newFormData.append("file", files)

        axios
            .put(`http://localhost:4000/users/company/${company.user_id}/${profId}/updateProf`, newFormData)
            .then((res) => {
                setShowEditForm(false)
                navigate(`/users/company/${company.user_id}`)


            })
            .catch((err) => {
                console.log("err edit prof", err)
            })


    }




    return (

        <div className="container prof">
            <div className="row">
                <div className="datospersonales">
                    <h4 className='tituloazul'>Editar la información del profesional</h4>
                    <form action='post' encType="multipart/form-data" >
                        <label className='nombreazul'>Nombre y Apellido</label><br />
                        <input type="text"
                            placeholder={`${profInfo.professional_name}`}
                            name='professional_name'
                            value={profInfo?.professional_name}
                            onChange={handleChange} />
                        <input type="text"
                            placeholder={`${profInfo.professional_lastname}`}
                            name='professional_lastname'
                            value={profInfo?.professional_lastname}
                            onChange={handleChange} /><br />
                        <label className='nombreazul'>Ocupación</label><br />
                        <input type="text"
                            defaultValue={`${profInfo.professional_ocupation}`}
                            name='professional_ocupation'
                            value={profInfo?.professional_ocupation}
                            onChange={handleChange} /><br />
                        <label className='nombreazul'>Descripción</label><br />
                        <input type="textarea"
                            className='paddinabajo'
                            defaultValue={`${profInfo.professional_description}`}
                            name='professional_description'
                            value={profInfo?.professional_description}
                            onChange={handleChange} />
                        <br /><br />
                        <div className="seccionFotoForm d-flex justify-content-center align-items-center gap-3">
                            <div className="foto">
                                <img src={`/images/seniority/profsIMG/${profInfo.professional_img}`} alt="" width={"128px"}
                                    height={"128px"} style={{ borderRadius: "50px" }} />
                            </div>
                            <div className="addfoto d-flex justify-content-center align-items-center">
                                <label for="upload-photo">
                                    <img src="/images/seniority/icons/icon agregar foto.png" width={"93px"} height={"93px"} style={{ borderRadius: "50px" }} /></label>
                                <input type="file" id="upload-photo"
                                    name='professional_img'
                                    onChange={addPhoto}
                                />
                            </div>
                            <div className='w-50 text-start'  >
                                <p>Cambia tu imagen de perfil</p>
                            </div>
                        </div>
                        <br />

                        <button className='botonregister' onClick={submit}>Guardar cambios</button>
                        <br />
                        <br />
                        <button className='btn btn-outline-secondary' onClick={() => setShowEditForm(false)}> Cancelar</button>

                    </form>
                </div>

            </div>

        </div >




    )
}
