import React, { useState } from 'react';
import "./actadmin.scss";
import { Card } from 'react-bootstrap';
import axios from 'axios';

export const ActAdmin = ({ catg, allActivities, isLoading, setIsLoading }) => {
  const [openSelect, setOpenSelect] = useState({});
  const [isApproved, setIsApproved] = useState({});

  const toggleSelect = (activityId, categoryId) => {
    setOpenSelect(prevOpenSelect => ({
      ...prevOpenSelect,
      [`${activityId}_${categoryId}`]: !prevOpenSelect[`${activityId}_${categoryId}`]
    }));
  };



  const setApproved = (id, num) => {

    axios
      .put(`http://localhost:4000/admin/disableAct/${id}`, { approved: num })
      .then((res) => {
        setIsApproved(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
    setIsLoading(!isLoading)
  }

  return (
    <div className='container allActivities2 p-0'>
      {catg?.map((elem, index) => {
        const filteredActivities = allActivities.filter(acti => acti.category_name === elem);
        return (
          <div key={index} className="row categories">
            <div className='col-12 p-0'>
              <div className="colCard">
                {filteredActivities.map((acti, index) => {
                  const finalprice = acti.price - parseFloat(acti.price * acti.discount / 100).toFixed(2);
                  const selectId = `${acti.activity_id}_${acti.category_id}`;
                  const isOpen = openSelect[selectId];

                  return (
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xxl-3 p-0" key={index}>
                      <Card>
                        <div className="card-header p-0">
                          <Card.Img
                            variant='top'
                            src='/images/seniority/PlayVideoIMG/video1.png'
                            maxWidth={'280px'}
                            height={'157.5px'}
                          />
                        </div>
                        <Card.Body>
                          <div className="cardBody_inside">
                            <Card.Title>{acti.title}</Card.Title>
                            <Card.Text>
                              <p>
                                Un curso con <span className="black">{acti.name}</span>
                              </p>
                              <p className="date">{acti.week_day} - {acti.start_date?.toLocaleString("medium")}</p>
                              <p className="time">{!acti.end_hour ? acti.start_hour : acti.start_hour + " - " + acti.end_hour}</p>
                              <p className="places">{acti.city_name}, {acti.province_name}</p>

                              <div className='approved'>
                                {acti.approved === 0 ? (
                                  <>
                                    <img src="/images/seniority/icons/publicada.png" alt="" width={"25px"} />
                                    <p><b>Pendiente</b></p>
                                  </>
                                ) : acti.approved === 1 ? (
                                  <>
                                    <img src="/images/seniority/icons/publicada.png" alt="" width={"25px"} />
                                    <p><b>Publicada</b></p>
                                  </>
                                ) : (
                                  <>
                                    <img src="/images/seniority/icons/nopublicada.png" alt="" />
                                    <p><b>No publicada</b></p>
                                  </>
                                )}

                                <div className='trespuntitos' onClick={() => toggleSelect(acti.activity_id, acti.category_id)}>
                                  <div>
                                    <span className="material-symbols-outlined">
                                      more_horiz
                                    </span>
                                  </div>
                                  <div className={`menu ${isOpen ? '' : 'hide'}`}>
                                    <div onClick={() => setApproved(acti.activity_id, 1)}><img src="/images/seniority/icons/publicada.png" alt="" width={"10px"} /> <a >Publicar</a></div>
                                    <div onClick={() => setApproved(acti.activity_id, 2)}><img src="/images/seniority/icons/nopublicada.png" alt="" width={"10px"} /> <a >No publicar</a></div>
                                    <div onClick={() => setApproved(acti.activity_id, 0)}><img src="/images/seniority/icons/publicada.png" alt="" width={"10px"} /> <a >Pendiente</a></div>
                                  </div>
                                </div>
                              </div>
                            </Card.Text>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
