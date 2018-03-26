const albumRouter=require("express").Router();
const albumController=require("../controllers/album");

const multer=require("multer");
const crypto=require("crypto");
const path=require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads/albums/images')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);
    
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
})
const upload=multer({storage});

albumRouter.get("/album/:albumId",albumController.getAlbum);
albumRouter.post("/create",albumController.createAlbum);
albumRouter.get("/artist/:artistId",albumController.getAlbums);
albumRouter.get("/all",albumController.getAlbums);
albumRouter.put("/update/:albumId",albumController.updateAlbum);
albumRouter.delete("/delete/:albumId",albumController.deleteAlbum);
albumRouter.post("/uploadImageAlbum/:albumId",upload.single("avatar"),albumController.updateImageAlbum);

module.exports=albumRouter;