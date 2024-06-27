import { OneActivity1 } from './oneActivity1/OneActivity1';
import './activity.scss';
import { OneActivity2 } from './oneActivity2/OneActivity2';
import { OneActivity3 } from './oneActivity3/OneActivity3';
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { OneActivity4 } from './oneActivity4/OneActivity4';



export const Activity = () => {

  const { activity_id } = useParams();
  const [resultActivity, setResultActivity] = useState();
  const [resultComments, setResultComments] = useState();
  const [resultProf, setResultProf] = useState();
  const [resultCategories, setResultCategories] = useState([]);
  const [resultActAleatorias, setResultActAleatorias] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios

      .get(`http://localhost:4000/activities/oneActivity/${activity_id}`)

      .then((res) => {
        setResultActivity(res.data?.resultActivity[0]);
        setResultComments(res.data?.resultComments);
        setResultProf(res.data?.resultProf[0]);
        setResultCategories(res.data?.resultCategories)
        setResultActAleatorias(res.data?.resultActAleatorias)
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <div className='actContainer'>
      <div className='migas'>

        <nav aria-label="breadcrumb" className=''>
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" onClick={() => navigate('/')}><a >Inicio</a></li>
            <li className="breadcrumb-item active" aria-current="page" onClick={() => navigate('/activities')}><a >Actividades</a></li>
            <li className="breadcrumb-item active descrip" aria-current="page" ><a >{resultActivity?.description}</a></li>
          </ol>
        </nav>


      </div>
      <div className='actrow'>

        <div className='actizq'>
          <OneActivity1 resultActivity={resultActivity} resultComments={resultComments} resultProf={resultProf} resultCategories={resultCategories} />

          <OneActivity2 resultActivity={resultActivity} resultComments={resultComments} resultProf={resultProf} />
        </div>

        <div className='actdch'>
          <OneActivity3 resultActivity={resultActivity} />

        </div>


      </div>
      <div>
        <OneActivity4 resultActAleatorias={resultActAleatorias} />
      </div>
    </div>
  )
}
