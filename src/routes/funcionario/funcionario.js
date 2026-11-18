var express = require("express");
var router = express.Router();
var funcionarioController = require("../../controllers/funcionario/funcionarioController");

router.post("/autenticar", function(req, res) {
    funcionarioController.autenticar(req, res);
});

router.post("/cadastrar", function(req, res) {
    funcionarioController.cadastrar(req, res);
});

router.get("/empresa/:idEmpresa", function(req, res) {
    funcionarioController.listarPorEmpresa(req, res);
});

router.get("/perfil/:idUsuario", function(req, res) {
    funcionarioController.buscarPorId(req, res);
});

router.put("/atualizar/:idUsuario", function(req, res) {
    funcionarioController.atualizar(req, res);
});

router.delete("/deletar/:idUsuario", function(req, res) {
    funcionarioController.deletar(req, res);
});

router.get("/show-proximo/:idEmpresa", function (req, res) {
    funcionarioController.buscarShowMaisProximo(req, res);
});

router.get("/genero-predominante/:idEmpresa", function (req, res) {
    funcionarioController.buscarGeneroPredominante(req, res);
});

router.get("/artistas-pendentes-total/:idEmpresa", function (req, res) {
    funcionarioController.buscarArtistasPendentesTotal(req, res);
});

router.get("/artistas-por-evento/:idEmpresa", function (req, res) {
    funcionarioController.buscarArtistasPorEvento(req, res);
});

router.get("/importancia-evento/:idEmpresa", function (req, res) {
    funcionarioController.buscarImportanciaEvento(req, res);
});

router.get("/aprovacoes-mensais/:idEmpresa", function (req, res) {
    funcionarioController.buscarAprovacoesMensais(req, res);
});

module.exports = router;