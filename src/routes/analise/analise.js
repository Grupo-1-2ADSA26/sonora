var express = require("express");
var router = express.Router();
var analiseController = require("../../controllers/analise/analiseController");

router.get("/artista/:idArtista/:idEmpresa", function (req, res) {
    analiseController.carregarAnaliseArtista(req, res);
});

module.exports = router;