var suporteModel = require("../../models/suporte/suporteModel");

function registrarLog(req, res) {
    var { tipo, mensagem, status } = req.body;

    if (!tipo || !mensagem || !status) {
        res.status(400).send("Campos tipo, mensagem e status são obrigatórios!");
    } else {
        suporteModel.registrarLog(tipo, mensagem, status)
            .then(resultado => res.status(201).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

function listarLogs(req, res) {
    suporteModel.listarLogs()
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarPorId(req, res) {
    var idLog = req.params.idLog;
    suporteModel.buscarPorId(idLog)
        .then(resultado => res.status(200).json(resultado[0] || {}))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function atualizarStatus(req, res) {
    var idLog = req.params.idLog;
    var { status } = req.body;

    if (!status) {
        res.status(400).send("O campo status é obrigatório!");
    } else {
        suporteModel.atualizarStatus(idLog, status)
            .then(resultado => res.status(200).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

function deletar(req, res) {
    var idLog = req.params.idLog;
    suporteModel.deletar(idLog)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    registrarLog,
    listarLogs,
    buscarPorId,
    atualizarStatus,
    deletar
};