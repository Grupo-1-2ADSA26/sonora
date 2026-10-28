var express = require("express");
var router = express.Router();
var funcionarioController = require("../../controllers/funcionario/funcionarioController");

router.post("/autenticar" , function(req, res){
    funcionarioController.autenticar(req, res)
})

router.post("/cadastrar", (req, res) => funcionarioController.cadastrar(req, res));
router.get("/empresa/:idEmpresa", (req, res) => funcionarioController.listarPorEmpresa(req, res));
router.get("/perfil/:idUsuario", (req, res) => funcionarioController.buscarPorId(req, res));
router.put("/atualizar/:idUsuario", (req, res) => funcionarioController.atualizar(req, res));
router.delete("/deletar/:idUsuario", (req, res) => funcionarioController.deletar(req, res));
router.get("/analise-artista/:idArtista/:idEmpresa", function (req, res) {
    funcionarioController.carregarAnaliseArtista(req, res);
});

module.exports = router;