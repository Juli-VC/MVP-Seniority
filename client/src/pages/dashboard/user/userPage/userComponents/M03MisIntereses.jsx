import axios from 'axios'
import React, { useEffect, useState } from 'react'
import m03MisIntereses from "./m03MisIntereses.scss"
import { useNavigate } from 'react-router-dom'
export const M03MisIntereses = ({ user_id, setshowMenuOptions }) => {
    const [seniorInterests, setseniorInterests] = useState([])
    const [categorias, setcategorias] = useState()
    const [categoriForm, setcategoriForm] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:4000/users/seniorInterests/${user_id}`)
            .then((res) => {
                setseniorInterests(res.data)

            })
            .catch((err) => {
                return (console.log(err))
            })

        axios
            .get("http://localhost:4000/")
            .then((res) => {
                setcategorias(res.data)
            })
            .catch((err) => {
                console.log("err", err)
            })
    }, [categoriForm])

    const click = (category_id) => {
        setcategoriForm([...categoriForm, category_id])

    }
    const handleDelete = (category_id) => {
        axios
            .delete(`http://localhost:4000/users/user/${user_id}/${category_id}`)
            .then((res) => {
                setshowMenuOptions(3)
                navigate(`/users/user/${user_id}`)
            })
            .catch((err) => {
                console.log("delete err", err)
            })
    };
    const handleAdd = (category_id) => {
        axios
            .post(`http://localhost:4000/users/user/${user_id}/${category_id}`)
            .then((res) => {
                setshowMenuOptions(3)
                navigate(`/users/user/${user_id}`)
            })
            .catch((err) => {
                console.log("delete err", err)
            })
    };
    console.log("catefiform", categoriForm);
    return (
        <div className='container misIntereses ' >
            <div className="row ">
                <div className="col-12 my-3">
                    <h3>Mis Intereses</h3>
                </div>
            </div>
            <div className="row">
                {seniorInterests && seniorInterests.map((interes, index) => {
                    return (
                        <div className="col text-center selectedCat" key={index}>
                            <img src={`/images/seniority/categoriesIMG/${interes.category_img}`} alt="" />
                            <p className='blue'>{interes.category_name}</p>
                        </div>
                    )
                })
                }
            </div>

            <div className="form3 my-5">
                <div className="">
                    <h2>Edita tus intereses: ¿Qué tipo de actividades te gustan? </h2>
                    <p>Selecciona al menos 2 opciones</p>
                    <div className='galeria'>
                        <div className="row justify-content-center ">
                            {categorias?.map((elem, index) => {
                                const isSelected = categoriForm.includes(elem.category_id);
                                const isAdded = seniorInterests.some((interes) => interes.category_id === elem.category_id);
                                return (
                                    <div className="col fotoCategory align-items-center text-center" key={index} onClick={() => click(elem.category_id)}>
                                        <img
                                            src={`/images/seniority/categoriesIMG/${elem.category_img}`}
                                            alt=""
                                            height={'80px'}
                                            width={'80px'}
                                        />
                                        <p>{elem.category_name}</p>
                                        {isAdded ? (
                                            <div className="botones">
                                                {/* <button className="btn btn-primary" disabled>
                                                    Añadir
                                                </button> */}
                                                <button className="btn btn-danger" onClick={() => handleDelete(elem.category_id)} >
                                                    Eliminar
                                                </button>
                                            </div>

                                        ) : (
                                            <div className="botones">
                                                <button className="btn btn-primary" onClick={() => handleAdd(elem.category_id)}>
                                                    Añadir
                                                </button>
                                                {/* <button className="btn btn-danger" disabled >
                                                    Eliminar
                                                </button> */}
                                            </div>

                                        )}
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

