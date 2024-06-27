import React from 'react'


import "./CompanyData.scss"

export const CompanyData = ({company}) => {
  return (
    <>
        <div className='empresainfo'>
            <div>
                <p className='textazul'>Sobre la empresa</p>
                <p className='texto'>{company.services}</p>
            </div>
            <div>
                <p className='textazul'>Sitio web</p>
                <p className='texto'>{company.website}</p>

            </div>
            <div>
                <p className='textazul'>Localización</p>
                <p className='texto'>{company.city_name} - {company.province_name}</p>
            </div>
            <div className='cajaazul'>
                <img className='iconito' src="/images/seniority/icons/info.png" alt="" />
                <div>
                    <p className='pCaja'>Para solicitar cambios en el nombre de la empresa, el sitio web o la localización, escríbenos un correo a: info@seniority.com</p>
                </div>
            </div>



        </div>
    
    
    </>
  )
}
