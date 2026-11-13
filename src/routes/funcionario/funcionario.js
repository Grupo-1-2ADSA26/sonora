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

module.exports = router;