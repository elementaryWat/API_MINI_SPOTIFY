const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const albumSchema=require("./album");

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
    albumSchema.remove({artist:this._id}).exec();
    console.log("Se borraron todos los albumes del artista");
    next();
})
module.exports=mongoose.model("Artist",artistSchema);