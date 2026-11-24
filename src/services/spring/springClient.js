
const SPRING_URL = process.env.SPRING_URL || "http://localhost:8081";

async function consultarSpring(endpoint, options = {}) {
    const resposta = await fetch(`${SPRING_URL}${endpoint}`, {
        ...options,
        signal: AbortSignal.timeout(8000),
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!resposta.ok) {
        const erro = new Error(
            `Erro ao consultar Spring Boot: HTTP ${resposta.status}`
        );

        erro.status = resposta.status;
        throw erro;
    }

    if (resposta.status === 204) {
        return null;
    }

    return resposta.json();
}

async function buscarMonitoramentoAtual() {
    return consultarSpring("/api/monitoramento/atual");
}

async function buscarHistoricoMonitoramento(filtros = {}) {
    const parametros = new URLSearchParams();

    const camposPermitidos = [
        "servico",
        "inicio",
        "fim",
        "limite"
    ];

    for (const campo of camposPermitidos) {
        if (filtros[campo] !== undefined && filtros[campo] !== "") {
            parametros.set(campo, String(filtros[campo]));
        }
    }

    const query = parametros.toString();

    const endpoint = "/api/monitoramento/historico" +
        (query ? `?${query}` : "");

    return consultarSpring(endpoint);
}

module.exports = {
    consultarSpring,
    buscarMonitoramentoAtual,
    buscarHistoricoMonitoramento
};
