var express = require("express");
var router = express.Router();
var artistaController = require("../../controllers/artista/artistaController");

router.get("/pesquisar", function (req, res) {
    artistaController.pesquisarArtista(req, res);
});

module.exports = router;