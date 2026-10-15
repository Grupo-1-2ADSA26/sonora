var eventoModel = require("../../models/evento/eventoModel");

function cadastrar(req, res) {
    var { nome, data_evento, local_evento, id_empresa } = req.body;

    if (!nome || !data_evento || !local_evento || !id_empresa ) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    eventoModel.cadastrar(nome, data_evento, local_evento, id_empresa)
    .then(resultado => res.status(200).json(resultado))
    .catch(erro => res.status(500).json(erro.sqlMessage));
}

module.exports = {
    cadastrar
}