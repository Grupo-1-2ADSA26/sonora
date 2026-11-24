
const express = require("express");
const router = express.Router();

const monitoramentoController =
    require("../../controllers/spring/monitoramentoController");

router.get(
    "/atual",
    monitoramentoController.buscarAtual
);

router.get(
    "/historico",
    monitoramentoController.buscarHistorico
);

module.exports = router;
