var express = require("express");
var router = express.Router();
var indexController = require("../controllers/indexControllers");

// 1. Vista de las actividades
//http://localhost:4000/
router.get("/", indexController.getAllcategories);
router.get("/selectProvince", indexController.getAllProvince);
router.get("/selectCity", indexController.getAllCity);

// 2. Pago Stripe
// http://localhost:4000/api/checkout
router.post("/api/checkout", indexController.makePayment);

// 3. lista de de las profesionales
//http://localhost:4000/professionalList
router.get("/professionalList", indexController.getprofessionalList);

//nodemailer
router.post("/nodemailer", indexController.postNodemailer);

module.exports = router;
