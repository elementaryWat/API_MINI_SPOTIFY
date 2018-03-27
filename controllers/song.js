const Songs=require("../models/song");
const path=require("path");
const mp3Duration=require("mp3-duration");
function getSong(req,res){
    res.status(200).send({founded:true});
}
function createSong(req,res){
    if(!req.file){
        return res.status(500).send({uploaded:false});
    }else{
        var Song=new Songs();
        Song.number=req.body.number;
        Song.name=path.basename(req.file.originalname,path.extname(req.file.originalname));
        Song.album=req.body.albumId;
        Song.file=req.file.filename;
        mp3Duration(req.file.path,(err,duration)=>{
            if(err){
                return res.status(500).send({error:"Error al leer el archivo .mp3"})
            }
            Song.duration=duration;   
            Song.save()
            .then(newSong=>{
                if(newSong){
                    res.status(200).send({created:true,song:newSong})
                }else{
                    res.status(500).send({created:false,error:'Ocurrio un error al agregar la cancion a la DB'})
                }
            })
            .catch(error=>{
                res.status(500).send({created:false,error})                
            })        
        })
    }
}
module.exports={
    getSong,
    createSong
}