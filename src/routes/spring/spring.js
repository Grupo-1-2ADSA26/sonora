const express = require("express");
const router = express.Router();

const springService = require("../../services/spring/springService");

router.get("/teste", async (req, res) => {
    try {
        const resultado = await springService.testarConexao();

        res.status(200).json(resultado);
    } catch (erro) {
        console.error(erro);

        res.status(502).json({
            mensagem: "Erro ao comunicar com o Spring Boot"
        });
    }
});

module.exports = router;