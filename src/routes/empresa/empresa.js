var express = require("express");
var router = express.Router();
var empresaController = require("../../controllers/empresa/empresaController");

router.post("/cadastrar", (req, res) => empresaController.cadastrar(req, res));
router.post("/validar-codigo", (req, res) => empresaController.validar_codigo(req, res));
router.put("/ativar-codigo/:idEmpresa", (req, res) => empresaController.ativar_codigo(req, res));
router.get("/listar", (req, res) => empresaController.listar(req, res));
router.get("/buscar/:idEmpresa", (req, res) => empresaController.buscarPorId(req, res));
router.put("/atualizar/:idEmpresa", (req, res) => empresaController.atualizar(req, res));
router.delete("/deletar/:idEmpresa", (req, res) => empresaController.deletar(req, res));

module.exports = router;