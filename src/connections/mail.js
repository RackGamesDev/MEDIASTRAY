import nodemailer from 'nodemailer';

const mandarEmail = async (contenido, titulo, receptor) => {
    console.log(`MANDAR ${contenido} A ${receptor}`);
    try {
        const transporter = nodemailer.createTransport({
            host: '???',
            port: 587,
            secure: false,
            auth: {
                user: '???',
                pass: '???'
            }
        });
        const info = await transporter.sendMail({
            from: '???',
            to: receptor,
            subject: titulo,
            text: contenido
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { mandarEmail }