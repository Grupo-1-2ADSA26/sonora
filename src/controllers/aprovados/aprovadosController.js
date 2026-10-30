var aprovadosModel = require("../../models/aprovados/aprovadosModel");

function listarAprovados(req, res) {
    var idEmpresa = req.params.idEmpresa;

    aprovadosModel.listarAprovadosPorEmpresa(idEmpresa)
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
            console.error("Erro ao enviar artista para aprovação:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarAprovados,
    enviarParaAprovados
};