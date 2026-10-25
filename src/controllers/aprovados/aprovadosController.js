var aprovadosModel = require("../../models/aprovados/aprovadosModel");

function listarAprovados(req, res) {
    var idEmpresa = req.params.idEmpresa;

    aprovadosModel.listarAprovadosPorEmpresa(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        })
        .catch(function (erro) {
            console.error("Erro ao buscar aprovados:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarAprovados
};