const SPRING_URL = process.env.SPRING_URL;

async function testarConexao() {
    const resposta = await fetch(`${SPRING_URL}/api/teste`);

    if (!resposta.ok) {
        throw new Error(`Erro na API Spring: ${resposta.status}`);
    }

    return await resposta.json();
}

module.exports = {
    testarConexao
};