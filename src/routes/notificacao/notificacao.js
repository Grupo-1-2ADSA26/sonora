var express = require("express");
var router = express.Router();

var notificacaoController = require("../../controllers/notificacao/notificacaoController");

router.post("/enviar", function(req, res) {
    notificacaoController.enviar(req, res);
});

router.get("/:idUsuario", function(req, res) {
    notificacaoController.buscarPorUsuario(req, res);
});

router.put("/:idUsuario", function(req, res) {
    notificacaoController.salvar(req, res);
});

module.exports = router;