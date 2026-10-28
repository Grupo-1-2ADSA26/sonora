var funcionarioModel = require("../../models/funcionario/funcionarioModel");

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

function carregarAnaliseArtista(req, res) {
    var idArtista = req.params.idArtista;
    var idEmpresa = req.params.idEmpresa;

    if (!idArtista || !idEmpresa) {
        return res.status(400).send("ID do artista ou ID da empresa não informados!");
    }

   
    funcionarioModel.buscarCabecalhoArtista(idArtista, idEmpresa)
        .then(function (resultadoCabecalho) {
            if (resultadoCabecalho.length === 0) {
                return res.status(404).send("Artista não encontrado ou não aprovado para esta empresa.");
            }

            var cabecalho = resultadoCabecalho[0];

     
            funcionarioModel.buscarKpisEPerfilSonoro(idArtista)
                .then(function (resultadoKpis) {
                    var kpisDados = resultadoKpis[0];

                
                    funcionarioModel.buscarEngajamentoPlataforma(idArtista)
                        .then(function (resultadoEngajamento) {

                           
                            funcionarioModel.buscarVariacaoRitmo(idArtista)
                                .then(function (resultadoRitmo) {

                                    
                                    var dadosAnalise = {
                                        cabecalho: cabecalho,
                                        kpis: {
                                            energiaMedia: kpisDados.media_energy,
                                            dancabilidadeMedia: kpisDados.media_danceability,
                                            bpmMedio: kpisDados.media_bpm
                                        },
                                        graficoRadar: {
                                            energy: kpisDados.energy,
                                            danceability: kpisDados.danceability,
                                            acousticness: kpisDados.acousticness,
                                            valence: kpisDados.valence,
                                            speechiness: kpisDados.speechiness
                                        },
                                        graficoBarras: resultadoEngajamento,
                                        graficoLinha: resultadoRitmo
                                    };

                                    res.json(dadosAnalise);

                                })
                                .catch(function (erro) {
                                    console.error("Erro ao buscar variação de ritmo:", erro);
                                    res.status(500).json(erro);
                                });

                        })
                        .catch(function (erro) {
                            console.error("Erro ao buscar engajamento:", erro);
                            res.status(500).json(erro);
                        });

                })
                .catch(function (erro) {
                    console.error("Erro ao buscar KPIs:", erro);
                    res.status(500).json(erro);
                });

        })
        .catch(function (erro) {
            console.error("Erro ao buscar cabeçalho:", erro);
            res.status(500).json(erro);
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