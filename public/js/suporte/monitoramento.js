"use strict";

const INTERVALO_ATUALIZACAO_MS = 15_000;
const VALIDADE_VERIFICACAO_MS = 2 * 60_000;
const TEMPO_LIMITE_REQUISICAO_MS = 12_000;

const servicosConhecidos = new Map([
    ["NODE_JS", { nome: "Node.js", cor: "#2458bd", tracado: [] }],
    ["MYSQL", { nome: "MySQL", cor: "#087857", tracado: [6, 4] }]
]);
const estilosStatus = {
    UP: "status-resolvido",
    DOWN: "status-critico",
    DESATUALIZADO: "status-atencao",
    "SEM REGISTRO": "status-sem-registro"
};
const formatoData = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
});
const formatoEixo = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});
const formatoNumero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

const elementos = Object.fromEntries([
    "atualizar", "ultima-atualizacao", "aviso-api", "estado-servicos", "servicos",
    "kpi-saudaveis", "kpi-media", "kpi-falhas", "filtros", "filtro-servico",
    "erro-filtros", "estado-historico", "resultados-historico", "estado-grafico",
    "area-grafico", "grafico", "registros"
].map(id => [id, document.getElementById(id)]));

let consultaEmAndamento = false;
let filtrosAtivos = "";
let ultimasVerificacoes = new Map();
let temporizadorValidade;
let grafico;

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

function mostrarMensagem(id, texto = "") {
    const elemento = elementos[id];
    if (elemento.textContent !== texto) elemento.textContent = texto;
    elemento.hidden = !texto;
}

function criarSelo(status) {
    const classe = Object.hasOwn(estilosStatus, status)
        ? estilosStatus[status]
        : "status-sem-registro";
    return criarElemento("span", "selo-status " + classe, status);
}

function formatarTempo(tempo) {
    return tempo === null ? "—" : formatoNumero.format(tempo) + " ms";
}

function formatarData(data) {
    return data === null ? "—" : formatoData.format(data);
}

function nomeServico(servico) {
    return servicosConhecidos.get(servico)?.nome ?? servico;
}

async function buscarRegistros(endpoint) {
    const resposta = await fetch(endpoint, {
        cache: "no-store",
        signal: AbortSignal.timeout(TEMPO_LIMITE_REQUISICAO_MS)
    });

    if (!resposta.ok) throw new Error(String(resposta.status));
    if (resposta.status === 204) return [];

    const registros = await resposta.json();
    if (!Array.isArray(registros)) throw new Error("Formato inesperado");

    return registros
        .filter(registro => typeof registro?.servico === "string" && registro.servico)
        .map(({ servico, status, tempoRespostaMs, dataHora }) => {
            const data = typeof dataHora === "string" ? Date.parse(dataHora) : NaN;
            return {
                servico,
                status: typeof status === "string" && status ? status : "—",
                tempo: Number.isFinite(tempoRespostaMs) && tempoRespostaMs >= 0 ? tempoRespostaMs : null,
                data: Number.isFinite(data) ? data : null
            };
        })
        .sort((a, b) => (b.data ?? -Infinity) - (a.data ?? -Infinity));
}

function criarCartaoServico(servico, status, registro) {
    const cartao = criarElemento("article", "cartao");
    const cabecalho = criarElemento("div", "cartao-cabecalho");
    cabecalho.append(criarElemento("h3", "", nomeServico(servico)), criarSelo(status));
    const detalhes = criarElemento("dl", "detalhes-servico");

    const campos = [
        ["Tempo de resposta", formatarTempo(registro?.tempo ?? null)],
        ["Última verificação", formatarData(registro?.data ?? null)]
    ];

    for (const [rotulo, valor] of campos) {
        const campo = criarElemento("div");
        campo.append(criarElemento("dt", "", rotulo), criarElemento("dd", "", valor));
        detalhes.append(campo);
    }

    cartao.append(cabecalho, detalhes);
    return cartao;
}

