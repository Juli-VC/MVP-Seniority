import React from 'react'
import "./oneactivity2.scss"


export const OneActivity2 = ({resultActivity, resultComments, resultProf}) => {

 
  

  return (
    <div className=' act2'>
    {/* Info empresa y profesional */}
    <div className=' infoEmpresa'>
      {/* nombre empresa */}
    <div className='empresa '>
      <div className='nombre-empresa'>
        <h3> <b>{resultActivity?.name}</b> </h3>
        </div>
    {/* thumb up */}
    <div className='contador'>
    <img src="/images/seniority/icons/thumb.png" alt="" className='thumb' />
    <p>10</p>
    </div>
    </div>
    {/* descripción empresa */}
    <div className='services'>
     <p>{resultActivity?.services}</p> 
    </div>
    {/* boton saber más sobre la empresa */}
    <button className='boton-mas'>Saber más de la empresa</button>
    <hr />
    {/* info profesional */}
    <div className='profesional'>
      {/* foto profesional */}
    <div className='foto-prof'>
      <img src={`/images/seniority/profsIMG/${resultProf?.professional_img}`} alt="" />
    </div>
    {/* descripción profesional */}
    <div className='info-prof'>
    <h4> {resultProf?.professional_name}</h4>
    <h6>{resultProf?.professional_ocupation}</h6>
    <p className='desc'>{resultProf?.professional_description}</p>
    <a href=''> <u>Leer completo</u> </a>
    </div>
    </div>
    </div>
    {/* parte de los comentarios */}
    <div className='coments'>
    <div className='opinions'>
      <p>Opiniones sobre {resultActivity?.name}</p>
    </div>
   
    {/* todos los comentarios */}
    <div className='all-coments'>
      {resultComments?.map((coment, index) =>{
        return(
          <div className='div-coment'>
            <div><img src={`/images/seniority/usersIMG/${coment.img}`} alt="" /></div>
            
            <div className='info-coment'>
              <div className='fecha'>
              <p>{coment.activity_comment_date}</p>
              </div>
              <div className='desc-coment'> 
                <h3><b>{coment.name}</b> </h3>
                <p>{coment.text}</p>
              </div>
             
            </div>
         </div>
        )
      })}
    
    </div> 
    </div>
    </div>
  )
}
