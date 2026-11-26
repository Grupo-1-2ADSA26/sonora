var dashboardFuncionarioModel = require("../../models/dashboardFuncionario/dashboardFuncionarioModel");

function buscarShowMaisProximo(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    var inicio = req.query.inicio || null;
    var fim = req.query.fim || null;

    dashboardFuncionarioModel.buscarShowMaisProximo(idEmpresa, periodo, inicio, fim)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarGeneroPredominante(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    var inicio = req.query.inicio || null;
    var fim = req.query.fim || null;

    dashboardFuncionarioModel.buscarGeneroPredominante(idEmpresa, periodo, inicio, fim)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarArtistasPendentesTotal(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    var inicio = req.query.inicio || null;
    var fim = req.query.fim || null;

    dashboardFuncionarioModel.buscarArtistasPendentesTotal(idEmpresa, periodo, inicio, fim)
        .then(resultado => res.status(200).json(resultado[0] || { pendentes: 0, total: 0 }))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarArtistasPorEvento(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    var inicio = req.query.inicio || null;
    var fim = req.query.fim || null;

    dashboardFuncionarioModel.buscarArtistasPorEvento(idEmpresa, periodo, inicio, fim)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarImportanciaEvento(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    var inicio = req.query.inicio || null;
    var fim = req.query.fim || null;

    dashboardFuncionarioModel.buscarImportanciaEvento(idEmpresa, periodo, inicio, fim)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarShowsMensais(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    var inicio = req.query.inicio || null;
    var fim = req.query.fim || null;

    dashboardFuncionarioModel.buscarShowsMensais(idEmpresa, periodo, inicio, fim)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    buscarShowMaisProximo,
    buscarGeneroPredominante,
    buscarArtistasPendentesTotal,
    buscarArtistasPorEvento,
    buscarImportanciaEvento,
    buscarShowsMensais
};