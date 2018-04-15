const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const songSchema=require("./song");
const songController=require("../controllers/song");

const albumSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        min:1950,
        max:2050,
        required:true
    },
    image:{
        type:String,
        default:'images/album.jpg'
    },
    artist:{
        type:Schema.Types.ObjectId,
        ref:'Artist',
        required:true
    }
},{
    timestamps:true
});
albumSchema.pre("remove",function(next){
    songSchema.find({album:this._id}).exec()
      .then(songsFromAlbums=>{
        if(songsFromAlbums.length>0){
          for(let song of songsFromAlbums){
            songController.deleteSongCBDB(song._id);
          }
        }
      })
    next();
})
module.exports=mongoose.model("Album",albumSchema);
