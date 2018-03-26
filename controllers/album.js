const Albums=require("../models/album");

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
            res.status(500).send({created:false,error:"No se ha podido crear el album en la base de datos"});            
        }
    })
    .catch(error=>{
        res.status(500).send({created:true,error});        
    })
}
function getAlbums(req,res){
    var artistId=req.params.artistId;
    if (artistId){
        var albums=Albums.find({artist:artistId}).sort('year');
    }else{
        var albums=Albums.find().sort('title');
    }
    albums.populate({path:'artist'}).exec()
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
    if(req.files){
        var albumId=req.params.albumId;
        var imagePath=req.files.imageAlbum.path;
        var splitPath=imagePath.split("\\");
        var imageName=splitPath[3];

        var nameSplit=imageName.split('\.');
        var extImage=nameSplit[1];
        if(extImage=="jpg" || extImage=="png" || extImage=="gif"){
            Albums.findByIdAndUpdate(albumId,{$set:{image:imageName}},{new:true})
            .then(albumWithImageUpdated=>{
                if(albumWithImageUpdated){
                    res.status(200).send({updated:true,album:albumWithImageUpdated});
                }else{
                    res.status(404).send({updated:false,error:"No se ha encontrado el album"});
                }                                     
            })
            .catch(error=>{
                res.status(500).send({updated:false,error});
            });
        }
    }else{
        res.status(500).send({updated:false,error:"Archivo no subido correctamente"});
    }
}
function deleteAlbum(req,res){
    var albumId=req.params.albumId;
    Albums.findByIdAndRemove(albumId)
    .then(albumRemoved=>{
        if(albumRemoved){
            res.status(200).send({deleted:true,album:albumRemoved});                        
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
    deleteAlbum
}