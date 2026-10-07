const funcionarioModel = require("../../models/funcionario/funcionarioModel");

function listar(req, res) {
    const idEmpresa = req.params.fkEmpresa;

    if (!idEmpresa) {
        return res.status(400).send("ID da empresa é obrigatório!");
    }

    funcionarioModel.listar(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao listar usuários:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrar(req, res) {
    const { nomeServer, emailServer, senhaServer, fkEmpresaServer, idCargoServer } = req.body;

    if (!nomeServer || !emailServer || !senhaServer || !fkEmpresaServer || !idCargoServer) {
        return res.status(400).send("Preencha todos os campos obrigatórios!");
    }

    funcionarioModel.cadastrar(nomeServer, emailServer, senhaServer, fkEmpresaServer, idCargoServer)
        .then(resultado => res.status(201).json(resultado))
        .catch(erro => {
            console.error("Erro ao cadastrar usuário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    const idUsuario = req.params.idFuncionario;
    const { fkEmpresaServer, nomeServer, emailServer, idCargoServer, senhaServer } = req.body;

    if (!idUsuario || !fkEmpresaServer) {
        return res.status(400).send("IDs de usuário e empresa são obrigatórios!");
    }

    funcionarioModel.atualizar(idUsuario, fkEmpresaServer, nomeServer, emailServer, idCargoServer, senhaServer)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao atualizar usuário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletar(req, res) {
    const idUsuario = req.params.idFuncionario;
    const idEmpresa = req.body.fkEmpresaServer;

    if (!idUsuario || !idEmpresa) {
        return res.status(400).send("IDs de usuário e empresa são obrigatórios!");
    }

    funcionarioModel.deletar(idUsuario, idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao deletar usuário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    deletar
};