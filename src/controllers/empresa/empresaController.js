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
    module.exports = {
        atualizar
    }
}