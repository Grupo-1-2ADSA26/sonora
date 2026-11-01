
var database = require("../../database/config");

function buscarPorNome(nome) {
    var instrucaoSql = `
        SELECT id_artista, nome, genero
        FROM artista
        WHERE nome LIKE ?
        LIMIT 1;
    `;

    return database.executar(instrucaoSql, [`%${nome}%`]);
}

function buscarPorId(idArtista) {
    var instrucaoSql = `
        SELECT id_artista, nome, genero
        FROM artista
        WHERE id_artista = ?;
    `;

    return database.executar(instrucaoSql, [idArtista]);
}

function buscarDadosArtista(idArtista) {
    var instrucaoSql = `
        SELECT
            a.genero AS genero_principal,
            AVG(ms.energy) AS media_energy,
            AVG(ms.danceability) AS media_danceability,
            AVG(ms.tempo) AS media_bpm,
            AVG(ms.streams) AS media_streams,
            COALESCE(SUM(ms.streams), 0) AS total_streams
        FROM artista a
        LEFT JOIN musica m
            ON m.id_artista = a.id_artista
        LEFT JOIN metrica_streaming ms
            ON ms.id_musica = m.id_musica
        WHERE a.id_artista = ?
        GROUP BY a.id_artista, a.genero;
    `;

    return database.executar(instrucaoSql, [idArtista]);
}

function buscarTop3Faixas(idArtista) {
    var instrucaoSql = `
        SELECT
            m.id_musica,
            m.titulo,
            m.album,
            COALESCE(SUM(ms.streams), 0) AS total_streams
        FROM musica m
        LEFT JOIN metrica_streaming ms
            ON ms.id_musica = m.id_musica
        WHERE m.id_artista = ?
        GROUP BY
            m.id_musica,
            m.titulo,
            m.album
        ORDER BY total_streams DESC
        LIMIT 3;
    `;

    return database.executar(instrucaoSql, [idArtista]);
}

// Fórmula do engajamento (%):
// ((Total de likes + Total de comentários) / Total de visualizações) * 100
// Se não houver visualizações, retorna NULL.

// Fórmula da popularidade (0 a 100):
// (Streams do artista / Maior total de streams entre os artistas) * 100
// Se não houver streams na base, retorna 0.

function buscarKpisArtista(idArtista) {
    var instrucaoSql = `
        SELECT
            COALESCE(SUM(ms.streams), 0) AS total_streams,

            CASE
                WHEN SUM(ms.views) > 0 THEN
                    ROUND(
                        (
                            (COALESCE(SUM(ms.likes), 0) +
                            COALESCE(SUM(ms.comentarios), 0))
                            / SUM(ms.views)
                        ) * 100,
                        2
                    )
                ELSE NULL
            END AS engajamento,

            CASE
                WHEN ranking.maior_total_streams > 0 THEN
                    ROUND(
                        (
                            COALESCE(SUM(ms.streams), 0) /
                            ranking.maior_total_streams
                        ) * 100,
                        2
                    )
                ELSE 0
            END AS popularidade

        FROM artista a
        LEFT JOIN musica m
            ON m.id_artista = a.id_artista
        LEFT JOIN metrica_streaming ms
            ON ms.id_musica = m.id_musica

        LEFT JOIN (
            SELECT
                MAX(totais.total_streams) AS maior_total_streams
            FROM (
                SELECT
                    a2.id_artista,
                    COALESCE(SUM(ms2.streams), 0) AS total_streams
                FROM artista a2
                LEFT JOIN musica m2
                    ON m2.id_artista = a2.id_artista
                LEFT JOIN metrica_streaming ms2
                    ON ms2.id_musica = m2.id_musica
                GROUP BY a2.id_artista
            ) AS totais
        ) AS ranking ON 1 = 1

        WHERE a.id_artista = ?
        GROUP BY
            a.id_artista,
            ranking.maior_total_streams;
    `;

    return database.executar(instrucaoSql, [idArtista]);
}

module.exports = {
    buscarPorNome,
    buscarPorId,
    buscarDadosArtista,
    buscarTop3Faixas,
    buscarKpisArtista
};
