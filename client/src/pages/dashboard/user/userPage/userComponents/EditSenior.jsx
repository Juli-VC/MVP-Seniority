import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const EditSenior = ({ seniorData, setshowEdit }) => {
    const [userForm, setuserForm] = useState([])
    const [categorias, setcategorias] = useState()
    const [files, setFiles] = useState([]);
    const [selectProvince, setselectProvince] = useState([])
    const [selectCity, setselectCity] = useState([])
    const [categoriForm, setcategoriForm] = useState([])
    const [showForm, setshowForm] = useState(1)
    const [errorMsg, seterrorMsg] = useState("");

    const user_id = (jwtDecode(window.localStorage.getItem("token")).user.id)

    const navigate = useNavigate();

    useEffect(() => {
        setuserForm(seniorData)
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

    const click = (category_id) => {
        setcategoriForm([...categoriForm, category_id])
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setuserForm({ ...userForm, [name]: value })
    }
    const selectProvClick = (e) => {
        const { name, value } = e.target
        setuserForm((prevUserForm) => ({
            ...prevUserForm,
            [name]: value,
            city_id: prevUserForm.city_id || null, // Mantener el valor actual si ya está seleccionado
        }));
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
    const submit = (e) => {
        e.preventDefault();

        const newFormData = new FormData();
        newFormData.append("userForm", JSON.stringify(userForm));
        newFormData.append("file", files)

        axios
            .put(`http://localhost:4000/users/editUser/${user_id}`, newFormData)
            .then((res) => {
                setshowEdit(false)
                window.localStorage.setItem("token", res.data.token)
                navigate(`/users/user/${user_id}`)
            })
            .catch((err) => {
                seterrorMsg(err.response?.data.errorMsg)
            })
    }

    return (

        <div className="container edit">
            <div className="row">
                <div className='registerdiv'>
                    <div className="form4">
                        <div className="datospersonales">
                            <h4>Un último paso para configurar tu perfil.</h4>

                            <form action='post' encType="multipart/form-data" >
                                <label htmlFor="">Por favor, ¿cómo te llamas?</label>  <input type="text"
                                    placeholder='Dime tu nombre'
                                    name='name'
                                    value={userForm?.name}
                                    onChange={handleChange} />
                                <input type="text"
                                    placeholder='Telefono'
                                    name='phone'
                                    value={userForm?.phone}
                                    onChange={handleChange} />
                                <input type="text"
                                    placeholder='Direccion de tu domicilio'
                                    name='address'
                                    value={userForm?.address}
                                    onChange={handleChange} />
                                <input type="text"
                                    placeholder='Apellidos'
                                    name='lastname'
                                    value={userForm?.lastname}
                                    onChange={handleChange} />
                                <br />
                                <label htmlFor="1">¿En qué provincia resides habitualmente?</label>
                                <select name="province_id" id="1" onChange={selectProvClick}>
                                    <option  >{userForm.province_name}</option>
                                    {selectProvince?.map((elem, index) => {
                                        return (
                                            <option key={index} value={`${elem.province_id}`}>{elem.name}</option>
                                        )
                                    })
                                    }
                                </select>
                                <label htmlFor="2">¿En qué ciudad/municipio resides habitualmente?</label>
                                <select name="city_id" id="2" onChange={handleChange}>
                                    <option  >{userForm.city_name}</option>
                                    {selectCity?.map((elem, index) => {
                                        return (
                                            <option key={index} value={`${elem.city_id}`}>{elem.city_name}</option>
                                        )
                                    })
                                    }
                                </select>
                                <div className="seccionFotoForm d-flex justify-content-center align-items-center gap-3">
                                    <div className="foto">
                                        <img src={`/images/seniority/usersImg/${userForm.img}`} alt="" width={"128px"}
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
                                        Sube tu imagen de perfil para que más amigos puedan encontrarte.
                                    </div>
                                </div>
                                <button className='formButton btn btn-primary' onClick={submit}>Guardar cambios</button>
                                <p>{errorMsg}</p>
                            </form>
                        </div>
                    </div>
                </div >
            </div>

            <button className='btn btn-outline-secondary' onClick={() => setshowEdit(false)}> Cancelar</button>
        </div>
    )
}
