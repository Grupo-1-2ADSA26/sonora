var eventoModel = require("../../models/evento/eventoModel");

function cadastrar(req, res) {
    var {nome, descricao, data_evento, local_evento, status_evento, id_empresa} = req.body;

    if (
        !nome ||
        !descricao ||
        !data_evento ||
        !local_evento ||
        !status_evento ||
        !id_empresa
    ) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    eventoModel.cadastrar(nome, descricao, data_evento, local_evento, status_evento, id_empresa)
    .then(resultado => res.status(200).json(resultado))
    .catch(erro => res.status(500).json(erro.sqlMessage));
}

function listarPorEmpresa(req, res) {
    var id_empresa = req.params.id_empresa;

    eventoModel.listarPorEmpresa(id_empresa)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    var id_evento = req.params.id_evento;

    var { nome, descricao, data_evento, local_evento, status_evento } = req.body;

    if (
        !nome ||
        !descricao ||
        !data_evento ||
        !local_evento ||
        !status_evento
    ) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    eventoModel.atualizar(id_evento, nome, descricao, data_evento, local_evento, status_evento)
    .then(resultado => {
        res.status(200).json(resultado);
    })
    .catch(erro => {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function excluir(req, res) {
    var id_evento = req.params.id_evento;

    eventoModel.excluir(id_evento)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    atualizar,
    excluir
};