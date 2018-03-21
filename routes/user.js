var express = require('express');
var router = express.Router();
const userController=require("../controllers/user");

/* GET users listing. */
router.route("/")
.get((req, res, next)=> {
  res.send('Ruta de prueba');
})

router.route("/register")
.post(userController.registrarUsuario);


module.exports = router;
