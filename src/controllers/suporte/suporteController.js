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

function buscarKpis(req, res) {
    Promise.all([
        suporteModel.buscarKpis(),
        suporteModel.buscarEmpresasMonitoradas()
    ])
        .then(([kpis, empresas]) => {
            res.status(200).json({
                ocorrencias: kpis[0].ocorrencias,
                falhas_criticas: kpis[0].falhas_criticas,
                atrasos: kpis[0].atrasos,
                empresas: empresas[0].empresas
            });
        })
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarOcorrenciasPorHora(req, res) {
    var data = req.query.data;

    if (!data) {
        return res.status(400).send(
            "A data é obrigatória!"
        );
    }

    suporteModel.buscarOcorrenciasPorHora(data)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarOcorrenciasPorDia(req, res) {
    var { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
        return res.status(400).send(
            "As datas de início e fim são obrigatórias!"
        );
    }

    suporteModel.buscarOcorrenciasPorDia(
        dataInicio,
        dataFim
    )
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarOcorrenciasPorTipo(req, res) {
    var { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
        return res.status(400).send(
            "As datas de início e fim são obrigatórias!"
        );
    }

    suporteModel.buscarOcorrenciasPorTipo(
        dataInicio,
        dataFim
    )
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarLogsCriticos(req, res) {
    var { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
        return res.status(400).send(
            "As datas de início e fim são obrigatórias!"
        );
    }

    suporteModel.buscarLogsCriticos(
        dataInicio,
        dataFim
    )
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarLogsRecentes(req, res) {
    var { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
        return res.status(400).send(
            "As datas de início e fim são obrigatórias!"
        );
    }

    suporteModel.buscarLogsRecentes(
        dataInicio,
        dataFim
    )
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    registrarLog,
    listarLogs,
    buscarPorId,
    atualizarStatus,
    deletar,
    buscarKpis,
    buscarOcorrenciasPorHora,
    buscarOcorrenciasPorDia,
    buscarOcorrenciasPorTipo,
    buscarLogsCriticos,
    buscarLogsRecentes
};