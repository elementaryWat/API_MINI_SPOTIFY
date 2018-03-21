const mongoose=require("mongoose");
const Schema=mongoose.Schema;

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
module.exports=mongoose.model("Album",albumSchema);