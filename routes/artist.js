const routerArtist=require("express").Router();
const ArtistController=require("../controllers/artist");
const multer=require("multer");
const crypto=require("crypto");
const path=require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads/artists/images')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err);
    
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
})
const upload=multer({storage});

const mdAuth=require("../middlewares/authenticated");

routerArtist.get("/artist/:artistId",mdAuth.ensureAuth,ArtistController.getArtista);
routerArtist.post("/create",mdAuth.ensureAuth,ArtistController.createArtist);
routerArtist.get('/list/:page?',mdAuth.ensureAuth,ArtistController.getArtists);
routerArtist.put('/update/:artistId',mdAuth.ensureAuth,ArtistController.updateArtist);
routerArtist.delete('/delete/:artistId',mdAuth.ensureAuth,ArtistController.deleteArtist);
routerArtist.post('/uploadImageArtist/:artistId',[mdAuth.ensureAuth,upload.single("avatar")],ArtistController.uploadImageArtist);
routerArtist.get('/getImageArtist/:imageArtist',mdAuth.ensureAuth,ArtistController.getImageArtist);

module.exports=routerArtist