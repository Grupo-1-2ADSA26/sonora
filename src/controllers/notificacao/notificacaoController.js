var notificacaoModel = require("../../models/notificacao/notificacaoModel");
const springService = require("../../services/spring/springService");

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

async function enviar(req, res) {
    try {
        const {
            idEmpresa,
            idArtista,
            tipoNotificacao,
            assunto,
            mensagem
        } = req.body;

        let destinatarios;

        if (tipoNotificacao === "artista_sugerido") {
            destinatarios =
                await notificacaoModel.buscarAdministradores(
                    idEmpresa,
                    tipoNotificacao
                );
        } else if (
            tipoNotificacao === "artista_aprovado" ||
            tipoNotificacao === "artista_rejeitado"
        ) {
            destinatarios =
                await notificacaoModel.buscarFuncionarioSugestao(
                    idEmpresa,
                    idArtista,
                    tipoNotificacao
                );
        } else {
            destinatarios =
                await notificacaoModel.buscarDestinatarios(
                    idEmpresa,
                    tipoNotificacao
                );
        }

        if (destinatarios.length === 0) {
            return res.status(200).json({
                mensagem: "Nenhum usuário possui essa notificação ativada.",
                quantidade: 0
            });
        }

        for (const usuario of destinatarios) {
            const mensagemPersonalizada =
                `Olá, ${usuario.nome}!\n\n` +
                `Temos uma nova atualização na Sonora.\n\n` +
                `${mensagem}` +
                `\nAcesse a plataforma para conferir todos os detalhes e acompanhar as novidades.\n\n` +
                `Atenciosamente,\n` +
                `Equipe Sonora`;

            await springService.enviarNotificacao({
                destinatarios: [usuario.email],
                assunto: assunto,
                mensagem: mensagemPersonalizada
            });

            await notificacaoModel.salvarMensagem(
                usuario.id_usuario,
                tipoNotificacao,
                assunto,
                mensagemPersonalizada
            );
        }

        res.status(200).json({
            mensagem: "Notificação enviada com sucesso.",
            quantidade: destinatarios.length
        });

    } catch (erro) {
        console.error(erro);

        res.status(502).json({
            mensagem: "Erro ao enviar notificação"
        });
    }
}

async function enviarEventosProximos() {
    try {
        const eventos =
            await notificacaoModel.buscarEventosProximos();

        for (const evento of eventos) {
            const mensagem =
                `O evento ${evento.nome_evento} está se aproximando.\n\n` +
                `Data do evento: ${evento.data_evento}\n` +
                `Local: ${evento.local_evento}\n\n` +
                `Faltam apenas 3 dias para a realização do evento.`;

            await springService.enviarNotificacao({
                destinatarios: [evento.email],
                assunto: "Evento se aproxima na Sonora",
                mensagem: mensagem
            });
        }

        console.log(
            "Notificações de eventos próximos processadas:",
            eventos.length
        );

    } catch (erro) {
        console.error(
            "Erro ao enviar notificações de eventos próximos:",
            erro
        );
    }
}

module.exports = {
    buscarPorUsuario,
    salvar,
    enviar,
    enviarEventosProximos
};