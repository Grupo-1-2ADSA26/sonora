const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

async function enviarCodigoAtivacao(emailDestino, codigo) {
    const linkAtivacao = "http://localhost:3333/ativacao.html";

    return transporter.sendMail({
        from: `"Sonora" <${process.env.EMAIL_USER}>`,
        to: emailDestino,
        subject: "Ative sua empresa no Sonora",
        text: `
            Olá!

            Recebemos o cadastro da sua empresa no Sonora.

            Seu código de ativação é: ${codigo}

            Acesse a página de ativação:
            ${linkAtivacao}

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
                                border-radius: 8px;
                            ">
                                ${codigo}
                            </div>

                            <p style="margin-top: 20px;">
                                Clique no botão abaixo para concluir a ativação:
                            </p>

                            <a href="${linkAtivacao}"
                            style="
                            <p style="margin-top: 20px;">
                                Clique aqui
                            </p>

                            <p>Equipe Sonora</p>
                        </div>
        `
    });
}

module.exports = {
    enviarCodigoAtivacao
};
