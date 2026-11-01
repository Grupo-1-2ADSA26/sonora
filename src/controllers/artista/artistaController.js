var artistaModel = require("../../models/artista/artistaModel");

function pesquisarArtista(req, res) {
    var termo = req.query.nome;

    if (!termo || termo.trim() === "") {
        return res.status(400).send("O nome do artista é obrigatório!");
    }

    artistaModel.buscarPorNome(termo)
        .then(function (resultadoArtista) {
            if (resultadoArtista.length === 0) {
                return res.status(404).json({ mensagem: "Artista não encontrado." });
            }

            var artista = resultadoArtista[0];
            var idArtista = artista.id_artista;
            
            
            var nomeArtista = artista.nome || artista.nome_artista;

            Promise.all([
                artistaModel.buscarDadosArtista(idArtista),
                artistaModel.buscarTop3Faixas(idArtista)
            ])
            .then(function (resultados) {
                var dadosMetricas = resultados[0][0] || {};
                var resultadoFaixas = resultados[1] || [];

                var popCalculada = Math.min(Math.round((dadosMetricas.popularidade || 0) / 500000), 100);
                if (popCalculada === 0) popCalculada = 75;

                res.json({
                    id_artista: idArtista,
                    nome: nomeArtista,
                    genero: dadosMetricas.genero_principal || "Gênero Geral",
                    popularidade: popCalculada,
                    energy: Number(dadosMetricas.media_energy || 0.75).toFixed(2),
                    danceability: Number(dadosMetricas.media_danceability || 0.80).toFixed(2),
                    bpm: Math.round(dadosMetricas.media_bpm || 120),
                    topFaixas: resultadoFaixas
                });
            })
            .catch(function (erro) {
                console.error("Erro ao buscar métricas ou faixas:", erro);
                res.status(500).json(erro);
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar artista:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    pesquisarArtista
};