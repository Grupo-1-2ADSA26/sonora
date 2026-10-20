var express = require("express");
var router = express.Router();
var suporteController = require("../../controllers/suporte/suporteController");

router.post("/registrar", (req, res) => suporteController.registrarLog(req, res));
router.get("/listar", (req, res) => suporteController.listarLogs(req, res));
router.get("/buscar/:idLog", (req, res) => suporteController.buscarPorId(req, res));
router.put("/status/:idLog", (req, res) => suporteController.atualizarStatus(req, res));
router.delete("/deletar/:idLog", (req, res) => suporteController.deletar(req, res));

module.exports = router;