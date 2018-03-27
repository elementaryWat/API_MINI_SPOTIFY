const Songs=require("../models/song");
function getSong(req,res){
    res.status(200).send({founded:true});
}
function createSong(req,res){
    if(!req.file){
        return res.status(500).send({uploaded:false});
    }else{
        res.status(200).send({song:req.file});
        /* Songs.create(req.body)
        .then(newSong=>{
            if(newSong){
                res.status(200).send({created:true,song:newSong});
            }else{
                res.status(500).send({created:false,error:"No se pudo crear la cancion"});
            }
        })
        .catch(error=>{
            res.status(500).send({created:false,error});
        }) */

    }
}
module.exports={
    getSong,
    createSong
}