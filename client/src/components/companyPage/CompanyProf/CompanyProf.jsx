import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import { EditProfessional } from './EditProfessional/EditProfessional'

import "./CompanyProf.scss"


export const CompanyProf = ({ company, showForm, setShowForm, showEditForm, setShowEditForm, componente, setComponente }) => {

  const [compProfs, setCompProfs] = useState([])
  const [profForm, setProfForm] = useState([])
  const [files, setFiles] = useState([])
  const [errorMsg, seterrorMsg] = useState("")
  const [openSelect, setOpenSelect] = useState({});
  const [profId, setProfId] = useState("")



  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfForm({ ...profForm, [name]: value })
  }

  const addPhoto = (e) => {
    let photo = (e.target.files[0])
    setFiles(photo)
  }

  const toggleSelect = (professional_id) => {
    setOpenSelect(prevOpenSelect => ({
      ...prevOpenSelect,
      [`${professional_id}`]: !prevOpenSelect[`${professional_id}`]
    }));
  };

  const editarProfesional = (id_prof) => {
    setProfId(id_prof);
    setShowEditForm(true);


  }

  const eliminarProfesional = (id_prof) => {
    axios
      .put(`http://localhost:4000/users/company/${company.user_id}/${id_prof}/delProf`)
      .then((res) => {
        navigate(`/users/company/${company.user_id}`)
        setShowForm(false)
        setComponente(1)

      })
      .catch((err) => {
        console.log(err)
      })




  }


  const submit = (e) => {
    e.preventDefault();


    const newFormData = new FormData();
    newFormData.append("profForm", JSON.stringify(profForm));
    newFormData.append("file", files);

    axios
      .post(`http://localhost:4000/users/company/${company.user_id}/addProfessional`, newFormData)
      .then((res) => {
        setProfForm([]);
        setShowForm(false);
      })
      .catch((err) => {
        return (console.log(err))
      })

  }

  useEffect(() => {

    axios
      .get(`http://localhost:4000/users/company/${company.user_id}/viewCompanyProfs`)
      .then((res) => {
        setCompProfs(res.data);

      })
      .catch((err) => {
        return (console.log(err))
      })

  }, [showEditForm])


  return (
    <>
      {showEditForm === false ?
        <div>

          {showForm === false &&


            <div className='prof'>

              <Button className='crearPro' onClick={() => setShowForm(true)}>
                <img src="/images/seniority/icons/plusCircle.png" />Añadir un profesional</Button>

              <p className='tituloazul'>Lista de profesionales</p>

              <div>

                {compProfs.map((prof, index) => {

                  const isOpen = openSelect[prof.professional_id]

                  return (

                    <div className="card mb-3 max-width: 540px;" key={index}>
                      <div className="row ">
                        <div className="col-md-4">
                          <img src={`/images/seniority/profsIMG/${prof.professional_img}`} className="img-fluid rounded-start card-img" />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h3 className="nombreazul"><b>{prof.professional_name} {prof.professional_lastname}</b></h3>
                            <h4>{prof.professional_ocupation}</h4>
                            <p className="textooscuro">{prof.professional_description}</p>
                          </div>
                        </div>
                        <div className='trespuntitos' onClick={() => toggleSelect(prof.professional_id)}>
                          <div>
                            <span className="material-symbols-outlined">
                              more_horiz
                            </span>
                          </div>
                          <div className={`menu ${isOpen ? '' : 'hide'}`}>

                            <div onClick={() => editarProfesional(prof.professional_id)}><a>Editar</a></div>

                            <div onClick={() => eliminarProfesional(prof.professional_id)}><a>Eliminar Profesional</a></div>

                          </div>
                        </div>
                      </div>
                    </div>

                  )
                })}
              </div>

            </div>

          }


          {showForm === true &&

            <form className='form'>
              <label className='titulocreate'>
                <p>Nombre:</p>
                <input
                  className="inputs bordeinput"
                  type="text"
                  placeholder='Manuel'
                  name="name" required
                  value={profForm?.name}
                  onChange={handleChange}
                />
              </label><br />

              <label className='titulocreate'>
                <p>Apellido:</p>
                <input className='inputs bordeinput'
                  type="text" name="lastname" required
                  placeholder='Perez'
                  value={profForm?.lastname}
                  onChange={handleChange} />
              </label><br />

              <label className='titulocreate'>
                <p>Ocupación:</p>
                <input
                  className='inputs bordeinput'
                  type="text" name="ocupation" required
                  value={profForm?.ocupation}
                  onChange={handleChange} />
              </label><br />

              <label className='titulocreate'>
                <p>Descripción:</p>
                <textarea
                  className='textarea bordeinput'
                  name="description" required
                  value={profForm?.description}
                  onChange={handleChange} />
              </label><br /><br />

              <label>
                <input type="file" id="upload-photo"
                  name='img'

                  onChange={addPhoto}
                />
              </label><br /><br />



              <Button className='botonregister w-10' onClick={submit}>Añadir profesional</Button>

              <p>{errorMsg}</p>
            </form>



          }
        </div>
        :

        <EditProfessional
          company={company}
          profId={profId}
          setShowEditForm={setShowEditForm}
          setComponente={setComponente}


        />

      }


    </>
  )
}
