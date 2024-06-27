import React, { useEffect, useState } from 'react'
import './userpublic.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export const UserPublic = () => {
  const [userPublic, setUserPublic] = useState([])

  const { user_id, activity_id } = useParams();




  useEffect(() => {
    axios
      .get(`http://localhost:4000/users/company/${user_id}/${activity_id}/public`)
      .then((res) => {
        setUserPublic(res.data)
      }).catch((error) => console.log(error))

  }, [])


  return (
    <><div className='public-padre'>
      {userPublic && userPublic.map((res, index) => {
        return (
          <div class="row row-cols-2 g-3">
            <div class="col">
              <div class="card mb-3 card-grande" >
                <div class="row g-3">
                  <div class="col-md-4">
                    <img
                      src={`/images/seniority/usersIMG/${res.img}`}
                      alt="Trendy Pants and Shoes"
                      class="img-fluid rounded-start"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title"><b>{res.name} {res.lastname}</b>  </h5>
                      <p class="card-text">
                        {res.city_name}, {res.province_name}
                      </p>
                      <p class="card-text">
                        <small class="text-muted">{res.email}</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        )
      })}
    </div>
    </>
  )

}
