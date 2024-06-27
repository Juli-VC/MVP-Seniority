import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "./admin.scss"
import { ActAdmin } from './Actividades/ActAdmin'
import { EmpresasAdmin } from './Empresas/EmpresasAdmin'


export const Admin = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [catg, setCatg] = useState([]);
  const [allUsersCompany, setAllUsersCompany] = useState([])
  const [showComponent, setShowComponent] = useState(1)
  const [focus, setFocus] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  const click = (number) => {
    setShowComponent(number);
    setFocus(number);
  }


  useEffect(() => {
    axios
      .get('http://localhost:4000/admin/activitiesAdmin')
      .then((res) => {
        setAllActivities(res.data);

        const categories = res.data.map((activity) => activity.category_name);
        const uniqueCategories = [...new Set(categories)];
        setCatg(uniqueCategories);

      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get('http://localhost:4000/admin/usersCompany')
      .then((res) => {
        setAllUsersCompany(res.data)
      })
      .catch((error) => {
        console.log(error);
      })


  }, [showComponent, isLoading]);


  return (
    <div className='adminpadre'>

      <div className='adminizq'>
        <div className='admincajita'>
          <a onClick={() => click(1)} className={focus === 1 ? 'selected-link' : 'aCajita'}>Datos empresa</a>
          <a onClick={() => click(2)} className={focus === 2 ? 'selected-link' : 'aCajita'}>Datos actividades</a>
          <a onClick={() => click(3)} className={focus === 3 ? 'selected-link' : 'aCajita'}>Datos profesionales</a>

        </div>
      </div>

      <div>
        {showComponent === 2 ? <ActAdmin allActivities={allActivities} setAllActivities={setAllActivities} catg={catg} setCatg={setCatg} setIsLoading={setIsLoading} isLoading={isLoading} /> : showComponent === 1 ? <EmpresasAdmin allUsersCompany={allUsersCompany} setAllUsersCompany={setAllUsersCompany} /> : showComponent === 3 && <div className='profesionales'></div>}


      </div>


    </div>
  )
}
