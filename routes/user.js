var express = require('express');
var routerUser = express.Router();
const userController=require("../controllers/user");
const md_auth=require("../middlewares/authenticated");
const multipart=require("connect-multiparty");
const md_upload=multipart({uploadDir:"./uploads/users/images"});

/* GET users listing. */
routerUser.route("/")
.get((req, res, next)=> {
  res.send('Ruta de prueba');
})
routerUser.post("/pruebaAuth",md_auth.ensureAuth,(req,res,next)=>{
  res.status(200).send("<html><body><h1>Prueba</h1><p>Ruta para loggeados</p></body></html>")
});
routerUser.post("/register",userController.registrarUsuario);
routerUser.post("/login",userController.loginUsuario);
routerUser.put("/update/:userId",md_auth.ensureAuth,userController.updateUser);
routerUser.post("/updateUserImage/:userId",[md_auth.ensureAuth,md_upload],userController.updateUserImage);
routerUser.get("/getImageFile/:imageFile",userController.getImageFile);
module.exports = routerUser;
