const routerArtist=require("express").Router();
const ArtistController=require("../controllers/artist");
const multipart=require("connect-multiparty");
const md_upload=multipart({uploadDir:"./uploads/artists/images"})

const mdAuth=require("../middlewares/authenticated");

routerArtist.get("/:artistId",mdAuth.ensureAuth,ArtistController.getArtista);
routerArtist.post("/create",mdAuth.ensureAuth,ArtistController.createArtist);
routerArtist.get('/artists/:page?',mdAuth.ensureAuth,ArtistController.getArtists);
routerArtist.put('/update/:artistId',mdAuth.ensureAuth,ArtistController.updateArtist);
routerArtist.delete('/delete/:artistId',mdAuth.ensureAuth,ArtistController.deleteArtist);
routerArtist.post('/uploadImageArtist/:artistId',[mdAuth.ensureAuth,md_upload],ArtistController.uploadImageArtist);
routerArtist.get('/getImage/:imageName',mdAuth.ensureAuth,ArtistController.getImageArtist);

module.exports=routerArtist