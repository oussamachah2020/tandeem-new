import {createTransport, Transporter} from "nodemailer";
import ejs from "ejs";
import path from "path";
import {v4} from "uuid";

class MailService {
    private transporter: Transporter
    private readonly sender: string

constructor() {
    try {
        const host = process.env.NEXT_PUBLIC_SMTP_HOST;
        const port = process.env.NEXT_PUBLIC_SMTP_PORT;
        const email = process.env.NEXT_PUBLIC_SMTP_EMAIL;
        const user = process.env.NEXT_PUBLIC_SMTP_LOGIN;
        const pass = process.env.NEXT_PUBLIC_SMTP_PASSWORD;

        console.log('Mail Service Config:', {
            host,
            port,
            email,
            user,
            passExists: !!pass
        });

        if (!host || !port || !email || !user || !pass) {
            const missing = [
                !host && 'SMTP_HOST',
                !port && 'SMTP_PORT',
                !email && 'SMTP_EMAIL',
                !user && 'SMTP_LOGIN',
                !pass && 'SMTP_PASSWORD'
            ].filter(Boolean);

            throw new Error(`Missing SMTP configuration: ${missing.join(', ')}`);
        }

        this.transporter = createTransport({
            pool: true,
            secure: true,
            host,
            port: Number(port),
            auth: {
                user,
                pass
            },
        });

        this.sender = `tandeem Team <${email}>`;

        // Test the connection
        this.transporter.verify((error) => {
            if (error) {
                console.error('SMTP Connection Error:', error);
            } else {
                console.log('SMTP Server is ready to take our messages');
            }
        });

    } catch (error) {
        console.error('MailService Constructor Error:', error);
        throw error;
    }
}

    send = async (template: string, data: any, metadata: { to: string, subject: string }) => {
        const {to, subject} = metadata
        await this.transporter.sendMail({
            from: this.sender,
            to,
            subject,
            html: await ejs.renderFile(
                path.join(process.cwd(), './src/templates/mails/', template),
                data,
                {async: true}
            ),
            references: v4()
        });
    }

    sendAccountDetails = async (to: { address: string, name: string }, key: string) => {
        await this.transporter.sendMail({
            from: this.sender,
            to,
            subject: 'Votre compte tandeem ! 🙌',
            html: `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <title>Bienvenue sur tandeem!</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #e0e0e0;
                        }
                        .header {
                            background-color: #f8f8f8;
                            padding: 10px;
                            text-align: center;
                        }
                        .content {
                            padding: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>Bienvenue sur tandeem !</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${to.name} 👋</p>
                            <p>Nous sommes heureux de vous informer que votre compte tandeem a été bien créé.</p> 
                            <p>Vous pouvez maintenant vous connecter en utilisant les identifiants suivants :</p>
                            <p>
                                <strong>Email :</strong> ${to.address}<br>
                                <strong>Mot de passe initiale:</strong> ${key}
                            </p>
                            <p>Veuillez conserver vos identifiants en toute sécurité et ne les partagez avec personne.</p>
                            <p>Nous sommes ravis de vous voir rejoindre tandeem !</p>
                        </div>
                        <div class="footer">
                            <p>Si vous avez des questions, n'hésitez pas à <a href="mailto:support@tandeem.com">contacter notre équipe de support</a>.</p>
                            <p>&copy; ${new Date().getFullYear()} tandeem. Tous droits réservés.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
        })
    }
}

let mailService: MailService;

if (process.env.NODE_ENV === 'production') mailService = new MailService();
else {
    if (!global.mailService) global.mailService = new MailService();
    mailService = global.mailService;
}
export default mailService;