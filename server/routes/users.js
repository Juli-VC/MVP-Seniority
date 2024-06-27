var express = require("express");
const userControllers = require("../controllers/userControllers");
var router = express.Router();
const multer = require("../middleware/multer");
const multerSingle = require("../middleware/multerSingle");
const verify = require("../middleware/verify");
const uploadImage = require("../middleware/multerSingle");

//-----------------------------------------------------
//1.Vista de un usuario
//http:/localhost:4000/users/user/:user_id
router.get("/user/:user_id", userControllers.getOneUser);

//-------------------------------------------------------
//2. Crear un usuario senior
//http:/localhost:4000/users/createUsers
router.post(
  "/createUsers",
  uploadImage("usersImg"),
  userControllers.createSenior
);
//------------------------------------------------------
// 3. Editar un usuario Senior
//http:/localhost:4000/users/editUser/:user_id
router.put(
  "/editUser/:user_id",
  uploadImage("usersImg"),
  userControllers.editSenior
);
//------------------------------------------------------
// 4. Eliminar un usuario Senior de manera lógica
//http:/localhost:4000/users/deletedUser/:user_id
router.put("/deletedUser/:user_id", userControllers.deletedSenior);
//-----------------------------------------------------
// 5. Mostrar actividades según preferencia provincia
// http:/localhost:4000/users/viewUserHomePage
router.get("/viewUserHomePage", userControllers.getUserHomePage);

//---------------------------------------------------------------
// 7. Mostrar la vista de los intereses de cada usuario
// http:/localhost:4000/users/Interests/:user_id
router.get("/Interests/:user_id", userControllers.getInterests);

//------------------------------------------------------
// 8. Login de usuario Senior
// http:/localhost:4000/users/login
router.post("/login", userControllers.loginSenior);

//--------------------------------------------------------
//9. Crear un usuario Company
//http://localhost:4000/users/createCompany
router.post(
  "/createCompany",
  uploadImage("usersIMG"),
  userControllers.createCompany
);

//------------------------------------------------------
// 10. Vista de la empresa
// http://localhost:4000/users/company/:user_id
router.get("/company/:user_id", userControllers.viewCompany);

//-----------------------------------------------------------------
// 11. Vista Profesionales home
//http://localhost:4000/users/homeCompany/
router.get("/homeCompany", userControllers.viewHomeCompany);

//------------------------------------------------------
// 12. Vista todos los profesionales de una empresa
// http://localhost:4000/users/company/:user_id/allProfs
// router.get("/company/:user_id/allProfs", userControllers.viewCompanyProfs)

//------------------------------------------------------
// 13. Actividades de la empresa futuras
// http://localhost:4000/users/company/:user_id/FutureActs
router.get("/company/:user_id/FutureActs", userControllers.getFutureCompanyActivities);



//------------------------------------------------------
// 14. Senior "mis datos"
// http://localhost:4000/users/seniorData/:user_id
router.get("/seniorData/:user_id", userControllers.getSeniorData);

//------------------------------------------------------
// 15. Senior "mis intereses"
// http://localhost:4000/users/seniorInterests/:user_id
router.get("/seniorInterests/:user_id", userControllers.getSeniorInterests);

// 16. Senior "mis actividades"
// http://localhost:4000/users/seniorActivities/:user_id
router.get("/seniorActivities/:user_id", userControllers.getSeniorActivities);

// 17. Eliminar "categoria"/intereses del Senior"
// http://localhost:4000/users/user/:user_id/:category_id
router.delete(
  "/user/:user_id/:category_id",
  userControllers.deleteInterestSenior
);

// 18. añadior "categoria"/intereses del Senior"
// http://localhost:4000/users/user/:user_id/:category_id
router.post("/user/:user_id/:category_id", userControllers.addInterestSenior);

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////





//------------------------------------------------------
// 19. Borrado logico del usuaraio
// http://localhost:4000/users/deleteUser/:user_id
router.put("/users/deleteUser/:user_id", userControllers.deleteUser);

//------------------------------------------------------
// 20. Actividades de la empresa pasadas
// http://localhost:4000/users/company/:user_id/PastActs
router.get(
  "/company/:user_id/PastActs",
  userControllers.getPastCompanyActivities
);

//------------------------------------------------------
// 21. Lista de profesionales de la empresa
// http://localhost:4000/users/company/:user_id/viewCompanyProfs
router.get(
  "/company/:user_id/viewCompanyProfs",
  userControllers.viewCompanyProfs
);

//------------------------------------------------------
// 22. Formulario de creacion de profesional
// http://localhost:4000/users/company/:user_id/addProfessional
router.post(
  "/company/:user_id/addProfessional",
  uploadImage("profsIMG"),
  userControllers.addProfessional
);

//------------------------------------------------------
// 23. Recibir informacion de un profesional
// http://localhost:4000/users/company/:user_id/:professional_id/getOneProf
router.get("/company/:user_id/:professional_id/getOneProf",  userControllers.getProfInfo);

//------------------------------------------------------
// 24. Actualizar la informacion del profesional
// http://localhost:4000/users/company/:user_id/:professional_id/editProfInfo
router.put(
  "/company/:user_id/:professional_id/updateProf", uploadImage("profsIMG"),
  userControllers.editProfInfo
);

//------------------------------------------------------
// 25. Eliminado logico del profesional
// http://localhost:4000/users/company/:user_id/:professional_id/delProf
router.put(
  "/company/:user_id/:professional_id/delProf",
  userControllers.delProf
);

//------------------------------------------------------
// 26. Borrado logico del usuaraio
// http://localhost:4000/users/deleteUser/:user_id
router.put("/deleteUser/:user_id", userControllers.deleteUser);

//------------------------------------------------------
// 27. Actividades de la empresa pasadas
// http://localhost:4000/users/company/:user_id/PastActs
router.get(
  "/company/:user_id/PastActs",
  userControllers.getPastCompanyActivities
);

//28. vista publica de un usuario
//http://localhost:4000/users/company/:user_id/:activity_id/public
router.get(
  "/company/:user_id/:activity_id/public",
  userControllers.viewPublicUser
);

//------------------------------------------------------
// 29. 1 actividad para editar en empresa
// http://localhost:4000/users/company/:activity_id

router.get("/oneActivity/:activity_id", userControllers.getOneActivityCompany);

module.exports = router;
