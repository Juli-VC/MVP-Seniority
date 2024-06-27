const connection = require("../config/db.js");
const { main } = require("../config/nodemailer.js");
const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51NETCXFYZq5WNJpUpySuDkmdE35ZNrWRMBTrcVJka1Ho8t9s8jZaMSpbKl6Qu6sJpn0owAni1yqz81PCi6XnoqzG00shdubpiW"
);
class indexController {
  //1. Mostrar todas las categorías. Para el select Actividades del navbar.
  getAllcategories = (req, res) => {
    let sql = "SELECT * FROM category WHERE category_is_deleted = 0";
    connection.query(sql, (error, resultCategories) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultCategories);
    });
  };
  //2. Mostrar todas las provincias en el select register user.
  getAllProvince = (req, res) => {
    let sql = "SELECT * FROM province ORDER BY name";
    connection.query(sql, (error, resultprovince) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultprovince);
    });
  };
  //3. Mostrar todas las ciudades en el select register user.
  getAllCity = (req, res) => {
    const province_id = req.headers.authorization;

    let sql = `SELECT * FROM city WHERE province_id = ${province_id}  ORDER BY city_name`;
    connection.query(sql, (error, resultcity) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultcity);
    });
  };
  //3. Pagar.
  makePayment = async (req, res) => {
    const { id, amount, description, resultActivity, userID } = req.body;

    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: "EUR",
        description: description,
        payment_method: id,
        confirm: true, //confirm the payment at the same time
      });

      let sqlReservation = `INSERT INTO reservation (activity_id, user_id, is_paid) VALUES (${resultActivity.activity_id}, ${userID}, 1)`;

      connection.query(sqlReservation, (error, resultReservation) => {
        if (error) {
          res.status(400).json({ error });
        }
      });

      return res.status(200).json({ message: "Successful Payment" });
    } catch (error) {
      return res.json({ message: error.raw.message });
    }
  };

  //1. Mostrar todas las categorías. Para el select Actividades del navbar.
  getprofessionalList = (req, res) => {
    let sql = `SELECT professional_id, professional_name, professional_lastname 
    FROM professional 
    WHERE professional_is_deleted = 0`;

    connection.query(sql, (error, resultprofessionalList) => {
      error
        ? res.status(400).json({ error })
        : res.status(200).json(resultprofessionalList);
    });
  };

  postNodemailer = (req, res) => {
    main();
  };
}

module.exports = new indexController();
