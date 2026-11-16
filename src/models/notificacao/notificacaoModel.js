var database = require("../../database/config");

function buscarPorUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT
            id_usuario,
            evento_criado,
            evento_atualizado,
            evento_cancelado,
            evento_proximo,
            artista_sugerido,
            artista_aprovado,
            artista_rejeitado,
            analise_concluida
        FROM notificacao
        WHERE id_usuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function salvar(
    idUsuario,
    eventoCriado,
    eventoAtualizado,
    eventoCancelado,
    eventoProximo,
    artistaSugerido,
    artistaAprovado,
    artistaRejeitado,
    analiseConcluida
) {
    var instrucaoSql = `
        INSERT INTO notificacao (
            id_usuario,
            evento_criado,
            evento_atualizado,
            evento_cancelado,
            evento_proximo,
            artista_sugerido,
            artista_aprovado,
            artista_rejeitado,
            analise_concluida
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            evento_criado = VALUES(evento_criado),
            evento_atualizado = VALUES(evento_atualizado),
            evento_cancelado = VALUES(evento_cancelado),
            evento_proximo = VALUES(evento_proximo),
            artista_sugerido = VALUES(artista_sugerido),
            artista_aprovado = VALUES(artista_aprovado),
            artista_rejeitado = VALUES(artista_rejeitado),
            analise_concluida = VALUES(analise_concluida);
    `;

    return database.executar(instrucaoSql, [
        idUsuario,
        eventoCriado,
        eventoAtualizado,
        eventoCancelado,
        eventoProximo,
        artistaSugerido,
        artistaAprovado,
        artistaRejeitado,
        analiseConcluida
    ]);
}

module.exports = {
    buscarPorUsuario,
    salvar
};