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

function buscarDestinatarios(idEmpresa, tipoNotificacao) {
    const tiposPermitidos = [
        "evento_criado",
        "evento_atualizado",
        "evento_cancelado",
        "evento_proximo",
        "artista_sugerido",
        "artista_aprovado",
        "artista_rejeitado",
        "analise_concluida"
    ];

    if (!tiposPermitidos.includes(tipoNotificacao)) {
        return Promise.reject(new Error("Tipo de notificação inválido."));
    }

    var instrucaoSql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.id_cargo
        FROM usuario u
        JOIN notificacao n
            ON u.id_usuario = n.id_usuario
        WHERE u.id_empresa = ?
          AND u.id_cargo IN (1, 2)
          AND n.${tipoNotificacao} = TRUE;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarEventosProximos() {
    var instrucaoSql = `
        SELECT
            e.id_evento,
            e.nome AS nome_evento,
            e.data_evento,
            e.local_evento,
            u.id_usuario,
            u.nome AS nome_usuario,
            u.email
        FROM evento e
        JOIN usuario u
            ON u.id_empresa = e.id_empresa
        JOIN notificacao n
            ON n.id_usuario = u.id_usuario
        WHERE e.data_evento = DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          AND u.id_cargo IN (1, 2)
          AND n.evento_proximo = TRUE;
    `;

    return database.executar(instrucaoSql);
}

function buscarAdministradores(idEmpresa, tipoNotificacao) {
    const tiposPermitidos = [
        "artista_sugerido"
    ];

    if (!tiposPermitidos.includes(tipoNotificacao)) {
        return Promise.reject(new Error("Tipo de notificação inválido."));
    }

    var instrucaoSql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.id_cargo
        FROM usuario u
        JOIN notificacao n
            ON u.id_usuario = n.id_usuario
        WHERE u.id_empresa = ?
          AND u.id_cargo = 1
          AND n.${tipoNotificacao} = TRUE;
    `;

    return database.executar(instrucaoSql, [idEmpresa]);
}

function buscarFuncionarioSugestao(idEmpresa, idArtista, tipoNotificacao) {
    const tiposPermitidos = [
        "artista_aprovado",
        "artista_rejeitado"
    ];

    if (!tiposPermitidos.includes(tipoNotificacao)) {
        return Promise.reject(new Error("Tipo de notificação inválido."));
    }

    var instrucaoSql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.id_cargo
        FROM artista_aprovado aa
        JOIN usuario u
            ON aa.id_usuario = u.id_usuario
        JOIN notificacao n
            ON u.id_usuario = n.id_usuario
        WHERE aa.id_empresa = ?
          AND aa.id_artista = ?
          AND n.${tipoNotificacao} = TRUE;
    `;

    return database.executar(instrucaoSql, [
        idEmpresa,
        idArtista
    ]);
}

function salvarMensagem(
    idUsuario,
    tipo,
    titulo,
    mensagem
) {
    var instrucaoSql = `
        INSERT INTO notificacao_mensagem (
            id_usuario,
            tipo,
            titulo,
            mensagem
        )
        VALUES (?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        idUsuario,
        tipo,
        titulo,
        mensagem
    ]);
}

module.exports = {
    buscarPorUsuario,
    salvar,
    buscarDestinatarios,
    buscarEventosProximos,
    buscarAdministradores,
    buscarFuncionarioSugestao,
    salvarMensagem
};