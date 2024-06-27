import React, { useEffect, useState } from 'react'
import jwtDecode from "jwt-decode";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/dashboard/home/Home'
import { About } from '../pages/dashboard/about/About'
import { Activity } from '../pages/dashboard/activities/activityPage/Activity'
import { AllActivities } from '../pages/dashboard/activities/AllActivities/AllActivities'
import { Contact } from '../pages/dashboard/Contact/Contact'
import { Login } from '../pages/auth/login/Login'
import { RegisterSenior } from '../pages/auth/register/RegisterSenior/RegisterSenior'
import { Error } from '../pages/dashboard/error/Error'
import { CreateActivity } from '../pages/dashboard/activities/CreateActivity/CreateActivity'
import { NavbarHome } from '../components/navbar/NavbarHome'

import { FooterHome } from '../components/footer/FooterHome'
import { UserPage } from '../pages/dashboard/user/userPage/UserPage'
import { CompanyPage } from '../pages/dashboard/user/CompanyPage/CompanyPage'
import { RegisterCompany } from '../pages/auth/register/RegisterCompany/RegisterCompany'

import { Admin } from '../pages/admin/Admin'
import { ActAdmin } from '../pages/admin/Actividades/ActAdmin'
import { EmpresasAdmin } from '../pages/admin/Empresas/EmpresasAdmin'

import { NavbarCompany } from '../components/navbarCompany/NavbarCompany'
import { NavbarAdmin } from '../components/navbarAdmin/NavbarAdmin'
import Payment from '../pages/dashboard/payment/Payment';
import { FilterActivity } from '../pages/dashboard/activities/FilterActivity/FilterActivity';
import { EditActivity } from '../pages/dashboard/activities/editActivity/EditActivity';
import { Categories } from '../pages/dashboard/activities/Categories/Categories';
import { UserPublic } from '../components/companyPage/UserPublic/UserPublic';



export const AppRoutes = () => {
  const [user_type, setuser_type] = useState()
  const [showMenuOptions, setshowMenuOptions] = useState(1)

  const [componente, setComponente] = useState(0)

  useEffect(() => {

    if (window.localStorage.getItem("token")) {
      setuser_type(jwtDecode(window.localStorage.getItem("token")).user.type);
    } else {
      setuser_type(0)
    }
  }, [user_type])

  return (
    <BrowserRouter >


      {window.localStorage.getItem("token") &&

        user_type === 2 ?
        <NavbarCompany setuser_type={setuser_type} setComponente={setComponente} />
        : user_type === 3 ?
          <NavbarAdmin setuser_type={setuser_type} user_type={user_type} />
          :
          <NavbarHome setshowMenuOptions={setshowMenuOptions} />

      }

      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        <Route path='/activities' element={<AllActivities />} />
        <Route path='/activities/AllActivities/categories/:category_name' element={<Categories />} />
        <Route path='/activities/:activity_id' element={<Activity />} />
        <Route path='/activities/CreateActivity' element={<CreateActivity />} />
        <Route path='/activities/filterActivity' element={<FilterActivity />} />
        <Route path='/activities/editActivity/:activity_id' element={<EditActivity setComponente={setComponente} />} />



        <Route path="/users/user/:user_id" element={<UserPage showMenuOptions={showMenuOptions} setshowMenuOptions={setshowMenuOptions} />} />
        <Route path="/users/company/:user_id" element={<CompanyPage setuser_type={setuser_type} componente={componente} setComponente={setComponente} />} />

        <Route path='/users/company/:user_id/:activity_id/public' element={<UserPublic />} />

        <Route path='/users/login' element={<Login setuser_type={setuser_type} />} />
        <Route path='/RegisterSenior' element={<RegisterSenior />} />
        <Route path='/RegisterCompany' element={<RegisterCompany />} />
        <Route path='*' element={<Error />} />

        <Route path='/admin' element={<Admin />} />
        <Route path='/adminact' element={<ActAdmin />} />
        <Route path='/adminempresas' element={<EmpresasAdmin />} />


        <Route path='/payment/:activity_id' element={<Payment />} />



      </Routes>
      <FooterHome />
    </BrowserRouter>

  )
}
