import './oneActivity1.scss'



export const OneActivity1 = ({resultActivity, resultProf, resultCategories}) => {
    
   


let dificultad = "";

if(resultActivity?.difficulty === 1) {
    dificultad = "Dificultad Baja"
} else if(resultActivity?.difficulty === 2){
    dificultad = "Dificultad Media"
} else if(resultActivity?.difficulty === 3){
    dificultad = "Dificultad Alta"
}

  return (
    <>
   
    
        <div className='primeraParte '>
    

    <div className=' '>
        {/* tags */}
        <section className='d-flex   gap-1 '>
            <div className='nuevo'>Nuevo</div>
            {resultCategories && resultCategories.map((cat, index) =>{
                return(
                    <div className='categ'>{cat.category_name}</div>
                )
            })}
            
        </section>
              {/* titulo actividad    */}
        <div className='titulo'>
            <h1><b> {resultActivity?.title}</b></h1>
        </div>
        {/*fecha, dificultad, empresa  */}
        <div className='d-flex fecha  '>
            <div className='d-flex gap-2'> 
        <img src="/images/seniority/icons/calendar_today.png" alt="" width={"18px"} height={"20px"} /> 
         <p>{resultActivity?.week_day} </p>
         </div>
        
         < div> |</ div>
         <div className='d-flex gap-2'>
            <img src="/images/seniority/icons/account_box.png" alt="" width={"18px"} height={"20px"} /> 
         <p>{resultActivity?.name} </p>
         </div>
         
         < div> |</ div>
         <div className='d-flex gap-2'> <img src="/images/seniority/icons/ecg_heart.png" alt="" width={"18px"} height={"20px"} /> 
         <p>{dificultad} </p>
         </div>
        
        </div>

        {/* Video o imagen   */}
        <div className='  imagen'>
            <img src="/images/seniority/PlayVideoIMG/videoAntiguo.png" alt="" width={"100%"} height={"382px"}/>
        </div>
          {/* asistentes */}
         <div className='  asistentes'>
            <img src="/images/seniority/icons/monigote.png" alt="" height={"20px"}/>
            <p>{resultActivity?.min_group} - {resultActivity?.max_group} personas</p>
            <img src="/images/seniority/icons/person.png" alt="" height={"18px"}/>
            <p>{resultActivity?.asistentes} asistentes</p>
         </div>

          {/* titulo actividad    */}
        <div className='titulo'>
            <h3><b> {resultActivity?.title}</b></h3>
        </div>

        {/* datos y descripción */}
        <div className='datos'>
        <p><b>Una visita guiada por</b> {resultProf?.professional_name}, <b>{resultActivity?.name}</b> </p>
        <p><b>Lugar:</b>  {resultActivity?.activity_address}, {resultActivity?.province_name}</p>
        <p className='desc'>{resultActivity?.description}</p>
        </div>

            {/* Información adicional */}
        <div className=' info'>
            <h5>Información adicional</h5>
            <div className=' infoAdd'>
        <div className='d-flex iconosInfo'>
          
        <img src="/images/seniority/icons/idioma.png" alt="" />
         
            <div>
                <p className='titulo-adic'>Idioma</p>
                <p>{resultActivity?.language}</p>
            </div>
        </div>
        <div className='d-flex iconosInfo'>
        <img src="/images/seniority/icons/reloj.png" alt="" />
            <div>
                <p className='titulo-adic'>Duración</p>
                <p>{resultActivity?.duration} horas aproximadamente</p>
            </ div>
        </div>
        <div className='d-flex iconosInfo'>
        <img src="/images/seniority/icons/accesibilidad.png" alt="" />
            <div>
            <p className='titulo-adic'>Accesibilidad</p>
             <p> {resultActivity?.accesibility ? " Sí. Ascensores y/o rampas." : "No tiene ascensores o rampas"} </p>
            </ div>
        </div>
        </div>
        <div className='  infoAdd'>
        <div className='d-flex iconosInfo'>
        <img src="/images/seniority/icons/edit.png" alt="" />
            < div>
                <p className='titulo-adic'>Qué traer</p>
                <p>{resultActivity?.items}</p>
            </ div>
        </div>
        <div className='d-flex iconosInfo'>
        <img src="/images/seniority/icons/check.png" alt="" />
            < div>
                <p className='titulo-adic'>Incluido</p>
                <p>{resultActivity?.include}</p>
            </ div>
        </div>
        <div className='d-flex iconosInfo'>
        <img src="/images/seniority/icons/dollar.png" alt="" />
            < div>
                <p className='titulo-adic'>Pago</p>
                <p>Pago en efectivo o a través de la web</p>
            </ div>
        </div>
        </div>
        </div>
    </div>
   {/* Mapa */}
    <div>
    <h5>Mapa de la zona</h5>
    <img src="/images/seniority/PlayVideoIMG/map.png" alt=""  width={"100%"}/>
    </div>
    </div>
    

</>
  )
}
