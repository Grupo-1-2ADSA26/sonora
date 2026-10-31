var artistaModel = require("../../models/artista/artistaModel");

function pesquisarArtista(req, res) {
    var termo = req.query.nome;

    if (!termo || termo.trim() === "") {
        return res.status(400).json({
            mensagem: "O nome do artista é obrigatório!"
        });
    }

    artistaModel.buscarPorNome(termo)
        .then(function (resultadoArtista) {
            if (resultadoArtista.length === 0) {
                return res.status(404).json({
                    mensagem: "Artista não encontrado."
                });
            }

            montarDadosArtista(resultadoArtista[0], res);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar artista:", erro);

            res.status(500).json({
                mensagem: "Erro ao buscar artista."
            });
        });
}

function pesquisarArtistaPorId(req, res) {
    var idArtista = Number(req.params.idArtista);

    if (!Number.isInteger(idArtista) || idArtista <= 0) {
        return res.status(400).json({
            mensagem: "ID do artista inválido."
        });
    }

    artistaModel.buscarPorId(idArtista)
        .then(function (resultadoArtista) {
            if (resultadoArtista.length === 0) {
                return res.status(404).json({
                    mensagem: "Artista não encontrado."
                });
            }

            montarDadosArtista(resultadoArtista[0], res);
        })
        .catch(function (erro) {
            console.error("Erro ao buscar artista por ID:", erro);

            res.status(500).json({
                mensagem: "Erro ao buscar artista."
            });
        });
}

function montarDadosArtista(artista, res) {
    var idArtista = artista.id_artista;

    Promise.all([
        artistaModel.buscarDadosArtista(idArtista),
        artistaModel.buscarTop3Faixas(idArtista)
    ])
        .then(function (resultados) {
            var dadosMetricas = resultados[0][0] || {};
            var resultadoFaixas = resultados[1] || [];

            var popCalculada = Math.min(
                Math.round((dadosMetricas.popularidade || 0) / 500000),
                100
            );

            if (popCalculada === 0) {
                popCalculada = 75;
            }

            res.status(200).json({
                id_artista: idArtista,
                nome: artista.nome || artista.nome_artista,
                genero: dadosMetricas.genero_principal || "Gênero Geral",
                popularidade: popCalculada,
                total_streams: Number(dadosMetricas.total_streams || 0),
                energy: Number(dadosMetricas.media_energy || 0.75).toFixed(2),
                danceability: Number(dadosMetricas.media_danceability || 0.80).toFixed(2),
                bpm: Math.round(dadosMetricas.media_bpm || 120),
                topFaixas: resultadoFaixas
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar métricas ou faixas:", erro);

            res.status(500).json({
                mensagem: "Erro ao buscar dados do artista."
            });
        });
}

module.exports = {
    pesquisarArtista,
    pesquisarArtistaPorId
};