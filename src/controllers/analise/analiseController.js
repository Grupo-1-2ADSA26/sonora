var analiseModel = require("../../models/analise/analiseModel");
var artistaModel = require("../../models/artista/artistaModel");

function paraNumero(valor) {
    if (valor == null) {
        return null;
    }

    return Number(valor);
}

function paraPorcento(valor) {
    if (valor == null) {
        return 0;
    }

    return Number((Number(valor) * 100).toFixed(2));
}

function carregarAnaliseArtista(req, res) {
    var idArtista = Number(req.params.idArtista);
    var idEmpresa = Number(req.params.idEmpresa);

    if (!idArtista || isNaN(idArtista) || !idEmpresa || isNaN(idEmpresa)) {
        return res.status(400).json({
            mensagem: "ID do artista ou da empresa inválido."
        });
    }

    Promise.all([
        artistaModel.buscarDadosArtista(idArtista),
        analiseModel.buscarCabecalhoArtista(idArtista, idEmpresa),
        analiseModel.buscarMetricasPlataforma(idArtista),
        analiseModel.buscarBpmPorFaixa(idArtista)
    ])
        .then(function(resultados) {
            var dadosArtista = resultados[0][0] || {};
            var cabecalho = resultados[1][0] || {};
            var metricasPlataforma = resultados[2] || [];
            var resultadoBpm = resultados[3] || [];

            var plataformas = metricasPlataforma.map(function(item) {
                return item.plataforma;
            });

            var valoresPlataforma = metricasPlataforma.map(function(item) {
                return Number(item.streams || item.views || 0);
            });

            res.json({
                cabecalho: {
                    nome: cabecalho.nome_artista || "Não informado",
                    genero: cabecalho.genero_principal || "Não informado",
                    status_aprovacao: cabecalho.status_aprovacao || "PENDENTE"
                },

                kpis: {
                    popularidade: Number(dadosArtista.popularidade || 0),
                    energy: paraNumero(dadosArtista.media_energy),
                    danceability: paraNumero(dadosArtista.media_danceability),
                    bpm: paraNumero(dadosArtista.media_bpm)
                },

                graficoRadar: {
                    labels: [
                        "Popularidade",
                        "Energia",
                        "Dançabilidade",
                        "Acústica",
                        "Valência",
                        "Fala"
                    ],
                    valores: [
                        Number(dadosArtista.popularidade || 0),
                        paraPorcento(dadosArtista.media_energy),
                        paraPorcento(dadosArtista.media_danceability),
                        paraPorcento(dadosArtista.acousticness),
                        paraPorcento(dadosArtista.valence),
                        paraPorcento(dadosArtista.speechiness)
                    ]
                },

                graficoBarras: {
                    labels: plataformas,
                    valores: valoresPlataforma
                },

                graficoLinha: {
                    label: "BPM médio",
                    labels: resultadoBpm.map(function(item) {
                        return item.titulo;
                    }),
                    valores: resultadoBpm.map(function(item) {
                        return Number(item.tempo || 0);
                    })
                }
            });
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    carregarAnaliseArtista
};