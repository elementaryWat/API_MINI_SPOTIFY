const bcrypt=require("bcrypt");
const User=require("../models/user");

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
                    res.statusCode=200;
                    res.setHeader("Content-Type","application/json")
                    res.json({logged:true,user:user});
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
module.exports={
    registrarUsuario,
    loginUsuario
};