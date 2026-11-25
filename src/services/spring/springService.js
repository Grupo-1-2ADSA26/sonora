const SPRING_URL = process.env.SPRING_URL;

async function testarConexao() {
    const resposta = await fetch(`${SPRING_URL}/api/teste`);

    if (!resposta.ok) {
        throw new Error(`Erro na API Spring: ${resposta.status}`);
    }

    return await resposta.json();
}

async function enviarNotificacao(dados) {
    const resposta = await fetch(`${SPRING_URL}/api/notificacoes`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao enviar notificação");
    }

    return resultado;
}

module.exports = {
    testarConexao,
    enviarNotificacao
};