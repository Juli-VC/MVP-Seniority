const connection = require("../config/db.js");

class activitiesController {
  // 1. Vista de todas las actividades
  getAllActivities = (req, res) => {
    const province_id = req.headers.authorization;

    let sql = "";
    if (
      province_id !== "" &&
      province_id !== null &&
      province_id !== undefined
    ) {
      sql = `SELECT *
      FROM (
          SELECT c.category_id, c.category_name, a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
              (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
              (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes,
              ROW_NUMBER() OVER (PARTITION BY c.category_id ORDER BY a.activity_creation_date DESC) AS rn
          FROM category c
          JOIN activity_category ac ON c.category_id = ac.category_id
          JOIN activity a ON ac.activity_id = a.activity_id
          JOIN file f ON a.activity_id = f.activity_id
          JOIN city ci ON a.city_id = ci.city_id
          JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
          JOIN user u ON a.user_id = u.user_id
          
          
    ) AS subquery
      WHERE rn <= 4 
      AND activity_is_deleted = 0 
      AND approved = 1
      AND start_date > CURDATE()
      ORDER BY category_id, province_id = ${province_id} DESC, start_date ASC;

      `;
    } else {
      sql = `SELECT *
      FROM (
          SELECT c.category_id, c.category_name, a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
              (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
              (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes,
              ROW_NUMBER() OVER (PARTITION BY c.category_id ORDER BY a.activity_creation_date DESC) AS rn
          FROM category c
          JOIN activity_category ac ON c.category_id = ac.category_id
          JOIN activity a ON ac.activity_id = a.activity_id
          JOIN file f ON a.activity_id = f.activity_id
          JOIN city ci ON a.city_id = ci.city_id
          JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
          JOIN user u ON a.user_id = u.user_id
    ) AS subquery
      WHERE rn <= 4
       AND activity_is_deleted = 0
       AND approved = 1
       AND start_date > CURDATE()
      ORDER BY category_id, start_date ASC;

  `;
    }

    connection.query(sql, (error, resultAllActivities) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultAllActivities);
    });
  };

  // 2. Mostrar las actividades por categoría
  getCategoryAct = (req, res) => {
    let category_id = req.params.category_id;
    let sql = `SELECT category.*, activity.*, file.file_name, user.name, city.city_name, province.name as province_name,
    (SELECT COUNT(reservation.reservation_id) FROM reservation WHERE reservation.activity_id = activity.activity_id AND reservation.reservation_is_deleted = 0) as asistentes,
    (SELECT COUNT(activity_comment.thumb_up) FROM activity_comment WHERE activity_comment.activity_id = activity.activity_id) as likes
    FROM category
    JOIN activity_category ON category.category_id = activity_category.category_id
    JOIN activity ON activity_category.activity_id = activity.activity_id
    JOIN file ON activity.activity_id = file.activity_id
    JOIN city ON activity.city_id = city.city_id
    JOIN province ON activity.province_id = province.province_id AND province.province_id = city.province_id
    JOIN user ON activity.user_id = user.user_id
    WHERE category.category_id = ${category_id} AND activity_is_deleted = 0
    AND approved = 1
    AND start_date > CURDATE()
    ORDER BY activity.start_date ASC
    `;

    connection.query(sql, (error, resultCategory) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCategory);
    });
  };

  // 3. Mostrar una actividad
  getOneActivity = (req, res) => {
    let activity_id = req.params.activity_id;

    let sqlPpal = `SELECT category.*, activity.*, file.file_name, user.name, user.services, (SELECT sum(activity_comment.thumb_up) from activity_comment WHERE user.user_id = activity.user_id ) as company_likes,
    city.city_name, province.name as province_name,
      (SELECT COUNT(reservation.reservation_id) FROM reservation WHERE reservation.activity_id = activity.activity_id AND reservation.reservation_is_deleted = 0) as asistentes,
      (SELECT sum(activity_comment.thumb_up) FROM activity_comment WHERE activity_comment.activity_id = activity.activity_id) as likes
      FROM category
      JOIN activity_category ON category.category_id = activity_category.category_id
      JOIN activity ON activity_category.activity_id = activity.activity_id
      JOIN file ON activity.activity_id = file.activity_id
      JOIN city ON activity.city_id = city.city_id
      JOIN province ON activity.province_id = province.province_id AND province.province_id = city.province_id
      JOIN user ON activity.user_id = user.user_id

      WHERE activity.activity_id = ${activity_id}

      ORDER BY activity.activity_creation_date DESC
      `;

    let sqlProf = `SELECT professional.*
      from professional
      JOIN professional_activity ON professional.professional_id = professional_activity.professional_id
      WHERE professional_activity.activity_id = ${activity_id}`;

    let sqlComments = `SELECT user.name, user.img, activity_comment.text, activity_comment.activity_comment_date, activity_comment.thumb_up
      from activity_comment
        JOIN user ON user.user_id = activity_comment.user_id
        WHERE activity_comment.activity_id = ${activity_id}`;

    let sqlCategories = `SELECT activity_category.category_id, category.category_name
     from activity_category
     join category on category.category_id = activity_category.category_id
     WHERE activity_id = ${activity_id};`;

    let sqlActAleatorias = `SELECT *
    FROM (
        SELECT c.category_id, c.category_name, a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
            (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
            (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes
        FROM category c
        JOIN activity_category ac ON c.category_id = ac.category_id
        JOIN activity a ON ac.activity_id = a.activity_id
        JOIN file f ON a.activity_id = f.activity_id
        JOIN city ci ON a.city_id = ci.city_id
        JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
        JOIN user u ON a.user_id = u.user_id
        WHERE a.activity_is_deleted = 0
            AND a.approved = 1
            AND a.start_date > CURDATE()
            AND a.activity_id <> ${activity_id} 
        ORDER BY RAND()
        LIMIT 4
    ) AS subquery
    ORDER BY category_id, start_date ASC;
    `;

    connection.query(sqlPpal, (error, resultActivity) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        connection.query(sqlProf, (error, resultProf) => {
          if (error) {
            res.status(400).json({ error });
          } else {
            connection.query(sqlComments, (error, resultComments) => {
              if (error) {
                res.status(400).json({ error });
              } else {
                connection.query(sqlCategories, (error, resultCategories) => {
                  if (error) {
                    res.status(400).json({ error });
                  } else {
                    connection.query(
                      sqlActAleatorias,
                      (error, resultActAleatorias) => {
                        if (error) {
                          res.status(400).json({ error });
                        } else {
                          res.status(200).json({
                            resultActivity,
                            resultProf,
                            resultComments,
                            resultCategories,
                            resultActAleatorias,
                          });
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  //4. crear Activity
  createActivity = async (req, res) => {
    const user_id = req.params.user_id;
    const {
      title,
      activity_address,
      city_id,
      province_id,
      phone,
      description,
      min_group,
      max_group,
      difficulty,
      start_date,
      end_date,
      start_hour,
      end_hour,
      week_day,
      language,
      items,
      include,
      price,
      accesibility,
      duration,
      professional_id,
      selectedCategories,
    } = JSON.parse(req.body.finalformActivity);

    let categorias = JSON.parse(selectedCategories);

    let sql_createActivity = `INSERT INTO activity (
      title, activity_address, city_id, province_id, 
      phone, description, min_group, max_group, difficulty, start_date, end_date, start_hour, end_hour, week_day, language, items, include, price, accesibility, duration, user_id) VALUES (
        '${title}', '${activity_address}', '${city_id}','${province_id}', 
        '${phone}', '${description}', '${min_group}', '${max_group}', '${difficulty}', '${start_date}','${end_date}', '${start_hour}','${end_hour}', '${week_day}', '${language}','${items}', 
        '${include}', '${price}', '${accesibility}', 
        '${duration}', ${user_id})`;

    let img = "defaultvideo.png";

    if (req.file != undefined) {
      img = req.file.filename;
    }

    try {
      const resultCreateActivity = await new Promise((resolve, reject) => {
        connection.query(sql_createActivity, (error, result) => {
          if (error) {
            reject(error);
            res.status(400).json(error);
          } else {
            resolve(result);
          }
        });
      });
      if (resultCreateActivity && "insertId" in resultCreateActivity) {
        // Resto del código...
        let activity_id = resultCreateActivity.insertId;
        let sql = `INSERT INTO professional_activity VALUES (${professional_id}, ${activity_id})`;
        let sqlFile = `INSERT INTO file (file_name, activity_id) VALUES ('${img}', ${activity_id})`;

        connection.query(sql, (error, resultOneUser) => {
          if (error) res.status(400).json(error);

          let sql_acti_categ = `INSERT INTO activity_category VALUES`;

          categorias.forEach((cat) => {
            sql_acti_categ += `(${activity_id}, ${cat.category_id}),`;
          });
          let sqlfinal = sql_acti_categ.slice(0, -1);

          connection.query(sqlfinal, (error, resultProffCateg) => {
            if (error) res.status(400).json(error);

            connection.query(sqlFile, (error, resultFILES) => {
              if (error) res.status(400).json(error);

              res.status(200).json(resultCreateActivity);
            });
          });
        });
      } else {
        res.status(400).json(error);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };
  // 5. Vista de las actividades destadas

  getHighlightedActivities = (req, res) => {
    let sql = `SELECT activity.*, file.file_name, user.name, city.city_name, province.name as province_name,
    (select count(reservation.reservation_id) from reservation 
      where reservation.activity_id = activity.activity_id AND reservation.reservation_is_deleted = 0) as asistentes,
      (select count(activity_comment.thumb_up) from activity_comment 
      where activity_comment.activity_id = activity.activity_id) as likes     
    FROM activity, file, city, province, user
    WHERE activity.activity_id = file.activity_id 
      AND activity.city_id = city.city_id 
      AND activity.province_id = city.province_id 
      AND activity.province_id = province.province_id 
      AND province.province_id = city.province_id
      AND activity.user_id = user.user_id     
      AND activity.start_date >= curdate()
      AND activity.activity_is_deleted = 0
      AND activity.approved = 1
      ORDER BY activity_creation_date asc LIMIT 4`;

    connection.query(sql, (error, resultHighlightedActivities) => {
      error
        ? res.status(400).json(error)
        : res.status(200).json(resultHighlightedActivities);
    });
  };

  // 6. Filtro busqueda actividades

  getFilterActivity = (req, res) => {
    const authoriString = req.headers.authorization;
    const { query, categoryFilt } = JSON.parse(authoriString);
    let selectedCategories = "";
    if (categoryFilt) {
      selectedCategories = categoryFilt;
    }

    let sqlFilter = `SELECT *
      FROM activity
      WHERE (title LIKE '${query}'
        OR description LIKE '${query}'
        OR activity_address LIKE '${query}'
        OR city_id IN (
          SELECT city_id
          FROM city
          WHERE city_name LIKE '${query}'
        )
        OR province_id IN (
          SELECT province_id
          FROM province
          WHERE name LIKE '${query}'
        )) `;

    if (selectedCategories) {
      sqlFilter += ` AND activity_id IN (
          SELECT ac.activity_id
          FROM activity_category ac
          JOIN category c ON ac.category_id = c.category_id
          WHERE c.category_id IN (${selectedCategories})
        ) AND activity.start_date >= curdate()
        `;
    }
    if (!query && selectedCategories) {
      sqlFilter = `SELECT category.*, activity.*, file.file_name, user.name, city.city_name, province.name as province_name,
    (SELECT COUNT(reservation.reservation_id) FROM reservation WHERE reservation.activity_id = activity.activity_id AND reservation.reservation_is_deleted = 0) as asistentes,
    (SELECT COUNT(activity_comment.thumb_up) FROM activity_comment WHERE activity_comment.activity_id = activity.activity_id) as likes
    FROM category
    JOIN activity_category ON category.category_id = activity_category.category_id
    JOIN activity ON activity_category.activity_id = activity.activity_id
    JOIN file ON activity.activity_id = file.activity_id
    JOIN city ON activity.city_id = city.city_id
    JOIN province ON activity.province_id = province.province_id AND province.province_id = city.province_id
    JOIN user ON activity.user_id = user.user_id
    WHERE category.category_id = ${selectedCategories} 
    AND activity.start_date >= curdate()
    AND activity.activity_is_deleted = 0
    AND activity.approved = 1
    ORDER BY activity.start_date ASC`;
    } else {
      sqlFilter += ` AND activity.start_date >= curdate()
        AND activity.activity_is_deleted = 0
        AND activity.approved = 1
      ORDER BY activity.start_date ASC`;
    }

    connection.query(sqlFilter, (error, resultFilter) => {
      error ? res.status(400).json(error) : res.status(200).json(resultFilter);
    });
  };

  addProfessional = (req, res) => {
    const { professional_id, activity_id } = req.body;

    let sql = `INSERT INTO professional_activity ('professional_id', 'activity_id') VALUES (${professional_id},${activity_id} )`;

    connection.query(sql, (error, resultOneUser) => {
      if (error) throw error;
      res.status(200).json(resultOneUser);
    });
  };

  // 7. Vista de categorias
  getCategories = (req, res) => {
    const { category_name } = req.params;

    let sql = `SELECT *
    FROM (
        SELECT c.category_id, c.category_name, a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
            (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
            (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes,
            ROW_NUMBER() OVER (PARTITION BY c.category_id ORDER BY a.activity_creation_date DESC) AS rn
        FROM category c
        JOIN activity_category ac ON c.category_id = ac.category_id
        JOIN activity a ON ac.activity_id = a.activity_id
        JOIN file f ON a.activity_id = f.activity_id
        JOIN city ci ON a.city_id = ci.city_id
        JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
        JOIN user u ON a.user_id = u.user_id
    ) AS subquery
    WHERE rn <= 4
    AND activity_is_deleted = 0
    AND approved = 1
    AND start_date > CURDATE()
    AND category_name = '${category_name}'
    ORDER BY category_id, start_date ASC;
    `;

    connection.query(sql, (error, resultCategories) => {
      error
        ? res.status(400).json(error)
        : res.status(200).json(resultCategories);
    });
  };
  //4. crear Activity
  editACtivity = async (req, res) => {
    const activity_id = req.params.activity_id;

    const {
      title,
      activity_address,
      city_id,
      province_id,
      phone,
      description,
      min_group,
      max_group,
      difficulty,
      start_date,
      end_date,
      start_hour,
      end_hour,
      week_day,
      language,
      items,
      include,
      price,
      accesibility,
      duration,
      professional_id,
      file_name,
      selectedCategories,
    } = JSON.parse(req.body.finalformActivity);

    let categorias = JSON.parse(selectedCategories);
    const formattedStartDate = new Date(start_date).toISOString().split("T")[0];
    const formattedEndDate = new Date(end_date).toISOString().split("T")[0];
    let sql_createActivity = `UPDATE  activity SET title = '${title}', activity_address = '${activity_address}' , city_id = '${city_id}' , province_id = '${province_id}', phone = '${phone}', description = '${description}', min_group = '${min_group}', max_group = '${max_group}', difficulty = '${difficulty}', start_date = '${formattedStartDate}', end_date = '${formattedEndDate}', start_hour = '${start_hour}', end_hour = '${end_hour}', week_day = '${week_day}', language = '${language}', items = '${items}', include = '${include}', price = '${price}', accesibility = '${accesibility}', duration = '${duration}' WHERE activity_id = ${activity_id}`;
    try {
      const resulteditActivity = await new Promise((resolve, reject) => {
        connection.query(sql_createActivity, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
      if (resulteditActivity) {
        let sqlDeleteProf = `DELETE FROM professional_activity WHERE activity_id = ${activity_id}`;
        let sql_insertProf = `INSERT INTO professional_activity VALUES (${professional_id}, ${activity_id})`;
        connection.query(sqlDeleteProf, (error, resultDelete) => {
          if (error) {
          } else {
            let sqlDeleteCategories = `DELETE FROM activity_category WHERE activity_id = ${activity_id}`;
            connection.query(
              sqlDeleteCategories,
              (error, resultDeleteCategories) => {
                if (error) {
                } else {
                  connection.query(sql_insertProf, (error, resultInsert) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Inserción exitosa");
                    }

                    let sql_acti_categ = `INSERT INTO activity_category VALUES`;
                    categorias.forEach((cat) => {
                      sql_acti_categ += `(${activity_id}, ${cat.category_id}),`;
                    });
                    let sqlfinal = sql_acti_categ.slice(0, -1);

                    connection.query(sqlfinal, (error, resultProffCateg) => {
                      if (error) res.status(400).json({ error });

                      let img = file_name;

                      if (req.file) {
                        img = req.file.filename;
                      }
                      let sqlEditPhoto = `UPDATE file SET file_name= '${img}' WHERE activity_id = ${activity_id}`;
                      connection.query(
                        sqlEditPhoto,
                        (error, resulteditphoto) => {
                          if (error) res.status(400).json(error);

                          res.status(200).json(resulteditActivity);
                        }
                      );
                    });
                  });
                }
              }
            );
          }
        });
      } else {
        res.status(400).json(error);
      }
    } catch (error) {
      res.status(400).json(error);
    }
  };
}
module.exports = new activitiesController();
