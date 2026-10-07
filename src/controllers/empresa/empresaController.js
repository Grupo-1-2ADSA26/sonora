var empresaModel = require("../../models/empresa/empresaModel");

function atualizar(req, res) {
    var idEmpresa = req.params.idEmpresa
    var razaoSocial = req.body.razaoSocialServer
    var cnpj = req.body.cnpjServer
    var tipo = req.body.tipoServer
    var senha = req.body.senhaServer

    if (razaoSocial == undefined) {
        res.status(400).send("A razão social está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("O CNPJ está undefined!");
    } else if (tipo == undefined) {
        res.status(400).send("O tipo de estabelecimento está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("A senha está undefined!");
    } else {
        empresaModel.atualizar(idEmpresa, razaoSocial, cnpj, tipo, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar a atualização! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarPorId(req, res) {
    var idEmpresa = req.params.idEmpresa

    if (!idEmpresa) {
        res.status(400).send("O ID da empresa está undefined!");
    } else {
        empresaModel.buscarPorId(idEmpresa)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado[0])
                } else {
                    res.status(404).send("Nenhuma empresa encontrada com esse ID!")
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage)
            })
    }
}

function autenticar(req, res) {
    var email = req.body.emailServer
    var senha = req.body.senhaServer

    if (email == undefined) {
        res.status(400).send("Seu e-mail está undefined!")
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!")
    } else {
        empresaModel.autenticar(email, senha)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    res.json({
                        id_usuario: resultado[0].id_usuario,
                        nome: resultado[0].nome,
                        email: resultado[0].email,
                        id_empresa: resultado[0].id_empresa,
                        id_cargo: resultado[0].id_cargo
                    });
                } else if (resultado.length == 0) {
                    res.status(403).send("E-mail e/ou senha inválidos")
                } else {
                    res.status(500).send("Mais de um usuário encontrado com essas credenciais!")
                }
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            })
    }
}

module.exports = {
    atualizar,
    buscarPorId,
    autenticar
}