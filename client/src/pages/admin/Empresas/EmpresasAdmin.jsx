import React, { useState } from 'react'
import "./empresasadmin.scss"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

export const EmpresasAdmin = ({ allUsersCompany, setAllUsersCompany }) => {


  const habilitar = (id, del) => {
    // asumimos que al clicar queremos cambiar a lo contrario
    const status = del === 0 ? 1 : 0;

    axios
      .put(`http://localhost:4000/admin/disableUserCompany/${id}`, { user_is_deleted: status })
      .then((res) => {
        setAllUsersCompany(res.data);
      })
      .catch((error) => {
        console.log(error);
      })

  }

  return (
    <div className='empresaadmin'>
      {allUsersCompany?.map((elem, index) => {
        return (
          <Card style={{ width: '18rem' }} key={index} className='cardd'>
            <Card.Img variant="top" src="/images/seniority/PlayVideoIMG/video1.png" className='imgCard' />
            <Card.Body className='bbody'>
              <div className='title'><Card.Title> <b>{elem.name}</b>  </Card.Title></div>

              <Card.Text>• {elem.email}</Card.Text>
              <Card.Text>• {elem.website}</Card.Text>
              <Card.Text>• {elem.phone}</Card.Text>
              <Card.Text>• {elem.user_creation_date}</Card.Text>
              <Card.Text>• {elem?.city_name}, {elem?.province_name}</Card.Text>
              <Card.Text className='servicios'>• {elem.services}</Card.Text>

              <div className='publicar'>
                {elem.user_is_deleted === 0 ?
                  <>
                    <img src="/images/seniority/icons/publicada.png" alt="" width={"20px"} />
                    <b> <Card.Text>Publicada </Card.Text></b> </>
                  :
                  <>
                    <img src="/images/seniority/icons/nopublicada.png" alt="" width={"20px"} />
                    <b> <Card.Text> Borrada </Card.Text></b> </>}
                <button variant="primary" onClick={() => habilitar(elem.user_id, elem.user_is_deleted)}>{elem.user_is_deleted === 0 ? "Borrar" : "Publicar"}</button>

              </div>
            </Card.Body>
          </Card>
        )
      })

      }

    </div>
  )
}
