let express = require("express");
let router = express.Router();

let suporteController = require("../../controllers/suporte/suporteController");

// Exemplo de rotas para o módulo Suporte
router.post("/enviar-ticket", function (req, res) {
    suporteController.enviarTicket(req, res);
});

router.get("/logs/:idEmpresa", function (req, res) {
    suporteController.obterLogs(req, res);
});

module.exports = router;