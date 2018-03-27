const songRouter=require("express").Router();
const songController=require("../controllers/song");
const multer=require("multer");
const crypto=require("crypto");
const path=require("path");
var storageAudio = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads/songs')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);
    
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
})
const uploadAudio=multer({storage:storageAudio});

songRouter.get("/song/:songId",songController.getSong);
songRouter.get("/album/:albumId",songController.getSongs);
songRouter.get("/all",songController.getSongs);
songRouter.post("/create",uploadAudio.single("avatar"),songController.createSong);
songRouter.put("/update/:songId",songController.updateSong);
songRouter.get("/getAudioFile/:audioName",songController.getAudioSong);
songRouter.delete("/delete/:songId",songController.deleteSong);

module.exports=songRouter;