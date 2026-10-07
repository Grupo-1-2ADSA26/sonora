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

router.put("/atualizar/:idEmpresa", function (req, res) {
    empresaController.atualizar(req, res);
});

router.post("/cadastrar", function (req, res) {
    empresaController.cadastrar(req, res);
})

router.get("/buscar", function (req, res) {
    empresaController.buscarPorCnpj(req, res);
});

router.get("/buscar/:id", function (req, res) {
  empresaController.buscarPorId(req, res);
});

router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

module.exports = router;