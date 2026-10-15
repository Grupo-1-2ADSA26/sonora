var express = require("express");
var router = express.Router();
var eventoController = require("../../controllers/evento/eventoController");

router.post("/cadastrar", (req, res) => eventoController.cadastrar(req, res));

module.exports = router;