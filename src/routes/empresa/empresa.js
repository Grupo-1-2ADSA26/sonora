let express = require("express");
let router = express.Router();

let empresaController = require("../../controllers/empresa/empresaController");

// Exemplo de rotas para o módulo Empresa
router.post("/cadastrar-funcionario", function (req, res) {
    empresaController.cadastrarFuncionario(req, res);
});

router.get("/listar-artistas", function (req, res) {
    empresaController.listarArtistas(req, res);
});

router.get("/dashboard/:idEmpresa", function (req, res) {
    empresaController.obterDadosDashboard(req, res);
});

module.exports = router;