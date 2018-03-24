const Artist=require("../models/artist");
const mongoosePagination=require("mongoose-pagination");

function getArtista(req,res){
    var artistId=req.params.artistId;
    Artist.findById(artistId)
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
    var page=req.params.page || 1;
    var artistsPerPage=5;
    Artist.find({}).sort('name').paginate(page,artistsPerPage,(err,artists,totalDocs)=>{
        if (err){
            res.status(500).send({err,message:"Ocurrio un error al buscar en la base de datos"})
        }else{
            var numbP=Math.trunc(totalDocs/artistsPerPage);
            numbP=((totalDocs%artistsPerPage)>0)?(numbP+1):numbP;
            if(artists){
                res.status(200).send({
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
    Artist.create(req.body)
    .then(artist=>{
        res.status(200).send({artistCreated:artist})
    })
    .catch(err=>{
        res.status(500).send({error:err});
    })
}
module.exports={
    getArtista,
    createArtist,
    getArtists
}