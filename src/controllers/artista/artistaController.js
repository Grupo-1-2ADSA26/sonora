
var artistaModel = require("../../models/artista/artistaModel");

function pesquisarArtista(req, res) {
    var termo = req.query.nome;

    if (!termo || termo.trim() === "") {
        return res.status(400).json({
            mensagem: "O nome do artista é obrigatório!"
        });
    }

    artistaModel.buscarPorNome(termo.trim())
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

            return res.status(500).json({
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

            return res.status(500).json({
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

            res.status(200).json({
                id_artista: idArtista,
                nome: artista.nome,
                genero: dadosMetricas.genero_principal || "Não informado",

                popularidade: null,

                total_streams: Number(
                    dadosMetricas.total_streams || 0
                ),

                energy: dadosMetricas.media_energy !== null
                    ? Number(dadosMetricas.media_energy).toFixed(2)
                    : null,

                danceability: dadosMetricas.media_danceability !== null
                    ? Number(dadosMetricas.media_danceability).toFixed(2)
                    : null,

                bpm: dadosMetricas.media_bpm !== null
                    ? Math.round(Number(dadosMetricas.media_bpm))
                    : null,

                topFaixas: resultadoFaixas.map(function (faixa) {
                    return {
                        id_musica: faixa.id_musica,
                        titulo: faixa.titulo,
                        album: faixa.album,
                        total_streams: Number(faixa.total_streams || 0)
                    };
                })
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar métricas ou faixas:", erro);

            return res.status(500).json({
                mensagem: "Erro ao buscar dados do artista."
            });
        });
}

function pesquisarKpisArtista(req, res) {
    var idArtista = Number(req.params.idArtista);

    if (!Number.isInteger(idArtista) || idArtista <= 0) {
        return res.status(400).json({
            mensagem: "ID do artista inválido."
        });
    }

    artistaModel.buscarKpisArtista(idArtista)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(404).json({
                    mensagem: "Artista não encontrado."
                });
            }

            res.status(200).json({
                popularidade: Number(resultado[0].popularidade || 0),

                total_streams: Number(
                    resultado[0].total_streams || 0
                ),

                engajamento: resultado[0].engajamento !== null
                    ? Number(resultado[0].engajamento)
                    : null
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar KPIs do artista:", erro);

            res.status(500).json({
                mensagem: "Erro ao buscar indicadores do artista."
            });
        });
}

module.exports = {
    pesquisarArtista,
    pesquisarArtistaPorId,
    pesquisarKpisArtista
};
