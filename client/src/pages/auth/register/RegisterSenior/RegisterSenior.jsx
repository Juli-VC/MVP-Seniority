import React, { useContext, useEffect, useState } from 'react'
import registerSenior from "./registerSenior.scss"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SeniorityContext } from '../../../../context/SeniorityProvider'
import jwtDecode from 'jwt-decode'
import { Form, Button } from 'react-bootstrap'


export const RegisterSenior = () => {

  const [categorias, setcategorias] = useState()
  const [categoriForm, setcategoriForm] = useState([])
  const [userForm, setuserForm] = useState([])
  const [files, setFiles] = useState([]);
  const [selectProvince, setselectProvince] = useState([])
  const [selectCity, setselectCity] = useState([])
  const [errorMsg, seterrorMsg] = useState("");
  const [msgErrorNext, setmsgErrorNext] = useState("");
  const [checkConditions, setCheckConditions] = useState(false)
  const [showForm, setshowForm] = useState(1)
  const [idAfterLogin, setidAfterLogin] = useState()
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);


  const navigate = useNavigate();
  const { isLogged, setIsLogged, usertoken, setUserToken } = useContext(SeniorityContext);

  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((res) => {
        setcategorias(res.data)
      })
      .catch((err) => {
        console.log("err", err)

      })
    axios
      .get("http://localhost:4000/selectProvince")
      .then((res) => {
        setselectProvince(res.data)
      })
      .catch((err) => { console.log(err) })



  }, [])

  const handleClickAddCategory = () => {
    const category = categorias.find((cat) => cat.category_id === selectedCategory);
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories((prevCategories) => [...prevCategories, category]);
      setSelectedCategory('');
    }
  };

  const handleClickRemoveCategory = (categoryId, event) => {
    event.preventDefault();
    setSelectedCategories((prevCategories) => prevCategories.filter((cat) => cat.category_id !== categoryId));
  };

  const handleChangeCategories = (event) => {
    const newCategory = event.target.value;
    const category = categorias.find((cat) => cat.category_id.toString() === newCategory.toString());
    if (category) {
      if (selectedCategories.some((cat) => cat.category_id.toString() === newCategory.toString())) {
        // Si la categoría ya está seleccionada, la eliminamos
        setSelectedCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.category_id.toString() !== newCategory.toString())
        );
      } else {
        // Si la categoría no está seleccionada, la agregamos
        setSelectedCategories((prevCategories) => [...prevCategories, category]);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setuserForm({ ...userForm, [name]: value })
  }
  const selectProvClick = (e) => {
    const { name, value } = e.target
    setuserForm({ ...userForm, [name]: value })

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
  const addPhoto = (e) => {
    let photo = (e.target.files[0])
    setFiles(photo)

  }
  const submit = () => {

    const newFormData = new FormData();

    newFormData.append("userForm", JSON.stringify(userForm));
    newFormData.append("file", files);
    newFormData.append("categories", JSON.stringify(selectedCategories));


    axios
      .post("http://localhost:4000/users/createUsers", newFormData)
      .then((res) => {
        window.localStorage.setItem("token", res.data.token);
        setIsLogged(true);
        setidAfterLogin(jwtDecode(res.data.token).user.id);
        setshowForm(2)
      })
      .catch((err) => {
        setmsgErrorNext("")
        seterrorMsg(err.response.data.errorMsg)

      })

  }

  const siguiente1 = (e) => {
    e.preventDefault();
    if (!userForm.email) {
      setmsgErrorNext("Es necesario un email válido para seguir")
    } else if (!userForm.password) {
      setmsgErrorNext("Es necesario una contraseá válida para seguir")
    } else if (userForm?.password?.length < 6) {
      setmsgErrorNext("La contraseña tiene que tener al menos 6 caracteres")
    } else if (!/[A-Z]/.test(userForm?.password)) {
      setmsgErrorNext("La contraseña debe contener al menos una letra mayúscula")
    } else if (!/\d/.test(userForm?.password)) {
      setmsgErrorNext("La contraseña debe contener al menos un número")
    } else if (checkConditions !== true) {
      setmsgErrorNext("Tienes que aceptar nuestras Condiciones Generales y la Política de Privacidad para continuar ")
    } else {
      setshowForm(3)
    }
  }
  const siguiente3 = (e) => {
    e.preventDefault();
    if (!userForm.name) {
      setmsgErrorNext("Es necesario un nombre para continuar")
    }
    else if (!userForm.province_id) {
      setmsgErrorNext("Es necesario elegir una provincia para continuar")
    }
    else if (!userForm.city_id) {
      setmsgErrorNext("Es necesario elegir una ciudad para continuar")
    } else {
      submit()

    }
  }
  const handleCheckConditions = () => {
    setCheckConditions(!checkConditions)
  }
  return (
    <div className='registerpage'>
      <div className='registerdiv'>
        {showForm === 1 && <div className="form1">
          <div className='entra'>
            <p >¿Ya tienes cuenta? <a onClick={() => navigate("/users/login")}>Entra</a></p>
          </div>
          <div className="form1int">
            <h3 className='text-center'>¡Te damos la bienvenida a Seniority!</h3>
            <p className='text-center my-3'>Crea tu cuenta y comienza a disfrutar</p>

            <form>
              <label>
                @  Correo electrónico:<br />
                <input type="email"
                  placeholder='micorreo@gmail.com'
                  name="email" required
                  value={userForm?.email}
                  onChange={handleChange}
                />
              </label><br />

              <label>
                🔒 Contraseña:<br />
                <input type="password" name="password" required
                  value={userForm?.password}
                  onChange={handleChange} />
              </label><br />

              <p>La contraseña debe tener:</p>

              <div className="form-check d-flex align-items-center gap-2">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheck"
                  checked={userForm?.password?.length > 5 ? true : false} />
                <label className="form-check-label" for="invalidCheck" right>
                  6 letras
                </label>
              </div>
              <div className="form-check d-flex align-items-center gap-2">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheck"
                  checked={(!/[A-Z]/.test(userForm?.password)) ? false : true} />
                <label className="form-check-label" for="invalidCheck"
                >
                  1 Mayúscula
                </label>
              </div>
              <div className="form-check d-flex align-items-center gap-2">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheck"
                  checked={(!/\d/.test(userForm?.password)) ? false : true} />
                <label className="form-check-label" for="invalidCheck">
                  1 Número
                </label>
              </div>
              <div className="form-check d-flex align-items-center gap-2 mt-3">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheckbig" required onChange={handleCheckConditions}
                  checked={checkConditions} />
                <label className="form-check-label" for="invalidCheck">
                  Aceptar las <a href="">Condiciones Generales</a>, la <a href="">Política de Privacidad</a> y recibir novedades y promociones.
                </label>

              </div>
              <button className='botonregister w-100' onClick={siguiente1}>Siguiente</button>
              <p>Si necesitas ayuda, llama al +34 600 000 0000</p>
              <p className='errorMsg mt-3'>{msgErrorNext}</p>
            </form>
          </div>
        </div >}
        {
          showForm === 2 && <div className="form2">
            <img src="/images/seniority/icons/cucurucho.png" alt="" height={"131px"} width={"129px"} />
            <h1>El Registro se ha realizado con éxito</h1>
            <p>Para ofrecerte una experiencia personalizada, nos gustaría conocer mejor tus preferencias. </p>


            <button className='finalizar' onClick={() => navigate(`/users/user/${idAfterLogin}`)}>Ver actividades</button>
            <button className='buttonNext' onClick={() => setshowForm(5)}>Ver tutorial</button>
            <button className='btn btn-outline-primary' onClick={() => setshowForm(4)}>Atrás</button>
          </div>
        }
        {
          showForm === 3 && <div className="form3">
            <div className="">
              <h2>¿Qué tipo de actividades quieres?</h2>
              <p>Selecciona al menos 2 opciones</p>
              <div className='galeria'>
                <div className="row">
                  {/* {categorias?.map((elem, index) => {
                    return (
                      <div className="col-6 fotoCategory" key={index} onClick={() => click(elem.category_id)}>
                        <img src={`/images/seniority/categoriesIMG/${elem.category_img}`}
                          alt="" height={"80px"} width={"80px"} />
                        <p>{elem.category_name}</p>
                      </div>
                    )
                  })
                  } */}

                  <Form.Group controlId="validationCustom02">
                    <Form.Select
                      aria-label="Categoría a la que pertenece la actividad"
                      required
                      name="category_id"
                      value={selectedCategory}
                      onChange={handleChangeCategories}
                    >
                      <option>Selecciona una categoría</option>
                      {categorias &&
                        categorias.map((elem, index) => (
                          <option key={index} value={elem.category_id}>
                            {elem.category_name}
                          </option>
                        ))}
                    </Form.Select>
                    {selectedCategories.length > 0 && (
                      <div>
                        <p>Categorías seleccionadas:</p>
                        <ul>
                          {selectedCategories.map((category, index) => (
                            <li key={index}>
                              {category.category_name}{' '}
                              <button onClick={(event) => handleClickRemoveCategory(category.category_id, event)}>Eliminar</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Form.Group>


                </div>
              </div>
              <button className='btn btn-outline-primary' onClick={() => setshowForm(1)}>Atrás</button>
              <button className='btn btn-outline-primary' onClick={() => setshowForm(4)}>Siguiente</button>

            </div>
          </div>
        }
        {
          showForm === 4 && <div className="form4">
            <div className="datospersonales mb-3">
              <h4>Un último paso para configurar tu perfil.</h4>

              <form action='post' encType="multipart/form-data" >
                <label htmlFor="">Por favor, rellena tus datos personales</label>
                <label htmlFor="">Nombre *</label>
                <input type="text"
                  placeholder='Dime tu nombre'
                  name='name'
                  required
                  value={userForm?.name}
                  onChange={handleChange} />
                <label htmlFor="">Apellidos</label>
                <input type="text"
                  placeholder='Apellidos'
                  name='lastname'
                  value={userForm?.lastname}
                  onChange={handleChange} />
                <label htmlFor="">Número de teléfono</label>
                <input type="tel"
                  placeholder='Telefono'
                  name='phone'
                  value={userForm?.phone}
                  onChange={handleChange} />
                <label htmlFor="">Dirección de tu domicilio habitual</label>
                <input type="text"
                  placeholder='Domicilio'
                  name='address'
                  value={userForm?.address}
                  onChange={handleChange} />

                <label htmlFor="1">¿En qué provincia resides habitualmente? *</label>
                <select name="province_id" required id="1" onChange={selectProvClick}>
                  <option >Selecciona una provincia</option>
                  {selectProvince?.map((elem, index) => {
                    return (
                      <option key={index} value={`${elem.province_id}`}>{elem.name}</option>
                    )
                  })
                  }
                </select>
                <label htmlFor="2">¿En qué ciudad/municipio resides habitualmente? *</label>
                <select name="city_id" id="2" required onChange={handleChange}>
                  <option >Selecciona una ciudad/municipio</option>
                  {selectCity?.map((elem, index) => {
                    return (
                      <option key={index} value={`${elem.city_id}`}>{elem.city_name}</option>
                    )
                  })
                  }
                </select>
                <div className="seccionFotoForm d-flex justify-content-center align-items-center gap-3">
                  <div className="foto">
                    <img src="/images/seniority/icons/icon fotoForm.png" alt="" width={"128px"}
                      height={"128px"} style={{ borderRadius: "50px" }} />
                  </div>
                  <div className="addfoto d-flex justify-content-center align-items-center">
                    <label for="upload-photo">
                      <img src="/images/seniority/icons/icon agregar foto.png" alt="" width={"93px"}
                        height={"93px"} style={{ borderRadius: "50px" }} />
                    </label>
                    <input type="file" id="upload-photo"
                      name='img'
                      onChange={addPhoto}
                    />
                  </div>
                  <div className='w-50 text-start'  >
                    (Opcional) Sube tu imagen de perfil para que más amigos puedan encontrarte.
                  </div>
                </div>
                <div className='d-flex justify-content-center text-center w-100'>
                  <button type='button' className='btn btn-outline-primary me-3' onClick={() => setshowForm(3)}>Atrás</button>
                  <button className='btn btn-outline-success' onClick={(e) => siguiente3(e)}>Siguiente</button>
                </div>

              </form>

            </div>

            <p className="errorMsg">{msgErrorNext}{errorMsg}</p>
          </div>
        }
        {
          showForm === 5 &&
          <div className="form5">



            <p>Te hemos preparado un vídeo corto en el que te contamos todo lo que puedes hacer gracias a tu cuenta gratuita en Seniority.</p>
            <br /><br />

            <img className='defvideo' src="/images/videodefault.png" alt="" />
            <br /><br />

            <p>Si no quieres verlo ahora, no te preocupes. También podrás encontrarlo en la sección de Ayuda y en el correo electrónico que te hemos enviado con tu cuenta.</p>

            <br />
            <button className='finalizar' onClick={() => navigate(`/users/user/${idAfterLogin}`)}>Finalizar</button>
            <br /><br />
            <br />
          </div>
        }

      </div >
    </div>

  )
}
