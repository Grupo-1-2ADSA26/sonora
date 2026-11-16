var notificacaoModel = require("../../models/notificacao/notificacaoModel");

function buscarPorUsuario(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).json({
            mensagem: "ID do usuário inválido."
        });
    }

    notificacaoModel.buscarPorUsuario(idUsuario)
        .then(function(resultado) {
            if (resultado.length === 0) {
                return res.status(404).json({
                    mensagem: "Configurações de notificação não encontradas."
                });
            }

            res.json(resultado[0]);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function salvar(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).json({
            mensagem: "ID do usuário inválido."
        });
    }

    var configuracoes = req.body;

    notificacaoModel.salvar(
        idUsuario,
        configuracoes.evento_criado,
        configuracoes.evento_atualizado,
        configuracoes.evento_cancelado,
        configuracoes.evento_proximo,
        configuracoes.artista_sugerido,
        configuracoes.artista_aprovado,
        configuracoes.artista_rejeitado,
        configuracoes.analise_concluida
    )
        .then(function() {
            res.status(200).json({
                mensagem: "Configurações de notificação salvas com sucesso."
            });
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarPorUsuario,
    salvar
};