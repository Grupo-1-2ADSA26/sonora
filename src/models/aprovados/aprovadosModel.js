var database = require("../../database/config");

function listarArtistasAprovados(idEmpresa) {
    var instrucaoSql = `
        SELECT 
            a.id_artista,
            a.nome AS nome_artista,
            m.genero,
            ms.energy,
            ms.danceability,
            ms.tempo AS bpm,
            ms.likes AS popularidade,
            ea.status_aprovacao,
            ea.status_visualizacao
        FROM artista_aprovado ea
        JOIN artista a ON ea.id_artista = a.id_artista
        LEFT JOIN musica m ON a.id_artista = m.id_artista
        LEFT JOIN metrica_streaming ms ON m.id_musica = ms.id_musica
        WHERE ea.id_empresa = ${idEmpresa} 
          AND ea.status_aprovacao = 'APROVADO';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarArtistasAprovados
}