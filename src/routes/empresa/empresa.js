var express = require("express");
var router = express.Router();
var empresaController = require("../../controllers/empresa/empresaController");

router.post("/cadastrar", (req, res) => empresaController.cadastrar(req, res));
router.get("/listar", (req, res) => empresaController.listar(req, res));
router.get("/buscar/:idEmpresa", (req, res) => empresaController.buscarPorId(req, res));
router.put("/atualizar/:idEmpresa", (req, res) => empresaController.atualizar(req, res));
router.delete("/deletar/:idEmpresa", (req, res) => empresaController.deletar(req, res));
router.post("/autenticar", (req, res) => empresaController.autenticar(req, res));

module.exports = router;