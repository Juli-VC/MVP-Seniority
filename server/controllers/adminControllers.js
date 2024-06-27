const connection = require("../config/db");

class adminController {
  //1.- Trae todos los datos de todos los usuarios empresa

  getAllUsersCompany = (req, res) => {
    let sql =
      "SELECT u.*, c.city_name, p.name AS province_name FROM user u JOIN city c ON u.city_id = c.city_id AND u.province_id = c.province_id JOIN province p ON u.province_id = p.province_id WHERE u.user_type = 2";
    connection.query(sql, (error, resultCompany) => {
      if (error) {
        res.status(400).json({ error });
      }
      res.status(200).json(resultCompany);
    });
  };

  //-------------------------------------------------
  // 2.- desahibilita un usuario de manera lógica
  //localhost:4000/admin/desableUser/:userId

  disableUser = (req, res) => {
    let { user_is_deleted } = req.body;
    let activity_is_deleted = user_is_deleted;
    let { id } = req.params;

    let sql = `UPDATE user, activity SET user_is_deleted = ${user_is_deleted}, activity_is_deleted = ${activity_is_deleted} WHERE user.user_id = ${id}`;

    let sql2 =
      "SELECT u.*, c.city_name, p.name AS province_name FROM user u JOIN city c ON u.city_id = c.city_id AND u.province_id = c.province_id JOIN province p ON u.province_id = p.province_id WHERE u.user_type = 2";

    connection.query(sql, (error, resultDisabled) => {
      if (error) throw error;
    });
    connection.query(sql2, (error, resultUsersCompany2) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultUsersCompany2);
    });
  };

  // //-------------------------------------------------
  // // 3.- desahibilita una actividad de manera lógica

  disableAct = (req, res) => {
    let { approved } = req.body;
    let { id } = req.params;

    let sql = `UPDATE activity SET approved = ${approved} WHERE activity_id = ${id}`;
    let sql2 = "SELECT * from activity";

    connection.query(sql, (error, resultApproved) => {
      if (error) throw error;
    });
    connection.query(sql2, (error, resultActivities) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultActivities);
    });
  };

  // // 4.- Muestra todas las actividades

  getAllActivitiesAdmin = (req, res) => {
    let sql = `SELECT a.*, f.file_name, u.name, ci.city_name, p.name AS province_name,
    (SELECT COUNT(r.reservation_id) FROM reservation r WHERE r.activity_id = a.activity_id AND r.reservation_is_deleted = 0) AS asistentes,
    (SELECT COUNT(ac.thumb_up) FROM activity_comment ac WHERE ac.activity_id = a.activity_id) AS likes
FROM activity a
JOIN file f ON a.activity_id = f.activity_id
JOIN city ci ON a.city_id = ci.city_id
JOIN province p ON a.province_id = p.province_id AND p.province_id = ci.province_id
JOIN user u ON a.user_id = u.user_id
WHERE a.activity_is_deleted = 0
ORDER BY a.activity_creation_date DESC;
 `;
    connection.query(sql, (error, resultAllActivitiesAdmin) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultAllActivitiesAdmin);
    });
  };
}

module.exports = new adminController();
