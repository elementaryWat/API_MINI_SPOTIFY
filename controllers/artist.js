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
    .then(newArtist=>{
        if(artist){
            res.status(200).send({created:true,artist:newArtist})
        }else{
            res.status(500).send({created:false,error:"No se pudo crear el Artista"})
        }
    })
    .catch(err=>{
        res.status(500).send({created:false,error:err});
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
function updateImageArtist(req,res){
    if (!req.file) {
        console.log("No file received");
        return res.send({
          uploaded: false
        });
    
      } else {
        console.log('file received',req.file);
        var artistId=req.params.artistId;

        Artists.findByIdAndUpdate(artistId,{$set:{image:req.file.filename}})
        .then(artistBeforeUpdate=>{ 
            if(artistBeforeUpdate){
                var pathOldImage="./uploads/artists/images/"+artistBeforeUpdate.image;
                fs.exists(pathOldImage,(exists)=>{
                    if(exists){
                        fs.unlink(pathOldImage,(err)=>{
                            if(err){
                                return res.status(500).send({updated:true,artistBeforeUpdate,info:"No se pudo eliminar la imagen anterior"});                                        
                            }
                            res.status(200).send({updated:true,artistBeforeUpdate,info:"Se elimino la imagen anterior"}); 
                        })
                    }else{
                        res.status(200).send({updated:true,artistBeforeUpdate,info:"No se encontro la imagen anterior"});                         
                    }
                })
            }else{
                res.status(404).send({updated:false,error:"No se encontro el artista"});            
            }
        })
        .catch(error=>{
            res.status(200).send({updated:false,error});        
        })
      }
}
function getImageArtist(req,res){
    var imageName=req.params.artistImage;
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
            var pathImageRemoved="./uploads/artists/images/"+artistDeleted.image;
            
            fs.unlink(pathImageRemoved, (err) => {
                if (err){
                    return res.status(200).send({deleted:true,fileDeleted:false,error:err})
                }
                res.status(200).send({deleted:true,fileDeleted:true,artist:artistDeleted})
              });  
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
    updateImageArtist,
    getImageArtist,
    deleteArtist
}