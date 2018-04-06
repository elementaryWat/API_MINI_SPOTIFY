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
routerArtist.post("/",mdAuth.ensureAuth,ArtistController.createArtist);
routerArtist.post('/list/:page',mdAuth.ensureAuth,ArtistController.getArtists);
routerArtist.put('/:artistId',mdAuth.ensureAuth,ArtistController.updateArtist);
routerArtist.delete('/:artistId',mdAuth.ensureAuth,ArtistController.deleteArtist);
routerArtist.post('/uploadArtistImage/:artistId',[mdAuth.ensureAuth,upload.single("avatar")],ArtistController.updateImageArtist);
routerArtist.get('/getArtistImage/:artistImage',ArtistController.getImageArtist);

module.exports=routerArtist
