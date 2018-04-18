const Songs=require("../models/song");
const path=require("path");
const fs=require("fs");
const mp3Duration=require("mp3-duration");
function getSong(req,res){
    var songId=req.params.songId;
    Songs.findById(songId).populate({path:'album'}).exec()
    .then(song=>{
        if(song){
            res.status(200).send({founded:true,song})
        }else{
            res.status(404).send({founded:false,error:"No se ha encontrado a la cancion"})
        }
    })
    .catch(error=>{
        res.status(500).send({founded:false,error})
    })

}
function getSongs(req,res){
    var albumId=req.params.albumId;
    var song;
    var message;
    if(albumId){
        song=Songs.find({album:albumId}).sort('number');
        message="No hay canciones en este album";
    }else{
        song=Songs.find().sort('name');
        message="No hay canciones";
    }
    song.populate({path:'album',populate:{path:'artist'}}).exec()
    .then(songs=>{
        res.status(200).send({songs});
    })
    .catch(error=>{
        res.status(500).send({founded:false,error})
    })
}
function getSongsForSearch(req,res){
    Songs.find().sort('name').populate({path:'album', populate:{path:'artist'}}).exec()
    .then(songs=>{
        res.status(200).send({songs});
    })
    .catch(error=>{
        res.status(500).send({founded:false,error})
    })
}
function getSongsCount(req, res){
  var albumId=req.params.albumId;
  Songs.count({album:albumId})
  .then(count=>{
    res.status(200).send({count});
  })
  .catch(error=>{
    res.status(500).send({error});
  })
}
function createSong(req,res){
    if(!req.file){
        return res.status(500).send({uploaded:false});
    }else{
        var Song=new Songs();
        Song.number=req.body.number;
        Song.name=req.body.name;
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
function updateSong(req,res){
    var songId=req.params.songId;
    var update=req.body;
    Songs.findByIdAndUpdate(songId,{$set:update},{new:true})
    .then(songUpdated=>{
        if(songUpdated){
            res.status(200).send({updated:true,song:songUpdated})
        }else{
            res.status(404).send({updated:false,error:"No se ha encontrado la cancion"})
        }
    })
    .catch(error=>{
        res.status(500).send({updated:false,error})
    })
}
function getAudioSong(req,res){
    var audioName=req.params.audioName;
    var audioPath="./uploads/songs/"+audioName;
    fs.exists(audioPath,(exists)=>{
        if(exists){
            res.status(200).sendFile(path.resolve(audioPath));
        }else{
            res.status(404).send({founded:false,error:"Audio no encontrado"});
        }
    })
}
function deleteSong(req,res){
    var songId=req.params.songId;
    Songs.findByIdAndRemove(songId)
    .then(songRemoved=>{
        if(songRemoved){
            var pathSongRemoved="./uploads/songs/"+songRemoved.file;

            fs.unlink(pathSongRemoved, (err) => {
                if (err){
                    return res.status(200).send({deleted:true,fileDeleted:false,error:err})
                }
                res.status(200).send({deleted:true,fileDeleted:true,song:songRemoved})
              });
        }else{
            res.status(404).send({deleted:false,error:"No se encontro la cancion"})
        }
    })
    .catch(error=>{
        res.status(500).send({deleted:false,error})
    })
}
function deleteSongCBDB(songId){
    Songs.findByIdAndRemove(songId)
    .then(songRemoved=>{
        if(songRemoved){
            var pathSongRemoved="./uploads/songs/"+songRemoved.file;
            fs.unlink(pathSongRemoved, (err) => {
                if (err){
                    return;
                }
              });
            console.log("Se ha eliminado la cancion correctamente");
        }else{
          console.log("No se encontro la cancion");
        }
    })
    .catch(error=>{
      console.log("Ocurrio un error al borrar la cancion");
    })
}
module.exports={
    getSong,
    getSongs,
    getSongsForSearch,
    getSongsCount,
    updateSong,
    getAudioSong,
    createSong,
    deleteSong,
    deleteSongCBDB
}
