const jwt=require("jwt-simple");
const moment=require("moment");
var secret="mean_spotify_mini";

exports.ensureAuth=(req,res,next)=>{
    var tokenEnc=req.headers.authorization;
    var tokenDec;
    if(!tokenEnc){
        return res.status(403).send({authenticated:false,message:"Token no enviado"});
    }

    try{
        tokenDec=jwt.decode(tokenEnc,secret);
        if(tokenDec.exp<=moment().unix())
        {
            return res.status(401).send({authenticated:false,message:"Token expirado"});
        }

    }catch(exc){
        console.log(exc);
        return res.status(403).send({authenticated:false,message:"Token no valido"});
    }
    req.user=tokenDec.user;
    next();
}