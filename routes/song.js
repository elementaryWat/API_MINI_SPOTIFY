const songRouter=require("express").Router();
const songController=require("../controllers/song");
const multer=require("multer");
const crypto=require("crypto");
const path=require("path");
var storageAudio = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads/songs/songs')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);
    
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
})
const uploadAudio=multer({storage:storageAudio});

songRouter.get("/",songController.getSong);
songRouter.post("/create",uploadAudio.single("avatar"),songController.createSong);

module.exports=songRouter;