function renderizarServicos() {
    clearTimeout(temporizadorValidade);
    const agora = Date.now();
    const servicos = new Set([...servicosConhecidos.keys(), ...ultimasVerificacoes.keys()]);
    const cartoes = [];
    const temposValidos = [];
    let saudaveis = 0;
    let proximoVencimento = Infinity;

    for (const servico of servicos) {
        const registro = ultimasVerificacoes.get(servico);
        let status = "SEM REGISTRO";

        if (registro) {
            const vencimento = registro.data === null ? -Infinity : registro.data + VALIDADE_VERIFICACAO_MS;
            status = vencimento < agora ? "DESATUALIZADO" : registro.status;

            if (vencimento >= agora) {
                proximoVencimento = Math.min(proximoVencimento, vencimento);
                if (status === "UP") saudaveis++;
                if (registro.tempo !== null) temposValidos.push(registro.tempo);
            }
        }

        cartoes.push(criarCartaoServico(servico, status, registro));
    }

    elementos.servicos.replaceChildren(...cartoes);
    elementos["kpi-saudaveis"].textContent = ultimasVerificacoes.size ? String(saudaveis) : "—";
    const media = temposValidos.length
        ? temposValidos.reduce((total, tempo) => total + tempo, 0) / temposValidos.length
        : null;
    elementos["kpi-media"].textContent = formatarTempo(media);

    if (Number.isFinite(proximoVencimento)) {
        temporizadorValidade = setTimeout(
            renderizarServicos,
            Math.min(2_147_483_647, Math.max(1, proximoVencimento - Date.now() + 1))
        );
    }
}

function mostrarVerificacoes(registros) {
    ultimasVerificacoes = new Map();
    for (const registro of registros) {
        if (!ultimasVerificacoes.has(registro.servico)) {
            ultimasVerificacoes.set(registro.servico, registro);
        }
    }

    mostrarMensagem("estado-servicos", registros.length ? "" : "Nenhuma verificação armazenada.");
    renderizarServicos();
}

function ocultarTabelaEGrafico(mensagem) {
    elementos["resultados-historico"].hidden = true;
    elementos.registros.replaceChildren();
    elementos["kpi-falhas"].textContent = "—";
    mostrarMensagem("estado-historico", mensagem);
}

function renderizarGrafico(registros) {
    const pontosPorServico = new Map();
    for (const { servico, data, tempo } of registros.slice().reverse()) {
        if (data === null) continue;
        if (!pontosPorServico.has(servico)) pontosPorServico.set(servico, []);
        pontosPorServico.get(servico).push({ x: data, y: tempo });
    }

    const conjuntos = [];
    for (const [servico, pontos] of pontosPorServico) {
        if (!pontos.some(ponto => ponto.y !== null)) continue;
        const estilo = servicosConhecidos.get(servico) ?? { cor: "#6c438f", tracado: [2, 3] };
        conjuntos.push({
            label: nomeServico(servico),
            data: pontos,
            borderColor: estilo.cor,
            backgroundColor: estilo.cor,
            borderDash: estilo.tracado,
            pointRadius: 3
        });
    }

    const mensagem = conjuntos.length
        ? (typeof Chart === "function" ? "" : "Gráfico indisponível. Consulte os dados na tabela.")
        : "Nenhum tempo de resposta com data disponível para este intervalo.";
    mostrarMensagem("estado-grafico", mensagem);
    elementos["area-grafico"].hidden = Boolean(mensagem);
    if (mensagem) return;

    const primeiraData = Math.min(...conjuntos.map(conjunto => conjunto.data[0].x));
    const ultimaData = Math.max(...conjuntos.map(conjunto => conjunto.data.at(-1).x));
    const limites = {
        suggestedMin: primeiraData === ultimaData ? primeiraData - 30_000 : undefined,
        suggestedMax: primeiraData === ultimaData ? ultimaData + 30_000 : undefined
    };

    if (grafico) {
        Object.assign(grafico.options.scales.x, limites);
        grafico.data.datasets = conjuntos;
        grafico.update();
        return;
    }

    grafico = new Chart(elementos.grafico, {
        type: "line",
        data: { datasets: conjuntos },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    ...limites,
                    type: "linear",
                    title: { display: true, text: "Data e hora" },
                    ticks: {
                        maxTicksLimit: 6,
                        callback: valor => formatoEixo.format(valor)
                    }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Tempo de resposta (ms)" }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: pontos => formatarData(pontos[0].parsed.x),
                        label: ponto => ponto.dataset.label + " · " + formatarTempo(ponto.parsed.y)
                    }
                }
            }
        }
    });
}

