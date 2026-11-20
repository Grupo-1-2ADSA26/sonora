var preferenciaModel = require("../../models/preferencia/preferenciaModel");

async function sincronizarGeneros() {
    try {
        var artistas = await preferenciaModel.buscarGenerosArtistas();
        var generosUnicos = new Map();

        artistas.forEach(function (artista) {
            if (!artista.genero) {
                return;
            }

            var generos = artista.genero.split(",");

            generos.forEach(function (genero) {
                var nome = genero.trim();
                if (nome !== "") {
                    generosUnicos.set(nome.toLowerCase(), nome);
                }

            });
        });

        for (var nome of generosUnicos.values()) {
            await preferenciaModel.cadastrarGenero(nome);
        }

    } catch (erro) {
        throw erro;
    }
}

async function listar(req, res) {
    var idEmpresa = Number(req.params.idEmpresa);

    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
        return res.status(400).json({
            mensagem: "ID da empresa inválido."
        });
    }

    try {
        await sincronizarGeneros();
        var resultado = await preferenciaModel.listarPorEmpresa(idEmpresa);
        return res.status(200).json(resultado);

    } catch (erro) {
        console.log("Erro ao listar preferências:", erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar os gêneros.",
            erro: erro.sqlMessage || erro.message
        });
    }
}

async function salvar(req, res) {
    var idEmpresa = Number(req.params.idEmpresa);
    var idsGeneros = req.body.idsGeneros;

    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
        return res.status(400).json({
            mensagem: "ID da empresa inválido."
        });
    }

    if (!Array.isArray(idsGeneros)) {
        return res.status(400).json({
            mensagem: "Informe uma lista de gêneros."
        });
    }

    idsGeneros = idsGeneros.map(Number);

    if (idsGeneros.some(function (id) {
        return !Number.isInteger(id) || id <= 0;
    })) {
        return res.status(400).json({
            mensagem: "Existem IDs de gêneros inválidos."
        });
    }

    idsGeneros = [...new Set(idsGeneros)];

    try {
        await preferenciaModel.limparPreferencias(idEmpresa);
        await preferenciaModel.salvarPreferencias(
            idEmpresa,
            idsGeneros
        );

        return res.status(200).json({
            mensagem: "Preferências salvas com sucesso!"
        });

    } catch (erro) {
        console.log("Erro ao salvar preferências:", erro);

        return res.status(500).json({
            mensagem: "Erro ao salvar as preferências.",
            erro: erro.sqlMessage || erro.message
        });
    }
}

async function listarArtistasRecomendados(req, res) {
    var idEmpresa = Number(req.params.idEmpresa);

    if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
        return res.status(400).json({
            mensagem: "ID da empresa inválido."
        });
    }

    try {
        var artistas = await preferenciaModel.buscarArtistasRecomendados(idEmpresa);
        return res.status(200).json(artistas);
    } catch (erro) {
        console.log("Erro ao listar artistas recomendados:", erro);
        return res.status(500).json({
            mensagem: "Erro ao buscar artistas recomendados.",
            erro: erro.sqlMessage || erro.message
        });
    }
}

module.exports = {
    listar,
    salvar,
    listarArtistasRecomendados
};
