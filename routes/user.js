var express = require('express');
var routerUser = express.Router();
const userController=require("../controllers/user");
const md_auth=require("../middlewares/authenticated");
const multer=require("multer");
const crypto=require("crypto");
const path=require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads/users/images')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);
    
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
})
const upload=multer({storage});

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
routerUser.post("/updateUserImage/:userId",upload.single('avatar'),userController.updateUserImage);
routerUser.get("/getImage/:imageFile",userController.getImageFile);
module.exports = routerUser;
