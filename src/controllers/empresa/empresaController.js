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

 function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);npm 
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpj;
  var razaoSocial = req.body.razaoSocial;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
    } else {
      empresaModel.cadastrar(razaoSocial, cnpj).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
  atualizar,
    };
}