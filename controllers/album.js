const Albums=require("../models/album");
const path=require("path");
const fs=require("fs");

function getAlbum(req,res){
    var albumId=req.params.albumId;
    Albums.findById(albumId).populate({path:"artist"}).exec()
    .then(album=>{
        if(album){
            res.status(200).send({founded:true, album})
        }else{
            res.status(404).send({founded:false, album:null})
        }
    })
    .catch(error=>{
        res.status(500).send({error})
    })
}
function createAlbum(req,res){
    Albums.create(req.body)
    .then(albumCreated=>{
        if(albumCreated){
            res.status(200).send({created:true,album:albumCreated});
        }else{
            res.status(500).send({created:false,message:"No se ha podido crear el album en la base de datos"});
        }
    })
    .catch(error=>{
        res.status(500).send({created:true,error});
    })
}
function getAlbums(req,res){
    var artistId=req.params.artistId;
    var error;
    if (artistId){
        var albums=Albums.find({artist:artistId}).sort('year');
        error="No hay albumes de este artista";
    }else{
        var albums=Albums.find().sort('title').populate({path:'artist'});
        error="No hay ningun album";
    }
    albums.exec()
    .then(albums=>{
        res.status(200).send({albums});
    })
    .catch(error=>{
        res.status(500).send({error});
    })
}
function updateAlbum(req,res){
    var albumId=req.params.albumId;
    var update=req.body;
    Albums.findByIdAndUpdate(albumId,{$set:update},{new:true})
    .then(albumUpdated=>{
        if (albumUpdated){
            res.status(200).send({updated:true,album:albumUpdated});
        }else{
            res.status(404).send({updated:false,error:"No se ha encontrado el album"});
        }
    })
    .catch(error=>{
        res.status(500).send({updated:false,error});
    })
}
function updateImageAlbum(req,res){
    if (!req.file) {
        console.log("No file received");
        return res.send({
          uploaded: false
        });

      } else {
        console.log('file received',req.file);
        Albums.findByIdAndUpdate(req.params.albumId,{$set:{image:req.file.filename}})
        .then(albumBeforeUpdate=>{
            if(albumBeforeUpdate){
                if(albumBeforeUpdate.image=="default.png"){
                  res.status(200).send({updated:true,image:req.file.filename,albumBeforeUpdate,message:"No se elimino la imagen anterior"});
                }else{
                  var pathOldImage="./uploads/albums/images/"+albumBeforeUpdate.image;
                  fs.exists(pathOldImage,(exists)=>{
                      if(exists){
                          fs.unlink(pathOldImage,(err)=>{
                              if(err){
                                  return res.status(500).send({updated:true,image:req.file.filename,artistBeforeUpdate,message:"No se pudo eliminar la imagen anterior"});
                              }
                              res.status(200).send({updated:true,image:req.file.filename,albumBeforeUpdate,message:"Se elimino la imagen anterior"});
                          })
                      }else{
                          res.status(200).send({updated:true,image:req.file.filename,albumBeforeUpdate,message:"No se encontro la imagen anterior"});
                      }
                  })
                }
            }else{
                res.status(200).send({updated:false});
            }
        })
        .catch(error=>{
            res.status(200).send({updated:false,error});
        })
      }
}
function getImageAlbum(req,res){
    var imageAlbum=req.params.albumImage;
    var dir = "./uploads/albums/images/"+imageAlbum;
    fs.exists(dir,(exists)=>{
        if(exists){
            return res.status(200).sendFile(path.resolve(dir));
        }else{
            return res.status(200).send({founded:false});
        }
    });
}
function deleteAlbum(req,res){
    var albumId=req.params.albumId;
    Albums.findByIdAndRemove(albumId)
    .then(albumRemoved=>{
        if(albumRemoved){
            var pathImageRemoved="./uploads/albums/images/"+albumRemoved.image;

            fs.unlink(pathImageRemoved, (err) => {
                if (err){
                    return res.status(200).send({deleted:true,fileDeleted:false,error:err})
                }
                res.status(200).send({deleted:true,fileDeleted:true,album:albumRemoved})
              });
        }else{
            res.status(404).send({deleted:false,error:"No se ha encontrado el album"});
        }
    })
    .catch(error=>{
        res.status(200).send({deleted:false,error});
    })
}
module.exports={
    getAlbum,
    createAlbum,
    getAlbums,
    updateAlbum,
    updateImageAlbum,
    getImageAlbum,
    deleteAlbum
}
