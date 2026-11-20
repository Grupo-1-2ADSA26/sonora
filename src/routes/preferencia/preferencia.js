var express = require("express");
var router = express.Router();

var preferenciaController = require(
    "../../controllers/preferencia/preferenciaController"
);

router.get("/:idEmpresa", function (req, res) {
    preferenciaController.listar(req, res);
});

router.put("/:idEmpresa", function (req, res) {
    preferenciaController.salvar(req, res);
});

router.get("/artistas/:idEmpresa", function (req, res) {
    preferenciaController.listarArtistasRecomendados(req, res);
});

module.exports = router;
