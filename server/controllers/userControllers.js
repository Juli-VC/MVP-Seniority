const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { main } = require("../config/nodemailer");
require("dotenv").config();

class userController {
  //1.Vista de un usuario
  getOneUser = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT * from user where user_id = ${user_id} and user_is_deleted = 0`;

    connection.query(sql, (error, resultOneUser) => {
      if (error) throw error;
      res.status(200).json(resultOneUser);
    });
  };

  //////////
  //2. Recogida de datos Senior
  createSenior = (req, res) => {
    const {
      name,
      lastname,
      address,
      province_id,
      city_id,
      phone,
      email,
      password,
    } = JSON.parse(req.body.userForm);

    let img = "avatar.png";
    if (req.file != undefined) {
      img = req.file.filename;
    }

    let categorias = JSON.parse(req.body.categories);

    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        let sql = `INSERT INTO user (name, lastname, address, province_id, city_id, phone, user_type, email, img, password) VALUES ('${name}', '${lastname}', '${address}', '${province_id}', '${city_id}', '${phone}', "1", '${email}', '${img}', '${hash}' )`;

        connection.query(sql, (error, resultSenior) => {
          if (error) {
            if (error.code == "ER_DUP_ENTRY") {
              return res.status(401).json({ errorMsg: "El email ya existe" });
            } else {
              // si es otro tipo de error
              return res.status(400).json(error);
            }
          }
          if (resultSenior) {
            const token = jwt.sign(
              {
                user: {
                  email: email,
                  name: name,
                  id: resultSenior.insertId,
                  type: 1,
                  img: img,
                  province_id: province_id,
                },
              },
              process.env.SECRET,
              { expiresIn: "10d" }
            );

            let sql_user_categ = `INSERT INTO user_category (user_id, category_id) VALUES `;

            categorias.forEach((cat) => {
              sql_user_categ += `(${resultSenior.insertId}, ${cat.category_id}),`;
            });
            let sqlfinal = sql_user_categ.slice(0, -1);

            connection.query(sqlfinal, (error, resultUserCats) => {
              if (error) res.status(400).json(error);

              res.status(200).json({ token, resultSenior, resultUserCats });
            });
          }
        });
      });
    });
  };

  ////////
  //3. Editar usuario Senior
  editSenior = (req, res) => {
    const user_id = req.params.user_id;

    const { name, lastname, address, province_id, city_id, phone } = JSON.parse(
      req.body.userForm
    );

    let saltRounds = 8;
    let img = JSON.parse(req.body.userForm).img;

    if (req.file) {
      img = req.file.filename;
    }

    let sql = `UPDATE  user SET name = "${name}", lastname = "${lastname}",
        province_id = "${province_id}", city_id = "${city_id}", img = "${img}",
        phone = "${phone}", address = "${address}" WHERE user_id = "${user_id}"`;

    connection.query(sql, (error, resultEditSenior) => {
      if (error) {
        if (error.code == "ER_DUP_ENTRY") {
          return res.status(401).json({ errorMsg: "El email ya existe" });
        } else {
          // si es otro tipo de error
          return res.status(400).json(error);
        }
      }
      if (resultEditSenior) {
        const token = jwt.sign(
          {
            user: {
              img: img,
              name: name,
              id: user_id,
              type: 1,
              province_id: province_id,
            },
          },
          process.env.SECRET,
          { expiresIn: "10d" }
        );
        res.status(200).json({ token, resultEditSenior });
      }
    });
  };

  //4. Eliminar un usario Senior de manera lógica
  deletedSenior = (req, res) => {
    let user_id = req.params.user_id;
    let sql = `UPDATE user SET user_is_deleted = 1 WHERE user_id = "${user_id}"`;
    connection.query(sql, (error, resultDeleted) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultDeleted);
    });
  };
  //5. Mostrar actividades según preferencia provincia
  getUserHomePage = (req, res) => {
    const province_id = req.headers.authorization;

    let sql = `SELECT a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
    (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
    (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes
    FROM activity a
    JOIN file f ON a.activity_id = f.activity_id
    JOIN city ci ON a.city_id = ci.city_id
    JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
    JOIN user u ON a.user_id = u.user_id
    WHERE start_date > CURDATE()
    ORDER BY p.province_id = ${province_id}  DESC, start_date ASC;`;

    connection.query(sql, (error, resultHomePage) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultHomePage);
    });
  };

  //7 Mostrar la vista de los intereses de cada usuario
  getInterests = (req, res) => {
    let user_id = req.params.user_id;
    let sql = `SELECT user_category.category_id, category.* 
               FROM user_category, category 
               WHERE user_category.category_id = category.category_id 
               AND user_id = ${user_id} AND category.category_is_deleted = 0`;
    connection.query(sql, (error, resultInterest) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultInterest);
    });
  };

  // 8. Login de usuario Senior
  loginSenior = (req, res) => {
    let { email, password } = req.body;

    let sql = `SELECT user_id, email, password, img, name, user_type, province_id FROM user WHERE email = '${email}' AND user_is_deleted = 0;`;

    connection.query(sql, (error, result) => {
      if (error) return res.status(400).json(error);

      if (!result || !result.length || result[0].is_deleted == 1) {
        res.status(401).json("Usuario no registrado");
      } else {
        const [user] = result;

        const hash = user.password;

        bcrypt.compare(password, hash, (error, response) => {
          if (error) return res.status(400).json(error);
          if (response === true) {
            const token = jwt.sign(
              {
                user: {
                  email: user.email,
                  name: user.name,
                  id: user.user_id,
                  type: user.user_type,
                  img: user.img,
                  province_id: user.province_id,
                },
              },
              process.env.SECRET,
              { expiresIn: "10d" }
            );
            res.status(200).json({ token, user: result[0] });
          } else {
            res.status(401).json("Usuario o contraseña incorrectos");
          }
        });
      }
    });
  };
  //////////
  //9. Registro de Empresas
  createCompany = (req, res) => {
    const {
      name,
      address,
      province_id,
      city_id,
      phone,
      email,
      password,
      website,
      services,
    } = req.body;
    let saltRounds = 8;
    bcrypt.genSalt(saltRounds, function (err, saltRounds) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        let sql = `INSERT INTO user (name, address, province_id, city_id, phone, user_type, email, password, website, services, user_is_deleted) VALUES ('${name}', '${address}', '${province_id}', '${city_id}', ${phone}, "2", '${email}', '${hash}', '${website}', '${services}', 1 )`;

        connection.query(sql, (error, resultCompany) => {
          if (error) {
            if (error.code == "ER_DUP_ENTRY") {
              return res.status(401).json({ errorMsg: "El email ya existe" });
            } else {
              // si es otro tipo de error
              return res.status(400).json(error);
            }
          }
          if (resultCompany) {
            const token = jwt.sign(
              {
                user: {
                  email: email,
                  name: name,
                  id: resultCompany.insertId,
                  type: 2,
                  province_id: province_id,
                },
              },
              process.env.SECRET,
              { expiresIn: "10d" }
            );
            res.status(200).json({ token, resultCompany });
          }
        });
      });
    });
  };

  // 10. Vista de la empresa
  viewCompany = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT u.user_id, u.name, u.address, c.city_name , p.name as province_name, u.email, u.img, u.password, u.website, u.services
    FROM user u
    JOIN province p ON p.province_id = u.province_id
    JOIN city c ON c.city_id = u.city_id AND c.province_id = p.province_id WHERE u.user_id = ${user_id};`;
    connection.query(sql, (error, resultCompany) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCompany);
    });
  };

  // 11. Vista Profesionales home

  viewHomeCompany = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT u.user_id, u.name, u.address, c.city_name , p.name as province_name, u.img
  FROM user u
  JOIN province p ON p.province_id = u.province_id
  JOIN city c ON c.city_id = u.city_id AND c.province_id = p.province_id WHERE u.user_type = 2 LIMIT 5;`;
    connection.query(sql, (error, resultHomeCompany) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultHomeCompany);
    });
  };

  // 13. Actividades de la empresa futuras

  getFutureCompanyActivities = (req, res) => {
    let user_id = req.params.user_id;

    let sql = `select act.activity_id, act.title, act.start_date, act.start_hour , act.end_hour, act.week_day, act.approved, f.file_name, c.city_name, p.name as province_name, (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = act.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
    (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = act.activity_id) AS likes
      from activity act
      left join file f ON act.activity_id = f.activity_id
      join user u ON act.user_id = u.user_id
      join province p ON act.province_id = p.province_id
      join city c ON act.city_id = c.city_id AND p.province_id = c.province_id
      where u.user_id = ${user_id} AND act.start_date >= CURDATE() AND act.activity_is_deleted = 0 AND act.approved = 1 ORDER BY act.start_date ASC;`;

    connection.query(sql, (error, resultCompActFutur) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCompActFutur);
    });
  };

  // 14. Actividades de la empresa pasadas

  getPastCompanyActivities = (req, res) => {
    let user_id = req.params.user_id;

    let sql = `select act.activity_id, act.title, act.start_date, act.start_hour , act.end_hour , act.week_day, act.approved, f.file_name, c.city_name, p.name as province_name, (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = act.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
    (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = act.activity_id) AS likes
      from activity act
      left join file f ON act.activity_id = f.activity_id
      join user u ON act.user_id = u.user_id
      join province p ON act.province_id = p.province_id
      join city c ON act.city_id = c.city_id AND p.province_id = c.province_id
      where u.user_id = ${user_id} AND act.start_date < CURDATE() AND act.activity_is_deleted = 0 ORDER BY act.start_date ASC;`;

    connection.query(sql, (error, resultCompActPast) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCompActPast);
    });
  };

  ///
  // 15. Vista Senior "Mis Datos"
  getSeniorData = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT u.user_id, u.name, u.lastname, u.address, c.city_name , p.name as province_name, u.phone, u.email, u.img, u.city_id, u.province_id 
      FROM user u
      JOIN province p ON p.province_id = u.province_id
      JOIN city c ON c.city_id = u.city_id AND c.province_id = p.province_id 
       WHERE u.user_id = ${user_id};`;
    connection.query(sql, (error, resultSeniorData) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultSeniorData);
    });
  };
  ///
  // 16. Vista Senior "Mis Intereeses"
  getSeniorInterests = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `select user_category.user_id, user_category.category_id, category.category_name
    , category.category_img 
    from category
    join user_category on category.category_id = user_category.category_id 
    WHERE user_category.user_id = ${user_id}
    AND category.category_is_deleted = 0;`;
    connection.query(sql, (error, resultSeniorInterests) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultSeniorInterests);
    });
  };
  ///
  // 17. Vista Senior "Mis actividades"
  getSeniorActivities = (req, res) => {
    const user_id = req.params.user_id;

    let sql = `SELECT   a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
    (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
    (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes
    
    FROM reservation         
    JOIN activity a ON a.activity_id = reservation.activity_id
    JOIN file f ON a.activity_id = f.activity_id
    JOIN city ci ON a.city_id = ci.city_id
    JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
    JOIN user u ON a.user_id = u.user_id
    WHERE reservation.user_id = ${user_id}
    ORDER BY a.start_date ASC`;

    connection.query(sql, (error, resultSeniorActivities) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultSeniorActivities);
    });
  };

  ///
  // 18. Eliminar categ/interes senior
  deleteInterestSenior = (req, res) => {
    const user_id = req.params.user_id;
    const category_id = req.params.category_id;

    let sql = `DELETE FROM user_category
    WHERE user_category.user_id = ${user_id}
    AND user_category.category_id = ${category_id} `;

    connection.query(sql, (error, resultInterestSenior) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultInterestSenior);
    });
  };
  ///
  // 19. añadir categ/interes senior
  addInterestSenior = (req, res) => {
    const { user_id, category_id } = req.params;

    let sql = `INSERT INTO user_category (user_id, category_id) VALUES (${user_id}, ${category_id})`;

    connection.query(sql, (error, resultaddInterest) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultaddInterest);
    });
  };

  // 20. Eliminado Logico del usuario

  deleteUser = (req, res) => {
    let user_id = req.params.user_id;

    let sql = `UPDATE user SET user_is_deleted = 1 WHERE user_id = "${user_id}";`;

    connection.query(sql, (error, resultDeleted) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultDeleted);
    });
  };

  viewCompanyProfs = (req, res) => {
    let { user_id } = req.params;

    let sql = ` select prof.*
    FROM professional prof
      join user u ON u.user_id = prof.user_id
      where u.user_id = ${user_id} AND prof.professional_is_deleted = 0;`;

    connection.query(sql, (error, resultCompProfs) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCompProfs);
    });
  };

  // 22. Formulario de creacion de profesional

  addProfessional = (req, res) => {
    let { user_id } = req.params;

    let { name, lastname, ocupation, description } = JSON.parse(
      req.body.profForm
    );

    let img = "avatar.png";

    if (req.file != undefined) {
      img = req.file.filename;
    }

    let sql = `INSERT INTO professional (professional_name, professional_lastname, professional_description, professional_ocupation, professional_img, user_id) VALUES ("${name}", "${lastname}", "${description}", "${ocupation}", "${img}", "${user_id}");`;

    connection.query(sql, (error, resultAddProf) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultAddProf);
    });
  };

  // 23. Recibir informacion de un profesional

  getProfInfo = (req, res) => {
    let { user_id, professional_id } = req.params;

    let sql = `select * from professional 
      where professional_id = ${professional_id};`;

    connection.query(sql, (error, resultOneProf) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultOneProf);
    });
  };

  // 24. Actualizar la informacion del profesional

  editProfInfo = (req, res) => {
    let professional_id = req.params.professional_id;
    let {
      professional_name,
      professional_lastname,
      professional_ocupation,
      professional_description,
      professional_img,
    } = JSON.parse(req.body.profInfo);

    if (req.file) {
      professional_img = req.file.filename;
    }

    let sql = `UPDATE professional SET professional_name = "${professional_name}", professional_lastname = "${professional_lastname}", professional_ocupation = "${professional_ocupation}", professional_description = "${professional_description}", professional_img = "${professional_img}" WHERE professional_id = ${professional_id}`;

    connection.query(sql, (error, resultEditProf) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultEditProf);
    });
  };

  // 25. Eliminado logico del profesional

  delProf = (req, res) => {
    let { professional_id } = req.params;

    let sql = `UPDATE professional SET professional_is_deleted = 1 WHERE professional_id = ${professional_id};`;
    connection.query(sql, (error, resultEditProf) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultEditProf);
    });
  };

  // 17. Get ONE activity company (para editar luego)
  getOneActivityCompany = (req, res) => {
    let activity_id = req.params.activity_id;
    let sqlPpal = `
      SELECT activity.*, file.*, city.city_name, province.name as province_name
      FROM activity
      JOIN file ON activity.activity_id = file.activity_id
      JOIN city ON activity.city_id = city.city_id
      JOIN province ON activity.province_id = province.province_id AND province.province_id = city.province_id
      WHERE activity.activity_id = ${activity_id}
    `;
    let sqlProf = `
      SELECT professional.professional_id, concat(professional.professional_name, " ", professional.professional_lastname) as professional_fullname
      FROM professional
      JOIN professional_activity ON professional.professional_id = professional_activity.professional_id
      WHERE professional_activity.activity_id = ${activity_id}
    `;
    let sqlActiviCategory = `
    SELECT activity_category.*, category.category_name
    FROM activity_category 
    JOIN category ON category.category_id = activity_category.category_id
    WHERE activity_category.activity_id = ${activity_id}
    `;
    connection.query(sqlPpal, (error, resultOneActivity) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        connection.query(sqlProf, (error, resultProf) => {
          if (error) {
            res.status(400).json({ error });
          } else {
            connection.query(
              sqlActiviCategory,
              (error, resultActiviCategory) => {
                if (error) {
                  res.status(400).json({ error });
                } else {
                  res.status(200).json({
                    resultOneActivity,
                    resultProf,
                    resultActiviCategory,
                  });
                }
              }
            );
          }
        });
      }
    });
  };

  //20. vista publica de un usuario
  viewPublicUser = (req, res) => {
    const { user_id } = req.params;
    const { activity_id } = req.params;

    let sql = `SELECT u.*, c.city_name AS city_name, p.name AS province_name
    FROM user u
    JOIN reservation r ON u.user_id = r.user_id
    JOIN city c ON u.city_id = c.city_id
    JOIN province p ON u.province_id = p.province_id AND p.province_id = c.province_id
    WHERE r.activity_id = ${activity_id};
    `;

    connection.query(sql, (error, resultPublicUser) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultPublicUser);
    });
  };
}

module.exports = new userController();
