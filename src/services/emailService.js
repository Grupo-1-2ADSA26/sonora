const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

async function enviarCodigoAtivacao(emailDestino, codigo) {
    return transporter.sendMail({
        from: `"Sonora" <${process.env.EMAIL_USER}>`,
        to: emailDestino,
        subject: "Ative sua empresa no Sonora",
        text: `
            Olá!

            Recebemos o cadastro da sua empresa no Sonora.

            Seu código de ativação é: ${codigo}

            Guarde esse código para concluir a ativação da sua empresa.

            Equipe Sonora
            `,
        html: `
            <div style="font-family: Arial, sans-serif; color: #222;">
                <h2>Bem-vindo ao Sonora!</h2>
                <p>Recebemos o cadastro da sua empresa.</p>
                <p>Use o código abaixo para ativá-la:</p>
                <div style="
                    padding: 16px;
                    background: #f2f2f2;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    text-align: center;
                ">
                    ${codigo}
                </div>
                <p>Guarde esse código para concluir a ativação.</p>
                <p>Equipe Sonora</p>
            </div>
        `
    });
}

module.exports = {
    enviarCodigoAtivacao
};
