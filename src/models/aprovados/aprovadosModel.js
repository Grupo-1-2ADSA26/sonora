var database = require("../../database/config");

function listarAprovadosPorEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            a.id_artista,
            a.nome AS nome_artista,
            MAX(m.genero) AS genero,
            ROUND(AVG(ms.energy), 2) AS energy,
            ROUND(AVG(ms.danceability), 2) AS danceability,
            ROUND(AVG(ms.tempo)) AS bpm,
            LEAST(ROUND(AVG(ms.streams) / 500000), 100) AS popularidade
        FROM artista_aprovado aa
        JOIN artista a ON aa.id_artista = a.id_artista
        LEFT JOIN musica m ON a.id_artista = m.id_artista
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE aa.id_empresa = ${idEmpresa} 
          AND aa.status_aprovacao = 'APROVADO'
        GROUP BY a.id_artista, a.nome;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listarAprovadosPorEmpresa
};