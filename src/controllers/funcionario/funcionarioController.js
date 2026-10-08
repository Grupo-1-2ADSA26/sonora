var funcionarioModel = require("../../models/funcionario/funcionarioModel");

function cadastrar(req, res) {
    var { nome, email, senha, idEmpresa, idCargo } = req.body;

    if (nome == undefined || email == undefined || idCargo == undefined || senha == undefined || idEmpresa == undefined) {
        res.status(400).send("Seu parâmetro está undefined!");
    } else {
        funcionarioModel.cadastrar(nome, email, senha, idEmpresa, idCargo)
            .then(resultado => res.status(201).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}



function listarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    funcionarioModel.listarPorEmpresa(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarPorId(req, res) {
    var idUsuario = req.params.idUsuario;
    funcionarioModel.buscarPorId(idUsuario)
        .then(resultado => res.status(200).json(resultado[0] || {}))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function atualizar(req, res) {
    var idUsuario = req.params.idUsuario;
    var { nome, email, senha, idCargo } = req.body;

    funcionarioModel.atualizar(idUsuario, nome, email, senha, idCargo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function deletar(req, res) {
    var idUsuario = req.params.idUsuario;
    funcionarioModel.deletar(idUsuario)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    deletar
};