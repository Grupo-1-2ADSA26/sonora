var database = require("../../database/config");

function buscarPorNome(nome) {
    var instrucaoSql = `
        SELECT id_artista, nome 
        FROM artista 
        WHERE nome LIKE '%${nome}%' 
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarDadosArtista(idArtista) {
    var instrucaoSql = `
        SELECT 
            MAX(m.genero) AS genero_principal,
            AVG(ms.energy) AS media_energy,
            AVG(ms.danceability) AS media_danceability,
            AVG(ms.tempo) AS media_bpm,
            AVG(ms.streams) AS popularidade
        FROM musica m
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE m.id_artista = ${idArtista};
    `;
    return database.executar(instrucaoSql);
}

function buscarTop3Faixas(idArtista) {
    var instrucaoSql = `
        SELECT 
            m.titulo,
            m.album,
            SUM(ms.streams) AS total_streams
        FROM musica m
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE m.id_artista = ${idArtista}
        GROUP BY m.id_musica, m.titulo, m.album
        ORDER BY total_streams DESC
        LIMIT 3;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPorNome,
    buscarDadosArtista,
    buscarTop3Faixas
};