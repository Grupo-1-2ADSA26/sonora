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

    if (senha == "") {
        funcionarioModel.atualizarSemSenha(idUsuario, nome, email, idCargo)
            .then(resultado => res.status(200).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    } else {
        funcionarioModel.atualizar(idUsuario, nome, email, senha, idCargo)
            .then(resultado => res.status(200).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

function deletar(req, res) {
    var idUsuario = req.params.idUsuario;
    funcionarioModel.deletar(idUsuario)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu e-mail está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        funcionarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticacao) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticacao.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticacao)}`);

                    if (resultadoAutenticacao.length == 1) {
                        res.json({
                            id_usuario: resultadoAutenticacao[0].id_usuario,
                            nome_usuario: resultadoAutenticacao[0].nome_usuario,
                            email: resultadoAutenticacao[0].email,
                            id_empresa: resultadoAutenticacao[0].id_empresa,
                            nome_empresa: resultadoAutenticacao[0].razao_social,
                            id_cargo: resultadoAutenticacao[0].id_cargo,
                            nome_cargo: resultadoAutenticacao[0].nome_cargo
                        });
                    } else if (resultadoAutenticacao.length == 0) {
                        res.status(403).send("E-mail e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo e-mail e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarShowMaisProximo(req, res) {
    var idEmpresa = req.params.idEmpresa;
    funcionarioModel.buscarShowMaisProximo(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarGeneroPredominante(req, res) {
    var idEmpresa = req.params.idEmpresa;
    funcionarioModel.buscarGeneroPredominante(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarArtistasPendentesTotal(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    funcionarioModel.buscarArtistasPendentesTotal(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado[0] || { pendentes: 0, total: 0 }))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarArtistasPorEvento(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    funcionarioModel.buscarArtistasPorEvento(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarImportanciaEvento(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    funcionarioModel.buscarImportanciaEvento(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarAprovacoesMensais(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var periodo = req.query.periodo || 'todos';
    funcionarioModel.buscarAprovacoesMensais(idEmpresa, periodo)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    deletar,
    autenticar,
    buscarShowMaisProximo,
    buscarGeneroPredominante,
    buscarArtistasPendentesTotal,
    buscarArtistasPorEvento,
    buscarImportanciaEvento,
    buscarAprovacoesMensais
};