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
    var sortBy=req.body.sortBy;
    var order=(req.body.order=='desc')?'-':'';
    var artistsPerPage=6;
    Artists.find({}).sort(order+sortBy).paginate(page,artistsPerPage,(err,artists,totalDocs)=>{
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
function getArtistsForSearch(req,res){
    Artists.find().exec().then(artists=> {
      res.status(200).send({artists});
    })
    .catch(error=>{
      res.status(500).send({error, message:"Ocurrio un error al buscar el artista"});

    })
}
function createArtist(req,res){
    Artists.create(req.body)
    .then(newArtist=>{
        if(newArtist){
            res.status(200).send({created:true,artist:newArtist})
        }else{
            res.status(500).send({created:false,message:"No se pudo crear el Artista"})
        }
    })
    .catch(err=>{
        res.status(500).send({created:false,error:err,message:"Ocurrio un error al crear el artista"});
        console.log(err);
    })
}
function existeArtista(req,res){
  var artistName=req.body.artistName;
  Artists.find({name:artistName}).exec()
  .then(artistsWithName=>{
    if(artistsWithName.length>0){
      res.status(200).send({founded:true});
    }else{
      res.status(200).send({founded:false});
    }
  })
  .catch(error=>{
    res.status(500).send({error,message:"Ocurrio un error al buscar el usuario"})
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
            res.status(404).send({updated:false,message:"No se pudo encontrar el artista"})
        }
    })
    .catch(err=>{
        res.status(500).send({updated:false,message:"No se pudo actualizar el artista",error:err})
    })
}
function updateImageArtist(req,res){
    if (!req.file) {
        console.log("No file received");
        return res.send({
          uploaded: false, message:"No se pudo subir el archivo de imagen"
        });

      } else {
        console.log('file received',req.file);
        var artistId=req.params.artistId;

        Artists.findByIdAndUpdate(artistId,{$set:{image:req.file.filename}})
        .then(artistBeforeUpdate=>{
            if(artistBeforeUpdate){
                if(artistBeforeUpdate.image=="default.png"){
                  res.status(200).send({updated:true,artistBeforeUpdate,image:req.file.filename,message:"No se elimino la imagen anterior"});
                }else{
                  var pathOldImage="./uploads/artists/images/"+artistBeforeUpdate.image;
                  fs.exists(pathOldImage,(exists)=>{
                      if(exists){
                          fs.unlink(pathOldImage,(err)=>{
                              if(err){
                                  return res.status(500).send({updated:true,artistBeforeUpdate,image:req.file.filename,message:"No se pudo eliminar la imagen anterior",error:err});
                              }
                              res.status(200).send({updated:true,artistBeforeUpdate,image:req.file.filename,message:"Se elimino la imagen anterior"});
                          })
                      }else{
                          res.status(200).send({updated:true,artistBeforeUpdate,image:req.file.filename,message:"No se encontro la imagen anterior"});
                      }
                  })
                }
            }else{
                res.status(404).send({updated:false,error:"No se encontro el artista"});
            }
        })
        .catch(error=>{
            res.status(200).send({updated:false,error,message:"No se pudo actualizar el artista"});
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
            res.status(404).send({founded:false,message:"Imagen no encontrada"})
        }
    });
}
function deleteArtist(req,res){
    var artistId=req.params.artistId;
    Artists.findById(artistId)
    .then(artist=>{
        if(artist){
            artist.remove()
              .then(()=>{
                if(artist.image=="default.png"){
                  res.status(200).send({deleted:true,fileDeleted:false,artist})
                }else{
                  var pathImageRemoved="./uploads/artists/images/"+artist.image;

                  fs.unlink(pathImageRemoved, (err) => {
                      if (err){
                          return res.status(200).send({deleted:true,fileDeleted:false,message:"No se elimino la imagen del artista",error:err})
                      }
                      res.status(200).send({deleted:true,fileDeleted:true,artist})
                    });
                }
              })
              .catch(error=>{
                res.status(500).send({deleted:false,error,message:"Ocurrio un error al eliminar el artista"})
              })
        }else{
            res.status(404).send({deleted:false,error,message:"No se pudo encontrar el artista"})
        }
    })
    .catch(error=>{
        res.status(404).send({deleted:false,message:"Artista no encontrado"})
    })
}
module.exports={
    getArtista,
    createArtist,
    getArtists,
    getArtistsForSearch,
    existeArtista,
    updateArtist,
    updateImageArtist,
    getImageArtist,
    deleteArtist
}
