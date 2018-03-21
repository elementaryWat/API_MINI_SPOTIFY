const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const songSchema=new Schema({
    number:{
        type:Number,
        min:1,
        max:30,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    file:{
        type:String,
        required:true
    },
    album:{
        type:Schema.Types.ObjectId,
        ref:'Album',
        required:true
    }
},
{
    timestamps:true
});
module.exports=mongoose.model("Song",songSchema);