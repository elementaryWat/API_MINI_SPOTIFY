const Artists=require("../models/artist");
const mongoosePagination=require("mongoose-pagination");
const path=require("path");
const fs=require("fs");

function getArtista(req,res){
    var artistId=req.params.artistId;
    Artists.findById(artistId)
    .then(artist=>{
        if(artist){
            res.status(200).send({founded:true,artist})
        }else{
            res.status(404).send({founded:false,artist:null})
        }
    })
    .catch(err=>{
        res.status(500).send({err,message:"Ocurrio un error al buscar en la base de datos"})
    });
}
function getArtists(req,res){
    var page=(req.params.page)?req.params.page:1;
    console.log(page);
    var artistsPerPage=3;
    Artists.find({}).sort('name').paginate(page,artistsPerPage,(err,artists,totalDocs)=>{
        if (err){
            res.status(500).send({err,message:"Ocurrio un error al buscar en la base de datos"})
        }else{
            var numbP=Math.trunc(totalDocs/artistsPerPage);
            numbP=((totalDocs%artistsPerPage)>0)?(numbP+1):numbP;
            if(artists){
                return res.status(200).send({
                    pages:numbP,
                    artists
                })
            }else{
                res.status(404).send({message:"No se encontraron artistas"})
            }
        }
    });
}
function createArtist(req,res){
    Artists.create(req.body)
    .then(artist=>{
        res.status(200).send({artistCreated:artist})
    })
    .catch(err=>{
        res.status(500).send({error:err});
    })
}
function updateArtist(req,res){
    var artistId=req.params.artistId;
    var update=req.body;
    console.log("Hola");
    Artists.findByIdAndUpdate(artistId,{$set:update},{new:true})
    .then(artistUpdated=>{
        if(artistUpdated){
            res.status(200).send({updated:true,artist:artistUpdated})
        }else{
            res.status(404).send({updated:false})
        }
    })
    .catch(err=>{
        res.status(500).send({updated:false,error:err})
    })
}
function uploadImageArtist(req,res){
    if(req.files){
        var artistId=req.params.artistId;
        var imagePath=req.files.imageArtist.path;
        var pathSplit=imagePath.split("\\");
        console.log(pathSplit);
        var imageName=pathSplit[3];
        var splitName=imageName.split("\.");
        var ext=splitName[1];
        if (ext=="jpg" || ext=="png" || ext=="gif"){
            Artists.findByIdAndUpdate(artistId,{$set:{image:imageName}},{new:true})
            .then(artistWithImageUpdated=>{
                if(artistWithImageUpdated){
                    res.status(200).send({updated:true,artist:artistWithImageUpdated})    
                }else{
                    res.status(404).send({updated:false,error:"Artista no encontrado"})    
                }
            })
            .catch(err=>{
                res.status(500).send({updated:false,error:err});                
            })
        }else{
            res.status(500).send({updated:false,error:"Extension no soportada"});
        }
    }else{
        res.status(500).send({updated:false,error:"Archivo no subido correctamente"})
    }
}
function getImageArtist(req,res){
    var imageName=req.params.imageName;
    var dir="./uploads/artists/images/"+imageName;
    fs.exists(dir,(exists)=>{
        if (exists){
            res.status(200).sendFile(path.resolve(dir));
        }else{
            res.status(404).send({founded:false,error:"Imagen no encontrada"})                
        }
    });
}
function deleteArtist(req,res){
    var artistId=req.params.artistId;
    Artists.findByIdAndRemove(artistId)
    .then(artistDeleted=>{
        if(artistDeleted){
            res.status(200).send({deleted:true,artist:artistDeleted})
        }else{
            res.status(404).send({deleted:false,error})
        }
    })
    .catch(error=>{
        res.status(404).send({deleted:false,error:"Artista no encontrado"})
    })
}
module.exports={
    getArtista,
    createArtist,
    getArtists,
    updateArtist,
    uploadImageArtist,
    getImageArtist,
    deleteArtist
}