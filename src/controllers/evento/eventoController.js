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

function listarArtistasPorEvento(req, res) {
    var idEvento = Number(req.params.idEvento);
    var idEmpresa = Number(req.params.idEmpresa);

    if (!idEvento || isNaN(idEvento) || !idEmpresa || isNaN(idEmpresa)) {
        return res.status(400).json({
            mensagem: "ID do evento ou da empresa inválido."
        });
    }

    eventoModel.listarArtistasPorEvento(idEvento, idEmpresa)
        .then(function(resultado) {
            res.status(200).json(resultado);
        })
        .catch(function(erro) {
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
    listarArtistasPorEvento,
    atualizar,
    excluir
};