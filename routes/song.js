const songRouter=require("express").Router();
const md_auth=require("../middlewares/authenticated");
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

songRouter.get("/song/:songId",md_auth.ensureAuth,songController.getSong);
songRouter.get("/album/:albumId",md_auth.ensureAuth,songController.getSongs);
songRouter.get("/all",md_auth.ensureAuth,songController.getSongs);
songRouter.post("/",[md_auth.ensureAuth,uploadAudio.single("avatar")],songController.createSong);
songRouter.put("/:songId",md_auth.ensureAuth,songController.updateSong);
songRouter.get("/getAudioFile/:audioName",md_auth.ensureAuth,songController.getAudioSong);
songRouter.delete("/delete/:songId",md_auth.ensureAuth,songController.deleteSong);

module.exports=songRouter;
