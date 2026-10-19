var aprovadosModel = require("../../models/aprovados/aprovadosModel");

function listarAprovados(req, res) {
    var idEmpresa = req.params.idEmpresa;

    aprovadosModel.listarArtistasAprovados(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).json([]);
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar os artistas aprovados: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarAprovados
}