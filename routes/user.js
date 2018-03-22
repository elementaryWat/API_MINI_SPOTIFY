var express = require('express');
var router = express.Router();
const userController=require("../controllers/user");
const md_auth=require("../middlewares/authenticated");

/* GET users listing. */
router.route("/")
.get((req, res, next)=> {
  res.send('Ruta de prueba');
})
router.post("/pruebaAuth",md_auth.ensureAuth,(req,res,next)=>{
  res.status(200).send("<html><body><h1>Prueba</h1><p>Ruta para loggeados</p></body></html>")
});
router.post("/register",userController.registrarUsuario);
router.post("/login",userController.loginUsuario);
router.put("/update/:userId",md_auth.ensureAuth,userController.updateUser);

module.exports = router;
