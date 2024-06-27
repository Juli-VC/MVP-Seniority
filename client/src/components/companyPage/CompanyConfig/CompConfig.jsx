import React, { useState } from 'react'




import "./CompConfig.scss"
import { DelAccButton } from '../../DelAccButton/DelAccButton';

export const CompConfig = ({company}) => {

    const [showConfirmacion, setShowConfirmacion] = useState(false);

    let {user_id} = company;


  return (
    <>
        <div>
            <div className='row'>
                <div className='col-2'>
                   <p>Correo</p> 
                </div>
            </div>
            <div className='row'>
                <div className='recuadrado'>
                    <p>{company.email}</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-2'>
                   <p>Contraseña</p> 
                </div>
            </div>
            <div className='row'>
                <div className='recuadrado'>
                    <p>************</p>
                </div>
            </div>
            <br />


            <div className='cajaazul'>
                <img className='iconito' src="/images/seniority/icons/info.png" alt="" />
                <div>
                    <p className='pCaja'>Para solicitar cambios en el nombre de la empresa, el sitio web o la localización, escríbenos un correo a: info@seniority.com</p>
                </div>
            </div>

            <br /><br />

            { showConfirmacion === false ? 
            <div>
                <p>¿Quieres eliminar tu cuenta?</p>
                <button className='confirmar' 
                onClick={() => setShowConfirmacion(true)}>
                    Eliminar cuenta
                </button>
            </div>
                :
                <div className='paddinabajo'>
                    <br />
                    <p>¿Seguro que quieres eliminar tu cuenta?</p>
                    <DelAccButton 
                        user_id = {user_id}
                    />
                    <br /><br />
                    <button className='cancelar'
                    onClick={() => setShowConfirmacion(false)}>Cancelar</button>
                </div>

            }
            
            

            
        </div>

    </>
  )
}
