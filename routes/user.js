var express = require('express');
var router = express.Router();
const userController=require("../controllers/user");

/* GET users listing. */
router.route("/")
.get((req, res, next)=> {
  res.send('Ruta de prueba');
})

router.post("/register",userController.registrarUsuario);
router.post("/login",userController.loginUsuario);

module.exports = router;
