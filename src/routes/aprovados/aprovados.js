var express = require("express");
var router = express.Router();
var aprovadosController = require("../../controllers/aprovados/aprovadosController");

router.get("/aprovados/:idEmpresa", function (req, res) {
    aprovadosController.listarAprovados(req, res);
});

router.post("/aprovados/enviar", function (req, res) {
    aprovadosController.enviarParaAprovados(req, res);
}) 

module.exports = router;