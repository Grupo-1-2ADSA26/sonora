var empresaModel = require("../../models/empresa/empresaModel");

function cadastrar(req, res) {
    var { nome, cnpj, senha, tipoEstabelecimento } = req.body;

    if (!nome || !cnpj || !senha || !tipoEstabelecimento) {
        res.status(400).send("Todos os campos são obrigatórios!");
    } else {
        empresaModel.cadastrar(nome, cnpj, senha, tipoEstabelecimento)
            .then(resultado => res.status(201).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

function listar(req, res) {
    empresaModel.listar()
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarPorId(req, res) {
    var idEmpresa = req.params.idEmpresa;
    empresaModel.buscarPorId(idEmpresa)
        .then(resultado => res.status(200).json(resultado[0] || {}))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function atualizar(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var { nome, cnpj, senha, tipoEstabelecimento } = req.body;

    empresaModel.atualizar(idEmpresa, nome, cnpj, senha, tipoEstabelecimento)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function deletar(req, res) {
    var idEmpresa = req.params.idEmpresa;
    empresaModel.deletar(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function autenticar(req, res) {
    var { emailServer, senhaServer } = req.body;

    if (!emailServer || !senhaServer) {
        res.status(400).send("E-mail e senha são obrigatórios!");
    } else {
        empresaModel.autenticar(emailServer, senhaServer)
            .then(resultado => {
                if (resultado.length === 1) {
                    res.json(resultado[0]);
                } else if (resultado.length === 0) {
                    res.status(403).send("E-mail e/ou senha inválidos");
                } else {
                    res.status(500).send("Mais de um usuário encontrado!");
                }
            })
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    deletar,
    autenticar
};