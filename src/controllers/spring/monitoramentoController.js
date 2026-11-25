
const springClient = require("../../services/spring/springClient");

async function buscarAtual(req, res) {
    try {
        const resultados = await springClient.buscarMonitoramentoAtual();

        return res.status(200).json(resultados);

    } catch (erro) {
        console.error(
            "Erro ao consultar monitoramento atual:",
            erro.message
        );

        return res.status(502).json({
            mensagem: "Não foi possível consultar o monitoramento atual"
        });
    }
}

async function buscarHistorico(req, res) {
    try {
        const filtros = {
            servico: req.query.servico,
            inicio: req.query.inicio,
            fim: req.query.fim,
            limite: req.query.limite
        };

        const resultados =
            await springClient.buscarHistoricoMonitoramento(filtros);

        return res.status(200).json(resultados);

    } catch (erro) {
        console.error(
            "Erro ao consultar histórico:",
            erro.message
        );

        if (erro.status === 400) {
            return res.status(400).json({
                mensagem: "Filtros de monitoramento inválidos"
            });
        }

        return res.status(502).json({
            mensagem: "Não foi possível consultar o histórico"
        });
    }
}

module.exports = {
    buscarAtual,
    buscarHistorico
};
