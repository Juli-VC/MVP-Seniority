import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';

import filterDropdown from "./filterDropdown.scss"

export const FilterDropdown = () => {
  const navigate = useNavigate();
  const [allcategories, setAllcategories] = useState();
  const initialValue = { compare: "" };
  const [searchForm, setsearchForm] = useState([initialValue]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const clear = () => {
    setsearchForm(initialValue)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setsearchForm({ ...searchForm, [name]: value })
  }

  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((res) => {
        setAllcategories(res.data);
      })
      .catch((error) => {
        console.log("Error en el axios", error);
      });

  }, [])

  const handleCheckboxChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSearch = () => {
    const categoryIds = selectedCategories.map((categoryId) => categoryId);

    navigate("/activities/filterActivity", {
      state: {
        query: searchForm.compare,
        categoryFilt: categoryIds.join(','),
      }
    })
  }

  return (
    <>
      <div className="row filterSearch my-2 ">

        <Dropdown className='col-12 col-md-2 col-lg-2   p-0'>
          <Dropdown.Toggle id="dropdown-basic">
            Filtrar por
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item disabled className='mb-3'>Categoria</Dropdown.Item>
            {
              allcategories && allcategories.map((elem, index) => {
                return (
                  <Dropdown.Item className='mb-3'
                    onClick={() => navigate()} key={index} >
                    <Form.Check
                      type="checkbox"
                      label={elem.category_name}
                      checked={selectedCategories.includes(elem.category_id)}
                      onChange={() => handleCheckboxChange(elem.category_id)}
                    />
                  </Dropdown.Item>
                )
              })
            }
          </Dropdown.Menu>
        </Dropdown>
        <Form className="col-12 col-md-6 col-lg-6 d-flex ">
          <Form.Control
            id='search'
            type="search"
            placeholder="Busca una actividad"
            name='compare'
            value={searchForm.compare}
            onChange={handleChange}
          />
        </Form>
        <div className='col-12 col-md-3 col-lg-3 d-flex my-2 my-sm-2'>
          <Button variant="outline-success" className='me-2' onClick={handleSearch}>Buscar</Button>
          <Button variant="outline-secondary" onClick={clear}>Borrar búsqueda</Button>
        </div>


      </div >
    </>
  )
}
