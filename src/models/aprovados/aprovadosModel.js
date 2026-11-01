var database = require("../../database/config");

function listarTodosParaFuncionario(idEmpresa) {
    var instrucaoSql = `
        SELECT
            u.nome AS criador,
            a.id_artista,
            a.nome AS nome_artista,
            a.genero AS genero,
            aa.status_aprovacao,
            e.nome AS nome_evento,
            ROUND(AVG(ms.energy), 2) AS energy,
            ROUND(AVG(ms.danceability), 2) AS danceability,
            ROUND(AVG(ms.tempo)) AS bpm,
            LEAST(ROUND(AVG(ms.streams) / 500000), 100) AS popularidade
        FROM artista_aprovado aa
        JOIN usuario u ON aa.id_usuario = u.id_usuario
        JOIN artista a ON aa.id_artista = a.id_artista
        JOIN evento e ON aa.id_evento = e.id_evento
        LEFT JOIN musica m ON a.id_artista = m.id_artista
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE aa.id_empresa = ?
        GROUP BY u.id_usuario, u.nome, a.id_artista, a.nome, a.genero,
                 aa.status_aprovacao, e.nome, aa.data_atualizacao
        ORDER BY aa.data_atualizacao DESC;
    `;
    return database.executar(instrucaoSql, [idEmpresa]);
}

function sugerirArtista(idEmpresa, idArtista, idUsuario, idEvento) {
    var instrucaoSql = `
        INSERT INTO artista_aprovado
            (id_empresa, id_artista, id_usuario, id_evento, status_aprovacao)
        VALUES (?, ?, ?, ?, 'SUGERIDO');
    `;
    return database.executar(instrucaoSql, [idEmpresa, idArtista, idUsuario, idEvento]);
}

function atualizarStatus(idEmpresa, idArtista, status) {
    var instrucaoSql = `
        UPDATE artista_aprovado
        SET status_aprovacao = ?,
            status_visualizacao = IF(? = 'ANALISE_CONCLUIDA', 'VISUALIZADO', status_visualizacao)
        WHERE id_empresa = ? AND id_artista = ?;
    `;
    return database.executar(instrucaoSql, [status, status, idEmpresa, idArtista]);
}

function enviarParaAprovados(idEmpresa, idArtista, idUsuario, idEvento) {
    var instrucaoSql = `
        INSERT INTO artista_aprovado (id_empresa, id_artista, id_usuario, id_evento)
        VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idEmpresa, idArtista, idUsuario, idEvento]);
}

function verificarArtistaEnviado(idEmpresa, idArtista) {
    var instrucaoSql = `
        SELECT id_artista
        FROM artista_aprovado
        WHERE id_empresa = ? AND id_artista = ?;
    `;
    return database.executar(instrucaoSql, [idEmpresa, idArtista]);
}

function listarTodosParaAdministrador(idEmpresa) {
    var instrucaoSql = `
        SELECT
            u.nome AS criador,
            a.id_artista,
            a.nome AS nome_artista,
            a.genero AS genero,
            aa.status_aprovacao,
            aa.status_visualizacao,
            aa.data_atualizacao,
            e.nome AS nome_evento
        FROM artista_aprovado aa
        JOIN usuario u
            ON aa.id_usuario = u.id_usuario
        JOIN artista a
            ON aa.id_artista = a.id_artista
        JOIN evento e
            ON aa.id_evento = e.id_evento
        WHERE aa.id_empresa = ${idEmpresa}
        GROUP BY
            u.nome,
            a.id_artista,
            a.nome,
            a.genero,
            aa.status_aprovacao,
            aa.status_visualizacao,
            aa.data_atualizacao,
            e.nome
        ORDER BY aa.data_atualizacao DESC;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    listarTodosParaFuncionario,
    enviarParaAprovados,
    verificarArtistaEnviado,
    listarTodosParaAdministrador,
    sugerirArtista,
    atualizarStatus
};