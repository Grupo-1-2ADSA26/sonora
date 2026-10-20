var express = require("express");
var router = express.Router();
var aprovadosController = require("../../controllers/aprovados/aprovadosController");

router.get("/aprovados/:idEmpresa", function (req, res) {
    aprovadosController.listarAprovados(req, res);
});

module.exports = router;