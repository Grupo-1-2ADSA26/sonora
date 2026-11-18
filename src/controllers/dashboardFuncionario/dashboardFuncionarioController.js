var dashboardFuncionarioModel = require("../../models/dashboardFuncionario/dashboardFuncionarioModel");

function buscarShowMaisProximo(req, res) {
    var idEmpresa = req.params.idEmpresa;
    dashboardFuncionarioModel.buscarShowMaisProximo(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarGeneroPredominante(req, res) {
    var idEmpresa = req.params.idEmpresa;
    dashboardFuncionarioModel.buscarGeneroPredominante(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarArtistasPendentesTotal(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    dashboardFuncionarioModel.buscarArtistasPendentesTotal(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado[0] || { pendentes: 0, total: 0 }))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarArtistasPorEvento(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    dashboardFuncionarioModel.buscarArtistasPorEvento(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarImportanciaEvento(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    dashboardFuncionarioModel.buscarImportanciaEvento(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarAprovacoesMensais(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    dashboardFuncionarioModel.buscarAprovacoesMensais(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    buscarShowMaisProximo,
    buscarGeneroPredominante,
    buscarArtistasPendentesTotal,
    buscarArtistasPorEvento,
    buscarImportanciaEvento,
    buscarAprovacoesMensais
};