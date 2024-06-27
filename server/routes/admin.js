var express = require("express");
var router = express.Router();
var adminController = require("../controllers/adminControllers");

//1.- trae los datos de todos los usuarios empresa
//http://localhost:4000/usersCompany
//------------------------------------------
router.get("/usersCompany", adminController.getAllUsersCompany);

// //2.- deshabilita un usuario
//localhost:4000/admin/disableUserCompany/:userId
// //--------------------------------------------
router.put("/disableUserCompany/:id", adminController.disableUser);

// //3.- deshabilita una actividad
// //localhost:4000/admin/disableAct/:userId
// //--------------------------------------------
router.put("/disableAct/:id", adminController.disableAct);

// //4.- Muestra todas las actividades
// //localhost:4000/admin/activitiesAdmin
// //--------------------------------------------
router.get("/activitiesAdmin", adminController.getAllActivitiesAdmin);

module.exports = router;
