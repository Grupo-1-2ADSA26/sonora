var artistaModel = require("../../models/artista/artistaModel");

function pesquisarArtista(req, res) {
    var termo = req.query.nome;

    if (!termo || termo.trim() === "") {
        return res.status(400).json({
            mensagem: "Nome do artista não informado."
        });
    }

    artistaModel.buscarPorNome(termo.trim())
        .then(function(resultadoArtista) {
            if (resultadoArtista.length === 0) {
                return res.status(404).json({
                    mensagem: "Artista não encontrado."
                });
            }

            montarDadosArtista(resultadoArtista[0], res);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function pesquisarArtistaPorId(req, res) {
    var idArtista = Number(req.params.idArtista);

    if (!idArtista || isNaN(idArtista)) {
        return res.status(400).json({
            mensagem: "ID do artista inválido."
        });
    }

    artistaModel.buscarPorId(idArtista)
        .then(function(resultadoArtista) {
            if (resultadoArtista.length === 0) {
                return res.status(404).json({
                    mensagem: "Artista não encontrado."
                });
            }

            montarDadosArtista(resultadoArtista[0], res);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function montarDadosArtista(artista, res) {
    var idArtista = artista.id_artista;

    Promise.all([
        artistaModel.buscarDadosArtista(idArtista),
        artistaModel.buscarTop3Faixas(idArtista)
    ])
        .then(function(resultados) {
            var dadosArtista = resultados[0][0] || {};
            var resultadoFaixas = resultados[1] || [];

            res.json({
                id_artista: artista.id_artista,
                nome: artista.nome,
                genero: dadosArtista.genero_principal || artista.genero || "Não informado",
                popularidade: Number(dadosArtista.popularidade || 0),
                total_streams: Number(dadosArtista.total_streams || 0),
                engajamento: Number(dadosArtista.engajamento || 0),
                energy: Number(dadosArtista.media_energy || 0),
                danceability: Number(dadosArtista.media_danceability || 0),
                bpm: Number(dadosArtista.media_bpm || 0),
                acousticness: Number(dadosArtista.acousticness || 0),
                valence: Number(dadosArtista.valence || 0),
                speechiness: Number(dadosArtista.speechiness || 0),
                topFaixas: resultadoFaixas
            });
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    pesquisarArtista,
    pesquisarArtistaPorId
};