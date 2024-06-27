import React, { useEffect, useState } from 'react'


import createActivity from "./createActivity.scss"
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

export const CreateActivity = ({ setShowForm, setComponente }) => {
  const [formActivity, setformActivity] = useState({})
  const [allcategories, setAllcategories] = useState();
  const [selectProvince, setselectProvince] = useState([])
  const [selectCity, setselectCity] = useState([])
  const [errorMsg, seterrorMsg] = useState("")
  const [files, setFiles] = useState([]);
  const [professionalList, setprofessionalList] = useState([])
  const [formProfesional, setformProfesional] = useState([])
  const navigate = useNavigate();
  const user_id = useParams().user_id;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:4000/")
      .then((res) => {
        setAllcategories(res.data);
      })
      .catch((error) => {
        console.log("Error en el axios", error);
      });

    axios
      .get("http://localhost:4000/professionalList")
      .then((res) => {
        setprofessionalList(res.data);
      })
      .catch((error) => {
        console.log("Error en el axios", error);
      });

    axios
      .get("http://localhost:4000/selectProvince")
      .then((res) => {
        setselectProvince(res.data)
      })
      .catch((err) => { console.log(err) })

  }, [])
  console.log("professionalList", professionalList);

  const getCategoryName = (categoryId) => {
    const category = allcategories?.find((cat) => cat.category_id === categoryId);
    return category ? category.category_name : '';
  };
  const selectProvClick = (e) => {
    const { name, value } = e.target
    setformActivity({ ...formActivity, [name]: value })

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
  const check = (x) => {
    setformActivity({ ...formActivity, accesibility: x })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformActivity({ ...formActivity, [name]: value })
  }
  const handleChangeProfes = (e) => {
    const { name, value } = e.target;
    setformActivity({ ...formActivity, [name]: value })
  }
  const addPhoto = (e) => {
    let photo = (e.target.files[0])
    setFiles(photo)
  }

  const handleChangeCategories = (event) => {
    const newCategory = event.target.value;
    const category = allcategories.find((cat) => cat.category_id.toString() === newCategory.toString());
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
  const handleClickAddCategory = () => {
    const category = allcategories.find((cat) => cat.category_id === selectedCategory);
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories((prevCategories) => [...prevCategories, category]);
      setSelectedCategory('');
    }
  };
  const handleClickRemoveCategory = (categoryId, event) => {
    event.preventDefault();
    setSelectedCategories((prevCategories) => prevCategories.filter((cat) => cat.category_id !== categoryId));
  };

  const submit = () => {

    const startHour = formActivity?.start_hour; // Formato: "00:00"
    const duration = formActivity?.duration; // Duración en horas (ejemplo: 1, 1.5, 2)
    // Convertir start_hour a minutos
    const [startHourHours, startHourMinutes] = startHour.split(":");
    const startHourInMinutes = parseInt(startHourHours, 10) * 60 + parseInt(startHourMinutes, 10);
    // Calcular end_hour en minutos
    const durationInMinutes = duration * 60;
    const endHourInMinutes = startHourInMinutes + durationInMinutes;
    // Convertir end_hour a formato de hora (HH:MM)
    const endHourHours = Math.floor(endHourInMinutes / 60).toString().padStart(2, "0");
    const endHourMinutes = (endHourInMinutes % 60).toString().padStart(2, "0");
    const endHour = `${endHourHours}:${endHourMinutes}`;

    let finalformActivity = { ...formActivity, end_hour: endHour };
    finalformActivity = { ...finalformActivity, selectedCategories: JSON.stringify(selectedCategories) };

    const newFormData = new FormData();
    newFormData.append("finalformActivity", JSON.stringify(finalformActivity));
    newFormData.append("file", files);


    axios
      .post(`http://localhost:4000/activities/createActivity/${user_id}`, newFormData)
      .then((res) => {
        navigate(`/users/company/${user_id}`)
        setShowForm(false);
        setComponente(3);
      })
      .catch((err) => {
        seterrorMsg(err.response.data.errorMsg)
      })
  }

  /// React BS 
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const [showErrorMsg, setshowErrorMsg] = useState(false)
  const validateSubmit = () => {
    if (formActivity.title && formActivity.difficulty && formActivity.max_group && formActivity.min_group && formActivity.price && formActivity.province_id && formActivity.city_id && formActivity.activity_address && formActivity.accesibility && formActivity.start_date && formActivity.end_date && formActivity.start_hour && formActivity.duration) {
      submit()
    } else {
      setshowErrorMsg(true)
    }
  }
  return (
    <div className='blanquito'>
      <div className="extForm">
        <div className="forumularioEmpresa">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <h4>Datos de la actividad</h4>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Nombre de la actividad</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Nombre de la actividad"
                  name='title'
                  value={formActivity.title}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="validationCustom02">
                <Form.Select
                  aria-label="Categoría a la que pertenece la actividad"
                  required
                  name="category_id"
                  value={selectedCategory}
                  onChange={handleChangeCategories}
                >
                  <option >Selecciona una categoría</option>
                  {allcategories &&
                    allcategories.map((elem, index) => (
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
              <Form.Group controlId="validationCustom06" >
                <Form.Label>Profesional que organiza</Form.Label>
                <Form.Select aria-label="Nombre del profesional"
                  required
                  name='professional_id'
                  onChange={handleChangeProfes}>
                  <option  >Selecciona un profesional</option>
                  {professionalList && professionalList.map((elem, index) => {
                    return (
                      <option key={index} value={elem.professional_id}>{elem.professional_name} {elem.professional_lastname}</option>
                    )
                  })
                  }
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="validationCustom04" >
                <Form.Label>Dificultad de la actividad</Form.Label>
                <Form.Select aria-label="Nivel de dificultad"
                  required
                  name='difficulty'
                  value={formActivity.difficulty}
                  onChange={handleChange}>
                  <option  >Seleciona un nivel de dificultad</option>
                  <option value="1">Baja</option>
                  <option value="2">Media</option>
                  <option value="3">Alta</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Descripción de la actividad</Form.Label>
                <Form.Control as="textarea" rows={6} />
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Mínimo nº de asistentes</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="1"
                  placeholder="5"
                  name='min_group'
                  value={formActivity.min_group}
                  onChange={handleChange}
                /> personas
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Máximo nº de asistentes</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="1"
                  placeholder="30"
                  name='max_group'
                  value={formActivity.max_group}
                  onChange={handleChange}
                /> personas
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>File</Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  onChange={addPhoto}
                />
              </Form.Group>
              <p className="formatosFILE">Formatos válidos: imágenes .jpg y vídeos .mp4 (máx 10MB) </p>
              <Form.Group controlId="validationCustom02">
                <Form.Label>Descuento % precio</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="10%"
                  name='discount'
                  value={formActivity.discount}
                  onChange={handleChange}
                /> %
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom02">
                <Form.Label>Precio de la actividad</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="0.01"
                  placeholder="00.00"
                  name='price'
                  value={formActivity.price}
                  onChange={handleChange}
                /> €
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <h4>Lugar</h4>
              <Form.Group controlId="validationCustom04" >
                <Form.Label>Provincia donde se desarrolla la actividad</Form.Label>
                <Form.Select aria-label="Provincia donde se desarrolla la actividad"
                  required
                  name='province_id'
                  onChange={selectProvClick}>
                  {selectProvince?.map((elem, index) => {
                    return (
                      <option key={index} value={`${elem.province_id}`}>{elem.name}</option>
                    )
                  })
                  }
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="validationCustom04" >
                <Form.Label>Ciudad/munucipio donde se desarrolla la actividad</Form.Label>
                <Form.Select aria-label="Ciudad/munucipio donde se desarrolla la actividad"
                  required
                  name='city_id'
                  onChange={handleChange}>
                  {selectCity?.map((elem, index) => {
                    return (
                      <option key={index} value={`${elem.city_id}`}>{elem.city_name}</option>
                    )
                  })
                  }
                </Form.Select>
              </Form.Group>
              <p>¿Es un lugar accesible?</p>
              <Form className=''>
                <div key={`inline-radio`} className="mb-3 d-flex flex-column">
                  <Form.Check
                    inline
                    label="Sí, tiene ascensor, rampas, etc."
                    name="accesibility"
                    value={formActivity.accesibility}
                    onClick={() => check(0)}
                    type="radio"
                    id={`inline-radio-1`}
                  />
                  <Form.Check
                    inline
                    label="No, no es accesible"
                    name="accesibility"
                    value={formActivity.accesibility}
                    onClick={() => check(1)}
                    type="radio"
                    id={`inline-radio-2`}
                  />
                </div>
              </Form>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Punto de encuentro (dirección)</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Calle ejemplo nº 4"
                  name='activity_address'
                  value={formActivity.activity_address}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <h4>Fecha y Horarios</h4>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Día que se Inicia</Form.Label>
                <Form.Control
                  required
                  type="date"
                  placeholder="00/00/2023"
                  name='start_date'
                  value={formActivity.start_date}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Día que se Finaliza</Form.Label>
                <Form.Control
                  required
                  type="date"
                  placeholder="00/00/2023"
                  name='end_date'
                  value={formActivity.end_date}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Hora de inicio de la actividad</Form.Label>
                <Form.Control
                  required
                  type="time"
                  step="1800"
                  placeholder="17:00"
                  name='start_hour'
                  value={formActivity.start_hour}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Duración aproximada de la actividad (rangos de 30 minutos)</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="0.5"
                  placeholder="0.5h, 1h, 1.5h, 2h,...."
                  name='duration'
                  value={formActivity.duration}
                  onChange={handleChange}
                />horas
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <h4>Información adicional</h4>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Teléfono de contacto</Form.Label>
                <Form.Control

                  type="number"
                  placeholder="65432102"
                  name='phone'
                  value={formActivity.phone}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>Idioma de la actividad</Form.Label>
                <Form.Control

                  type="text"
                  placeholder="Castellano, gallego, vasco, catalán, inglés, etc."
                  name='language'
                  value={formActivity.language}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>¿Qué deben traer a la actividad?</Form.Label>
                <Form.Control

                  type="text"
                  placeholder="Libreta, cámara de fotos, etc."
                  name='items'
                  value={formActivity.items}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="validationCustom01">
                <Form.Label>¿Qué incluye la actividad?</Form.Label>
                <Form.Control

                  type="text"
                  placeholder="Por ejemplo: Entrada al museo y guía"
                  name='include'
                  value={formActivity.include}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>Todo correcto</Form.Control.Feedback>
              </Form.Group>

              <Button type='submit' onClick={validateSubmit}>Guardar</Button>
            </Row>
          </Form>
          {showErrorMsg && <p className="error" style={{ color: "red" }}>Hay algún campo obligatorio sin rellenar o seleccionar.</p>}
        </div>
      </div >
    </div >
  )
}
