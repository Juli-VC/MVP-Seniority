import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const RegisterCompany = () => {
  const [formCompany, setformCompany] = useState([])
  const [selectProvince, setselectProvince] = useState([])
  const [selectCity, setselectCity] = useState([])
  const [showOk, setshowOk] = useState(0)
  const [errorMsg, seterrorMsg] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:4000/selectProvince")
      .then((res) => {
        setselectProvince(res.data)
      })
      .catch((err) => { console.log(err) })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformCompany({ ...formCompany, [name]: value })
  }
  const selectProvClick = (e) => {
    const { name, value } = e.target
    setformCompany({ ...formCompany, [name]: value })

    axios
      .get("http://localhost:4000/selectCity", {
        headers: {
          Authorization: value
        },
      })
      .then((res) => {
        setselectCity(res.data)
      })
      .catch((err) => { console.log(err) })

  }
  const submit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/users/createCompany", formCompany)
      .then((res) => {
        setshowOk(1)
        //mandar email al admin
      })
      .catch((err) => {

        setshowOk(2)

        if (err.response.data.errorMsg) {
          seterrorMsg(err.response.data?.errorMsg)
        } else {
          setshowOk(2)
        }
      })

  }

  return (
    <div className='row'>
      <h2>RegisterCompany</h2>
      <div className="forumularioEmpresa col-12 d-flex flex-column align-items-center justify-content-end">
        <form className='d-flex flex-column w-25' >
          <label htmlFor="">Nombre de la Empresa</label>
          <input type="text"
            placeholder='Nombre de la actividad'
            name='name'
            value={formCompany.name}
            onChange={handleChange}
          />
          <label htmlFor="">Telefono de contacto</label>
          <input type="text"
            placeholder='65552244'
            name='phone'
            value={formCompany.phone}
            onChange={handleChange}
          />
          <label htmlFor="">Direccion de la empresa</label>
          <input type="text"
            placeholder='Calle nº 1'
            name='address'
            value={formCompany.address}
            onChange={handleChange}
          />
          <label htmlFor="">Email</label>
          <input type="text"
            placeholder='email@email.com'
            name='email'
            value={formCompany.email}
            onChange={handleChange}
          />
          <label htmlFor="">Contraseña</label>
          <input type="password"
            placeholder=''
            name='password'
            value={formCompany.password}
            onChange={handleChange}
          />
          <label htmlFor="1">¿En qué provincia se desarrolla la actividad?</label>
          <select name="province_id" id="1" onChange={selectProvClick}>
            {selectProvince?.map((elem, index) => {
              return (
                <option key={index} value={`${elem.province_id}`}>{elem.name}</option>
              )
            })
            }
          </select>
          <label htmlFor="2">¿En qué ciudad/municipio se desarrolla la actividad?</label>
          <select name="city_id" id="2" onChange={handleChange}>
            {selectCity?.map((elem, index) => {
              return (
                <option key={index} value={`${elem.city_id}`}>{elem.city_name}</option>
              )
            })
            }
          </select>
          <label htmlFor="">Sitio Web <span>(opcional)</span></label>
          <input type="text"
            placeholder='www.tusitioweb.com'
            name='website'
            value={formCompany.website}
            onChange={handleChange}
          />
          <label htmlFor="">Cuéntanos brevemente qué actividades y servicios ofreces a las personas senior</label>
          <textarea name="services"
            value={formCompany.services} id="" cols="30" rows="4"
            onChange={handleChange}></textarea>

          <button className='btn btn-primary' onClick={submit}>Crear Cuenta</button>

          {
            showOk === 1 ?
              <>
                <div>
                  <h2>Formulario recibido</h2>
                  <p>Nos pondremos en contacto en un máximo de 24 h. en el correo que nos has proporcionado: rosaruiz@activate.com
                    En el correo encontrarás un enlace si está todo correcto para comenzar la Prueba Gratuita y algunos vídeo que te explicarán cómo sacarle el máximo partido a Seniority.</p>
                </div>
                <button className='btn btn-primary' >Echar un vistazo a la web</button>
              </>
              :
              showOk === 2 &&
              <>
                <p>Ha habido un error en el registro. Por favor, contacte con el administrador. 6662226262 email@email.com</p>
              </>
          }
          {
            errorMsg && <p>{errorMsg}</p>
          }



        </form>
      </div>
    </div>
  )
}
