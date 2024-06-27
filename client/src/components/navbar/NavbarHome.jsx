import React from 'react'
import navbarHome from "./navbarHome.scss"
import { Button, Dropdown } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import { FilterDropdown } from './FilterDropdown/FilterDropdown'
import { LinksNavbars } from './LinksNavbars/LinksNavbars'

export const NavbarHome = ({ setshowMenuOptions }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container-fluid navbarHome">

        <div className="row links d-flex justify-content-center">
          <LinksNavbars setshowMenuOptions={setshowMenuOptions} />
        </div>

        <FilterDropdown />

      </div>
    </>
  )
}
