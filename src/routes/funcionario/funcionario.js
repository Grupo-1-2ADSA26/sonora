let express = require("express");
let router = express.Router();      

let funcionarioController = require("../../controllers/funcionario/funcionarioController");

router.get("/listar/:fkEmpresa", function (req, res) {
    funcionarioController.listar(req, res);
});

router.post("/cadastrar", function (req, res) {
    funcionarioController.cadastrar(req, res);
});


router.put("/atualizar/:idFuncionario", function (req, res) {
    funcionarioController.atualizar(req, res);
});

router.delete("/deletar/:idFuncionario", function (req, res) {
    funcionarioController.deletar(req, res);
});

router.get("/aprovados", function (req, res) {
    funcionarioController.listarAprovados(req, res);
});

router.get("/recomendacoes/:idFuncionario", function (req, res) {
    funcionarioController.obterRecomendacoes(req, res);
});

router.get("/perfil/:idFuncionario", function (req, res) {
    funcionarioController.exibirPerfil(req, res);
});

router.get("/listar/:idEmpresa", funcionarioController.listar)
router.post("/cadastrar", funcionarioController.cadastrar)
router.put("/editar/:id", funcionarioController.editar)
router.delete("/deletar/:id", funcionarioController.deletar)

module.exports = router;