var express = require("express");
var router = express.Router();
var eventoController = require("../../controllers/evento/eventoController");

router.post("/cadastrar", (req, res) => eventoController.cadastrar(req, res));

router.get("/listar/:id_empresa", (req, res) => eventoController.listarPorEmpresa(req, res));

router.put("/atualizar/:id_evento", (req, res) => eventoController.atualizar(req, res));

router.delete("/excluir/:id_evento", (req, res) => eventoController.excluir(req, res));

module.exports = router;