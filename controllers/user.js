const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("../services/jwt");
const fs=require("fs");
const path=require("path");

function registrarUsuario(req,res,next){
    var newUser=new User();
    if (req.body.password && req.body.password!=""){
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
                res.json({created:false,error:err});
           })
        }).catch(err=>{
            res.statusCode=500;
            res.setHeader("Content-Type","application/json")
            res.json({created:false,error:err});
        })  
    }else{
        res.statusCode=500;
        res.setHeader("Content-Type","application/json")
        res.json({created:false,error:"Debe ingresar la contrañse"});
    }
}
function loginUsuario(req,res,next){
    var emailU=req.body.email;
    var passwordU=req.body.password;
    User.findOne({email:emailU.toLowerCase()}).exec()
    .then(user=>{
        if (user){
            bcrypt.compare(passwordU,user.password).then(equal=>{
                if(equal){
                    if(req.body.gethash){
                        res.status(200).send({logged:true,token:jwt.createToken(user)})
                    }else{
                        res.status(200).send({logged:true,user:user})
                    }
                }else{
                    res.statusCode=404;
                    res.setHeader("Content-Type","application/json")
                    res.json({logged:false,error:"Email y/o contraseña incorrecta"});
                }
            })
        }else{
            res.statusCode=404;
            res.setHeader("Content-Type","application/json")
            res.json({logged:false,error:"Email y/o contraseña incorrecta"});
        }
    }).catch(err=>{
        res.statusCode=500;
        res.setHeader("Content-Type","application/json")
        res.json({logged:false,error:err});
    })
}
function updateUser(req,res){
    var iduser=req.params.userId;
    var update=req.body;
    console.log(update);
    User.findByIdAndUpdate(iduser,{$set:update},{new:true})
    .then(userUpdated=>{
        if (userUpdated){
            res.status(200).send({updated:true,user:userUpdated});
        }else{
            res.status(500).send({updated:false,error:"No se ha podido actualizar el usuario"});
        }
    }).catch(err=>{
        res.status(500).send({updated:false,error:err});
    })
}
function updateUserImage(req,res){
    if(req.files){
        var image_path=req.files.image.path;
        var split_path=image_path.split("\\");
        var image_name=split_path[3];
        var ext_split=image_name.split("\.");
        var ext_image=ext_split[1];
        if(ext_image=="jpg" || ext_image=="png" || ext_image=="gif"){
            User.findByIdAndUpdate(req.params.userId,{$set:{image:image_name}},{new:true})
            .then(userWithImageUpdated=>{
                if (userWithImageUpdated){
                    res.status(200).send({uploaded:true,updated:true,user:userWithImageUpdated});
                }else{
                    res.status(500).send({uploaded:true,updated:false,error:"No se ha podido actualizar el usuario"});
                }
            })
            .catch(err=>{
                res.status(500).send({uploaded:false,error:err});
            })
        }else{
            res.status(500).send({uploaded:false,error:'Extension de archivo no valida'});
        }
    }else{
        res.status(500).send({uploaded:false,error:'No se ha podido subir ningun archivo'});
    }
}
function getImageFile(req, res){
    var imageFile=req.params.imageFile;
    var imagePath="./uploads/users/images/"+imageFile;
    fs.exists(imagePath,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(imagePath));
        }else{
            res.status(404).send({founded:false,error:'No se ha encontrar la imagen'});
        }
    })

}
module.exports={
    registrarUsuario,
    loginUsuario,
    updateUser,
    updateUserImage,
    getImageFile
};