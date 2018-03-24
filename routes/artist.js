const routerArtist=require("express").Router();
const ArtistController=require("../controllers/artist");

const mdAuth=require("../middlewares/authenticated");

routerArtist.get("/:artistId",mdAuth.ensureAuth,ArtistController.getArtista);
routerArtist.post("/create",mdAuth.ensureAuth,ArtistController.createArtist);
routerArtist.post("/allArtists/:page?",mdAuth.ensureAuth,ArtistController.getArtists);

module.exports=routerArtist