var express = require("express");
const multer = require("../middleware/multer");
const activitiesController = require("../controllers/activitiesControllers");
const uploadImage = require("../middleware/multerSingle");
var router = express.Router();

// 1. Vista de las actividades
//http://localhost:4000/activities
router.get("/", activitiesController.getAllActivities);

// 2. Mostrar las actividades por categoría
//http://localhost:4000/activities/:category_id
router.get("/category/:category_id", activitiesController.getCategoryAct);

// 3. Mostrar una actividad
//http://localhost:4000/activities/oneActivity/:activity_id
router.get("/oneActivity/:activity_id", activitiesController.getOneActivity);

// 4. Crear una actividad
//http://localhost:4000/activities/CreateActivity
router.post(
  "/createActivity/:user_id",
  uploadImage("activityIMG"),
  activitiesController.createActivity
);

// 6. Vista de las actividades destacadas
//http://localhost:4000/activities/highlightedActivities
router.get(
  "/highlightedActivities",
  activitiesController.getHighlightedActivities
);

// 7. filtro busqueda actividades
//http://localhost:4000/activities/filter
router.get("/filter", activitiesController.getFilterActivity);

// 8. Vista de actividades de una empresa
//http://localhost:4000/activities/highlightedActivities

// 7. Vista de categorias
//http://localhost:4000/activities/AllActivities/categories/:category_name
router.get(
  "/AllActivities/categories/:category_name",
  activitiesController.getCategories
);
// 8. Edit activity
//http://localhost:4000/activities/editActivity/:activity_id
router.put(
  "/editActivity/:activity_id",
  uploadImage("activityIMG"),
  activitiesController.editACtivity
);




module.exports = router;
