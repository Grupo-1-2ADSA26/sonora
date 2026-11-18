var express = require("express");
var router = express.Router();
var dashboardFuncionarioController = require("../../controllers/dashboardFuncionario/dashboardFuncionarioController");

router.get("/show-proximo/:idEmpresa", function (req, res) {
    dashboardFuncionarioController.buscarShowMaisProximo(req, res);
});

router.get("/genero-predominante/:idEmpresa", function (req, res) {
    dashboardFuncionarioController.buscarGeneroPredominante(req, res);
});

router.get("/artistas-pendentes-total/:idEmpresa", function (req, res) {
    dashboardFuncionarioController.buscarArtistasPendentesTotal(req, res);
});

router.get("/artistas-por-evento/:idEmpresa", function (req, res) {
    dashboardFuncionarioController.buscarArtistasPorEvento(req, res);
});

router.get("/importancia-evento/:idEmpresa", function (req, res) {
    dashboardFuncionarioController.buscarImportanciaEvento(req, res);
});

router.get("/aprovacoes-mensais/:idEmpresa", function (req, res) {
    dashboardFuncionarioController.buscarAprovacoesMensais(req, res);
});

module.exports = router;