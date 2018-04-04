const bcrypt=require("bcrypt");
const Users=require("../models/user");
const jwt=require("../services/jwt");
const fs=require("fs");
const path=require("path");

function registrarUsuario(req,res,next){
    var newUser=new Users();
    newUser.name=req.body.name;
    newUser.surname=req.body.surname;
    newUser.email=req.body.email;
    newUser.role=req.body.role;
    newUser.image=req.body.image;
    bcrypt.hash(req.body.password,10).then(passHashed=>{
        newUser.password=passHashed;
       newUser.save().then(user=>{
            res.statusCode=200;
            res.setHeader("Content-Type","application/json")
            res.json({created:true,user:user});
       }).catch(err=>{
            res.statusCode=500;
            res.setHeader("Content-Type","application/json")
            res.json({created:false,message:"Ha ocurrido un error al guardar en la base de datos",error:err});
       })
    }).catch(err=>{
        res.statusCode=500;
        res.setHeader("Content-Type","application/json")
        res.json({created:false,message:"Ha ocurrido un error con la contraseña",error:err});
    })
}
function passwordEqual(req,res){
  var userId=req.params.userId;
  var oldPassword=req.body.oldPassword;
  var inputOldPassword=req.body.inputOldPassword;
  bcrypt.compare(inputOldPassword,oldPassword).then(equal=>{
      if(equal){
          res.status(200).send({equal:true})
      }else{
          res.status(200).send({equal:false})
      }
  })
}
function actualizarPassword(req,res){
  var userId=req.params.userId;
  var newPassword=req.body.password;
  bcrypt.hash(newPassword,10).then(passHashed=>{
     Users.findByIdAndUpdate(userId,{$set:{password:passHashed}},{new:true}).then(userWithNewPassword=>{
         if (userWithNewPassword){
             res.status(200).send({updated:true,user:userWithNewPassword});
         }else{
             res.status(404).send({updated:false,message:"No se ha podido encontrado el usuario"});
         }
     }).catch(err=>{
          res.statusCode=500;
          res.setHeader("Content-Type","application/json")
          res.json({created:false,message:"Ha ocurrido un error al guardar en la base de datos",error:err});
     })
  }).catch(err=>{
      res.statusCode=500;
      res.setHeader("Content-Type","application/json")
      res.json({created:false,message:"Ha ocurrido un error con la contraseña",error:err});
  })
}
function loginUsuario(req,res,next){
    var emailU=req.body.email;
    var passwordU=req.body.password;
    Users.findOne({email:emailU.toLowerCase()}).exec()
    .then(user=>{
        if (user){
            bcrypt.compare(passwordU,user.password).then(equal=>{
                if(equal){
                    if(req.body.gethash){
                        res.status(200).send({logged:true,token:jwt.createToken(user),user})
                    }else{
                        res.status(200).send({logged:true,user:user})
                    }
                }else{
                    res.statusCode=404;
                    res.setHeader("Content-Type","application/json")
                    res.json({logged:false,message:"Email y/o contraseña incorrecta"});
                }
            })
        }else{
            res.statusCode=404;
            res.setHeader("Content-Type","application/json")
            res.json({logged:false,message:"Email y/o contraseña incorrecta"});
        }
    }).catch(err=>{
        res.statusCode=500;
        res.setHeader("Content-Type","application/json")
        res.json({logged:false,message:"Error en el servidor",error:err});
    })
}
function buscarUsuarioConEmail(req,res){
  var email=req.body.email;
  Users.find({email:email}).exec()
  .then(usersConEmail=>{
    // console.log(userConEmail);
    if(usersConEmail.length>0){
      res.status(200).send({founded:true,user:usersConEmail})
    }else{
      res.status(200).send({founded:false,message:"No se ha encontrado un usuario con este email"})
    }
  })
  .catch(error=>{
    res.status(500).send({founded:false,message:"Error en el servidor",error})
  })
}
function updateUser(req,res){
    var iduser=req.params.userId;
    var update=req.body;
    console.log(update);
    Users.findByIdAndUpdate(iduser,{$set:update},{new:true})
    .then(userUpdated=>{
        if (userUpdated){
            res.status(200).send({updated:true,user:userUpdated});
        }else{
            res.status(404).send({updated:false,message:"No se ha podido encontrado el usuario"});
        }
    }).catch(err=>{
        res.status(500).send({updated:false,message:"Error en el servidor",error:err});
    })
}
function updateUserImage(req,res){
    if (!req.file) {
    console.log("No file received");
    return res.send({
      uploaded: false
    });

  } else {
    console.log('file received',req.file);
    Users.findByIdAndUpdate(req.params.userId,{$set:{image:req.file.filename}})
    .then(userBeforeUpdate=>{
        if(userBeforeUpdate){
            var pathOldImage="./uploads/users/images/"+userBeforeUpdate.image;
                fs.exists(pathOldImage,(exists)=>{
                    if(exists){
                        fs.unlink(pathOldImage,(err)=>{
                            if(err){
                                return res.status(200).send({updated:true,image:req.file.filename,userBeforeUpdate,message:"No se pudo eliminar la imagen anterior"});
                            }
                            res.status(200).send({updated:true,image:req.file.filename,userBeforeUpdate,message:"Se elimino la imagen anterior"});
                        })
                    }else{
                        res.status(200).send({updated:true,image:req.file.filename,userBeforeUpdate,message:"No se encontro la imagen anterior"});
                    }
                })
        }else{
            res.status(404).send({updated:false,founded:false,message:"No se encontro el usuario"});
        }
    })
    .catch(error=>{
        res.status(500).send({updated:false,message:"Error en el servidor",error});
    })
  }
}
function getImageFile(req, res){
    var imageFile=req.params.imageFile;
    var imagePath="./uploads/users/images/"+imageFile;
    fs.exists(imagePath,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(imagePath));
        }else{
            res.status(404).send({founded:false,message:'No se ha encontrar la imagen'});
        }
    })

}
module.exports={
    registrarUsuario,
    loginUsuario,
    buscarUsuarioConEmail,
    passwordEqual,
    updateUser,
    actualizarPassword,
    updateUserImage,
    getImageFile
};
