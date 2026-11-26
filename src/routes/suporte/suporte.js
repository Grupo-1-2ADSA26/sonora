var express = require("express");
var router = express.Router();
var suporteController = require("../../controllers/suporte/suporteController");

router.post("/registrar", (req, res) => suporteController.registrarLog(req, res));
router.get("/listar", (req, res) => suporteController.listarLogs(req, res));
router.get("/buscar/:idLog", (req, res) => suporteController.buscarPorId(req, res));
router.put("/status/:idLog", (req, res) => suporteController.atualizarStatus(req, res));
router.delete("/deletar/:idLog", (req, res) => suporteController.deletar(req, res));

router.get("/kpis", (req, res) => suporteController.buscarKpis(req, res));
router.get("/ocorrencias-hora", (req, res) => suporteController.buscarOcorrenciasPorHora(req, res));
router.get("/ocorrencias-dia", (req, res) => suporteController.buscarOcorrenciasPorDia(req, res));
router.get("/ocorrencias-tipo", (req, res) => suporteController.buscarOcorrenciasPorTipo(req, res));
router.get("/criticos", (req, res) => suporteController.buscarLogsCriticos(req, res));
router.get("/recentes", (req, res) => suporteController.buscarLogsRecentes(req, res));

module.exports = router;