var express = require("express");
var router = express.Router();
var funcionarioController = require("../../controllers/funcionario/funcionarioController");

router.post("/cadastrar", (req, res) => funcionarioController.cadastrar(req, res));
router.get("/empresa/:idEmpresa", (req, res) => funcionarioController.listarPorEmpresa(req, res));
router.get("/buscar/:idUsuario", (req, res) => funcionarioController.buscarPorId(req, res));
router.put("/atualizar/:idUsuario", (req, res) => funcionarioController.atualizar(req, res));
router.delete("/deletar/:idUsuario", (req, res) => funcionarioController.deletar(req, res));

module.exports = router;