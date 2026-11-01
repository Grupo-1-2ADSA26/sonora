var funcionarioModel = require("../../models/funcionario/funcionarioModel");
var artistaModel = require("../../models/artista/artistaModel");

function cadastrar(req, res) {
    var { nome, email, senha, idEmpresa, idCargo } = req.body;

    if (nome == undefined || email == undefined || idCargo == undefined || senha == undefined || idEmpresa == undefined) {
        res.status(400).send("Seu parâmetro está undefined!");
    } else {
        funcionarioModel.cadastrar(nome, email, senha, idEmpresa, idCargo)
            .then(resultado => res.status(201).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

function listarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    funcionarioModel.listarPorEmpresa(idEmpresa)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function buscarPorId(req, res) {
    var idUsuario = req.params.idUsuario;
    funcionarioModel.buscarPorId(idUsuario)
        .then(resultado => res.status(200).json(resultado[0] || {}))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function atualizar(req, res) {
    var idUsuario = req.params.idUsuario;
    var { nome, email, senha, idCargo } = req.body;

    if (senha == "") {
        funcionarioModel.atualizarSemSenha(idUsuario, nome, email, idCargo)
            .then(resultado => res.status(200).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    } else {
        funcionarioModel.atualizar(idUsuario, nome, email, senha, idCargo)
            .then(resultado => res.status(200).json(resultado))
            .catch(erro => res.status(500).json(erro.sqlMessage));
    }
}

function deletar(req, res) {
    var idUsuario = req.params.idUsuario;
    funcionarioModel.deletar(idUsuario)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu e-mail está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        funcionarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticacao) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticacao.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticacao)}`);

                    if (resultadoAutenticacao.length == 1) {
                        res.json({
                            id_usuario: resultadoAutenticacao[0].id_usuario,
                            nome_usuario: resultadoAutenticacao[0].nome_usuario,
                            email: resultadoAutenticacao[0].email,
                            id_empresa: resultadoAutenticacao[0].id_empresa,
                            nome_empresa: resultadoAutenticacao[0].razao_social,
                            id_cargo: resultadoAutenticacao[0].id_cargo,
                            nome_cargo: resultadoAutenticacao[0].nome_cargo
                        });
                    } else if (resultadoAutenticacao.length == 0) {
                        res.status(403).send("E-mail e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo e-mail e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

// Converte para número mantendo null quando não há dado
function paraNumero(valor) {
    return valor === null || valor === undefined ? null : Number(valor);
}

// Converte um valor de 0 a 1 em porcentagem de 0 a 100
function paraPorcento(valor) {
    return valor === null || valor === undefined
        ? 0
        : Math.round(Number(valor) * 100);
}

function carregarAnaliseArtista(req, res) {
    var idArtista = Number(req.params.idArtista);
    var idEmpresa = Number(req.params.idEmpresa);

    if (!Number.isInteger(idArtista) || idArtista <= 0 ||
        !Number.isInteger(idEmpresa) || idEmpresa <= 0) {
        return res.status(400).send("ID do artista ou ID da empresa inválido!");
    }

    funcionarioModel.buscarCabecalhoArtista(idArtista, idEmpresa)
        .then(function (resultadoCabecalho) {
            if (resultadoCabecalho.length === 0) {
                return res.status(404).send("Artista não encontrado para esta empresa.");
            }

            var cabecalho = resultadoCabecalho[0];

            return Promise.all([
                funcionarioModel.buscarKpisEPerfilSonoro(idArtista),
                funcionarioModel.buscarEngajamentoPlataforma(idArtista),
                funcionarioModel.buscarVariacaoRitmo(idArtista),
                artistaModel.buscarKpisArtista(idArtista)
            ]).then(function (resultados) {
                var perfil = resultados[0][0] || {};
                var plataformas = resultados[1] || [];
                var ritmo = resultados[2] || [];
                var kpisArtista = resultados[3][0] || {};

                var popularidade = Number(kpisArtista.popularidade) || 0;
                var bpm = paraNumero(perfil.media_bpm);

                res.json({
                    cabecalho: {
                        nome: cabecalho.nome_artista,
                        genero: cabecalho.genero_principal,
                        status_aprovacao: cabecalho.status_aprovacao
                    },
                    kpis: {
                        popularidade: popularidade,
                        energy: paraNumero(perfil.media_energy),
                        danceability: paraNumero(perfil.media_danceability),
                        bpm: bpm === null ? null : Math.round(bpm)
                    },
                    graficoRadar: {
                        labels: ["Popularidade", "Energia", "Dançabilidade", "Acústica", "Valência", "Fala"],
                        valores: [
                            popularidade,
                            paraPorcento(perfil.media_energy),
                            paraPorcento(perfil.media_danceability),
                            paraPorcento(perfil.acousticness),
                            paraPorcento(perfil.valence),
                            paraPorcento(perfil.speechiness)
                        ]
                    },
                    graficoBarras: {
                        labels: plataformas.map(function (p) { return p.plataforma; }),
                        valores: plataformas.map(function (p) {
                            return Number(p.streams) || Number(p.views) || 0;
                        })
                    },
                    graficoLinha: {
                        label: "BPM médio",
                        labels: ritmo.map(function (r) { return r.titulo; }),
                        valores: ritmo.map(function (r) { return Number(r.tempo) || 0; })
                    }
                });
            });
        })
        .catch(function (erro) {
            console.error("Erro ao carregar análise do artista:", erro);
            res.status(500).json({ mensagem: "Erro ao carregar a análise do artista." });
        });
        
}

module.exports = {
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    atualizar,
    deletar,
    autenticar,
    carregarAnaliseArtista
};