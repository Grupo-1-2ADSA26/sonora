var aprovadosModel = require("../../models/aprovados/aprovadosModel");

function listarTodosParaFuncionario(req, res) {
    var idEmpresa = req.params.idEmpresa;

    aprovadosModel.listarTodosParaFuncionario(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.error("Erro ao buscar aprovados:", erro);
            res.status(500).json(erro);
        });
}

function enviarParaAprovados(req, res) {
    var idEmpresa = req.body.idEmpresa;
    var idArtista = req.body.idArtista;
    var idUsuario = req.body.idUsuario;
    var idEvento = req.body.idEvento;

    aprovadosModel.enviarParaAprovados(idEmpresa, idArtista, idUsuario, idEvento)
        .then(function (resultado) {
            res.status(201).json({
                mensagem: "Artista enviado para aprovação com sucesso!",
                resultado: resultado
            });
        })
        .catch(function (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensagem: "Este artista já foi enviado." });
            }

            console.error("Erro ao enviar artista para aprovação:", erro);
            res.status(500).json({ mensagem: "Erro ao enviar artista para aprovação." });
        });
}

function verificarArtistaEnviado(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idArtista = req.params.idArtista;

    aprovadosModel.verificarArtistaEnviado(idEmpresa, idArtista)
        .then(function (resultado) {
            res.status(200).json({
                jaEnviado: resultado.length > 0
            });
        })
        .catch(function (erro) {
            console.error("Erro ao verificar artista:", erro);
            res.status(500).json(erro);
        });
}

function listarTodosParaAdministrador(req, res) {
    var idEmpresa = req.params.idEmpresa;

    aprovadosModel.listarTodosParaAdministrador(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.error("Erro ao buscar artistas:", erro);
            res.status(500).json(erro);
        });
}

var STATUS_PERMITIDOS = ["ANALISE_CONCLUIDA", "APROVADO", "REPROVADO"];

function sugerirArtista(req, res) {
    var { idEmpresa, idArtista, idUsuario, idEvento } = req.body;

    if (!idEmpresa || !idArtista || !idUsuario || !idEvento) {
        return res.status(400).json({ mensagem: "Dados incompletos." });
    }

    aprovadosModel.sugerirArtista(idEmpresa, idArtista, idUsuario, idEvento)
        .then(function () {
            res.status(201).json({ mensagem: "Artista sugerido para a empresa com sucesso!" });
        })
        .catch(function (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ mensagem: "Este artista já foi enviado." });
            }
            console.error("Erro ao sugerir artista:", erro);
            res.status(500).json(erro);
        });
}

function atualizarStatus(req, res) {
    var { idEmpresa, idArtista, status } = req.body;

    if (!idEmpresa || !idArtista || !STATUS_PERMITIDOS.includes(status)) {
        return res.status(400).json({ mensagem: "Dados inválidos para atualizar o status." });
    }

    aprovadosModel.atualizarStatus(idEmpresa, idArtista, status)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensagem: "Registro não encontrado." });
            }
            res.status(200).json({ mensagem: "Status atualizado com sucesso!" });
        })
        .catch(function (erro) {
            console.error("Erro ao atualizar status:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarTodosParaFuncionario,
    enviarParaAprovados,
    verificarArtistaEnviado,
    listarTodosParaAdministrador,
    atualizarStatus,
    sugerirArtista
};