var express = require("express");
var router = express.Router();
var artistaController = require("../../controllers/artista/artistaController");

router.get("/pesquisar", function (req, res) {
    artistaController.pesquisarArtista(req, res);
});

router.get("/pesquisarPorId/:idArtista", function (req, res) {
    artistaController.pesquisarArtistaPorId(req, res);
});

router.get("/kpis", function (req, res) {
    artistaController.obterKpis(req, res);
});

router.get("/maisOuvidos", function (req, res) {
    artistaController.obterArtistasMaisOuvidos(req, res);
});

router.get("/musicasMaisOuvidas", function (req, res) {
    artistaController.obterMusicasMaisOuvidas(req, res);
});

router.get("/engajamento", function (req, res) {
    artistaController.obterArtistasEngajamento(req, res);
});

router.get("/generos", function (req, res) {
    artistaController.obterGeneros(req, res);
});

module.exports = router;