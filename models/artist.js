const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const albumSchema=require("./album");
const albumController=require("../controllers/album");

const artistSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
artistSchema.pre("remove",function(next){
    albumSchema.find({artist:this._id}).exec()
      .then(albumsFromArtist=>{
        if(albumsFromArtist.length>0){
          for(let album of albumsFromArtist){
            albumController.deleteAlbumCBDB(album._id);
          }
        }
      })
    next();
})
module.exports=mongoose.model("Artist",artistSchema);