function renderizarHistorico(registros) {
    if (!registros.length) {
        ocultarTabelaEGrafico("Nenhuma verificação encontrada para os filtros aplicados.");
        elementos["kpi-falhas"].textContent = "0";
        return;
    }

    const linhas = document.createDocumentFragment();
    for (const registro of registros) {
        const linha = criarElemento("tr");
        const status = criarElemento("td");
        status.append(criarSelo(registro.status));
        linha.append(
            criarElemento("td", "", nomeServico(registro.servico)),
            status,
            criarElemento("td", "", formatarTempo(registro.tempo)),
            criarElemento("td", "", formatarData(registro.data))
        );
        linhas.append(linha);
    }

    elementos.registros.replaceChildren(linhas);
    elementos["kpi-falhas"].textContent = String(registros.filter(registro => registro.status === "DOWN").length);
    mostrarMensagem("estado-historico");
    elementos["resultados-historico"].hidden = false;
    renderizarGrafico(registros);
}

function incluirOpcoesDeServico(registros) {
    const seletor = elementos["filtro-servico"];
    const opcoes = new Set(Array.from(seletor.options, opcao => opcao.value));
    for (const { servico } of registros) {
        if (opcoes.has(servico)) continue;
        seletor.add(new Option(nomeServico(servico), servico));
        opcoes.add(servico);
    }
}

async function atualizarPainel() {
    if (consultaEmAndamento) return;
    consultaEmAndamento = true;
    elementos.atualizar.disabled = true;
    const consultaHistorico = filtrosAtivos;

    try {
        const [atual, historico] = await Promise.allSettled([
            buscarRegistros("/api/monitoramento/atual"),
            buscarRegistros("/api/monitoramento/historico" + consultaHistorico)
        ]);

        if (atual.status === "fulfilled") {
            mostrarVerificacoes(atual.value);
            incluirOpcoesDeServico(atual.value);
        } else {
            ultimasVerificacoes.clear();
            clearTimeout(temporizadorValidade);
            elementos.servicos.replaceChildren();
            elementos["kpi-saudaveis"].textContent = "—";
            elementos["kpi-media"].textContent = "—";
            mostrarMensagem("estado-servicos", "Últimas verificações indisponíveis.");
        }

        const aviso = "O serviço de monitoramento está temporariamente indisponível. Tente novamente em instantes.";
        const falhaAtual = atual.status === "rejected";
        mostrarMensagem("aviso-api", falhaAtual ? aviso : "");

        if (consultaHistorico !== filtrosAtivos) return;

        if (historico.status === "fulfilled") {
            incluirOpcoesDeServico(historico.value);
            renderizarHistorico(historico.value);
        } else if (historico.reason.message === "400") {
            ocultarTabelaEGrafico("O histórico não foi carregado. Revise as datas e a quantidade informadas.");
        } else {
            ocultarTabelaEGrafico("Histórico indisponível.");
            mostrarMensagem("aviso-api", aviso);
        }

        if (!falhaAtual && historico.status === "fulfilled") {
            mostrarMensagem("ultima-atualizacao", "Última atualização bem-sucedida às " + formatarData(Date.now()));
        } else if (elementos["ultima-atualizacao"].textContent === "Carregando dados…") {
            mostrarMensagem("ultima-atualizacao", "Aguardando uma atualização bem-sucedida.");
        }
    } finally {
        consultaEmAndamento = false;
        elementos.atualizar.disabled = false;
        if (consultaHistorico !== filtrosAtivos) atualizarPainel();
    }
}

elementos.filtros.addEventListener("submit", evento => {
    evento.preventDefault();
    const campos = new FormData(elementos.filtros);
    const inicio = campos.get("inicio");
    const fim = campos.get("fim");

    if (inicio && fim && inicio > fim) {
        mostrarMensagem("erro-filtros", "A data de início deve ser anterior ou igual à data de fim.");
        return;
    }

    mostrarMensagem("erro-filtros");
    const parametros = new URLSearchParams();
    for (const [campo, valor] of campos) {
        if (!valor) continue;
        const dataSemSegundos = (campo === "inicio" || campo === "fim") && valor.length === 16;
        parametros.set(campo, dataSemSegundos ? valor + ":00" : valor);
    }

    const consulta = parametros.size ? "?" + parametros.toString() : "";
    if (consulta !== filtrosAtivos) {
        filtrosAtivos = consulta;
        ocultarTabelaEGrafico("Consultando o histórico…");
    }

    atualizarPainel();
});

elementos.atualizar.addEventListener("click", atualizarPainel);
atualizarPainel();
setInterval(atualizarPainel, INTERVALO_ATUALIZACAO_MS);
