function gerarCodigoAtivacao() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "SON-";

    for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(
            Math.floor(Math.random() * caracteres.length)
        );
        if (i === 3) {
            codigo += "-";
        }
    }
    return codigo;
}

module.exports = {
    gerarCodigoAtivacao
}