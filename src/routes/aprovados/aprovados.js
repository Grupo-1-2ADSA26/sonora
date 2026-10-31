var express = require("express");
var router = express.Router();
var aprovadosController = require("../../controllers/aprovados/aprovadosController");

router.get("/aprovados/:idEmpresa", function (req, res) {
    aprovadosController.listarTodosParaFuncionario(req, res);
});

router.post("/enviar", function (req, res) {
    aprovadosController.enviarParaAprovados(req, res);
});

router.get("/verificar/:idEmpresa/:idArtista", function (req, res) {
    aprovadosController.verificarArtistaEnviado(req, res);
});

router.get("/listarTodos/:idEmpresa", function (req, res) {
    aprovadosController.listarTodosParaAdministrador(req, res);
});

module.exports = router;