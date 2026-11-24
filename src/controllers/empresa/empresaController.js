var empresaModel = require("../../models/empresa/empresaModel");
var emailService = require("../../services/emailService");

function cadastrar(req, res) {
    var {
        razaoSocialServer,
        cnpjServer,
        idTipoEstabelecimentoServer,
        emailResponsavelServer
    } = req.body;

    if (
        !razaoSocialServer ||
        !cnpjServer ||
        !idTipoEstabelecimentoServer ||
        !emailResponsavelServer
    ) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    empresaModel.cadastrar(
        razaoSocialServer,
        cnpjServer,
        idTipoEstabelecimentoServer,
        emailResponsavelServer
    )
    .then(function (cadastro) {
        return emailService.enviarCodigoAtivacao(
            emailResponsavelServer,
            cadastro.codigoAtivacao
        )
        .then(function () {
            return res.status(201).json({
                cadastroRealizado: true,
                emailEnviado: true,
                mensagem: "Empresa cadastrada com sucesso! Verifique seu e-mail para obter o código de ativação."
            });
        })
        .catch(function (erroEmail) {
            console.error("Erro ao enviar e-mail:", erroEmail);

            return res.status(201).json({
                cadastroRealizado: true,
                emailEnviado: false,
                mensagem: "Empresa cadastrada, mas não foi possível enviar o e-mail de ativação."
            });
        });
    })
    .catch(function (erro) {
        console.error("Erro ao cadastrar empresa:", erro);

        return res.status(500).json({
            cadastroRealizado: false,
            mensagem: "Erro ao cadastrar empresa."
        });
    });
}

function validar_codigo(req, res) {
    var codigo = req.body.codigo;

    empresaModel.validar_codigo(codigo)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json({
                    valido: true,
                    idEmpresa: resultado[0].id_empresa
                });
            } else {
                res.status(404).json({
                    valido: false,
                    mensagem: "Código inválido ou já utilizado."
                });
            }
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json({
                erro: erro.sqlMessage || erro.message
            });
        });
}

function ativar_codigo(req, res) {
    const idEmpresa = req.params.idEmpresa;

    empresaModel.ativar_codigo(idEmpresa)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarPorId(req, res) {
    var idEmpresa = req.params.idEmpresa;

    empresaModel.buscarPorId(idEmpresa)
        .then(resultado => {
            res.status(200).json(resultado[0] || {});
        })
        .catch(erro => {
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    var idEmpresa = req.params.idEmpresa;

    var {
        razaoSocial,
        cnpj,
        idTipoEstabelecimento
    } = req.body;

    if (!razaoSocial || !cnpj || !idTipoEstabelecimento) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    empresaModel.atualizar(
        idEmpresa,
        razaoSocial,
        cnpj,
        idTipoEstabelecimento
    )
    .then(resultado => {
        res.status(200).json(resultado);
    })
    .catch(erro => {
        res.status(500).json(erro.sqlMessage);
    });
}

function deletar(req, res) {
    var idEmpresa = req.params.idEmpresa;

    empresaModel.deletar(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    cadastrar,
    validar_codigo,
    ativar_codigo,
    buscarPorId,
    atualizar,
    deletar
};