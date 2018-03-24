const mongoose=require("mongoose");
const Schema=mongoose.Schema;

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
module.exports=mongoose.model("Artist",artistSchema);