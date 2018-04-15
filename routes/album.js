const albumRouter=require("express").Router();
const albumController=require("../controllers/album");
const md_auth=require("../middlewares/authenticated");

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

albumRouter.get("/album/:albumId",md_auth.ensureAuth,albumController.getAlbum);
albumRouter.post("/",md_auth.ensureAuth,albumController.createAlbum);
albumRouter.get("/artist/:artistId",md_auth.ensureAuth,albumController.getAlbums);
albumRouter.get("/list/:page",md_auth.ensureAuth,albumController.getAlbums);
albumRouter.put("/:albumId",md_auth.ensureAuth,albumController.updateAlbum);
albumRouter.delete("/:albumId",md_auth.ensureAuth,albumController.deleteAlbum);
albumRouter.post("/uploadAlbumImage/:albumId",[upload.single("avatar"),md_auth.ensureAuth],albumController.updateImageAlbum);
albumRouter.get("/getAlbumImage/:albumImage",albumController.getImageAlbum);

module.exports=albumRouter;
