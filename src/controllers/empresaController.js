var empresaModel = require("../models/empresaModel");

function cadastrar(req, res) {
    let cnpj = req.body.cnpjServer
    let nome = req.body.nomeServer
    let tipo = req.body.tipoServer
    let email = req.body.emailServer
    let senha = req.body.senhaServer

    if (cnpj == undefined) {
        res.status(400).send("Log Error: Seu CNPJ está undefined!");
    } else if (nome == undefined) {
        res.status(400).send("Log Error: Seu Nome está indefinida!");
    } else if (tipo == undefined) {
        res.status(400).send("Log Error: Seu Tipo está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Log Error: Seu Email está indefinida!");
    } else if (senha == undefined) {
        res.status(400).send("Log Error: Sua senha está undefined!");
    } else {
        
        empresaModel.cadastrar(cnpj, nome, tipo, email, senha)
            .then(
                function (resultado) {
                    console.log("Log: Estou na Empresa Controller na função cadastrar e retornei uma resposta!")
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(
                        "\nError Log: Estou na Empresa Controller na função cadastrar e houve um erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );

    }
}

function autenticar(req, res) {
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        empresaModel.autenticar(email, senha)
            .then(
                function (resposta) {
                    if(resposta.length == 1) {
                        res.json({
                            id_empresa: resposta[0].id_empresa,
                            nome_empresa: resposta[0].nome

                        });
                    } else {
                        console.log("Log Error: Estou na Empresa Controller na função autenticar e não consegui achar a empresa!")
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } 
                }
            )
            .catch(
                function(erro) {
                    console.log("Log Error: Estou na Empresa Controller na função autenticar e houve um erro ao buscar a empresa!\nError MYSQL: ", erro.sqlMessage)
                    console.log(erro);
                    res.status(500).json(erro.sqlMessage);
                }
            )

    }
}


module.exports = {
  cadastrar,
  autenticar
};
