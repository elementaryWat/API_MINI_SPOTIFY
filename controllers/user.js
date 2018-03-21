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
        res.json({created:false,error:"pw_required"});
    }
}

module.exports={
    registrarUsuario
}