const albumRouter=require("express").Router();
const albumController=require("../controllers/album");

albumRouter.get("/album/:albumId",albumController.getAlbum);
albumRouter.post("/create",albumController.createAlbum);
albumRouter.get("/artist/:artistId",albumController.getAlbums);
albumRouter.get("/all",albumController.getAlbums);
albumRouter.put("/update/:albumId",albumController.updateAlbum);
albumRouter.delete("/delete/:albumId",albumController.deleteAlbum);

module.exports=albumRouter;