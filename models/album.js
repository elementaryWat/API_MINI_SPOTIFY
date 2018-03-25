const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const songSchemma=require("./song");
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
    songSchemma.remove({album:this._id}).exec();
    console.log("Se borraron todas las canciones del album");
    next();
})
module.exports=mongoose.model("Album",albumSchema);