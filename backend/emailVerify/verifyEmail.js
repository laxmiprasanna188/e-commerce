import 'dotenv/config';
import nodemailer from "nodemailer";

export const verifyEmail = (token, email) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {

        from: process.env.MAIL_USER,

        to: email,

        subject: 'Email Verification',

        text: `Hi! There,
Please follow the link to verify your email:
http://localhost:5173/verify/${token}`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {

        if (error) {
            console.log(error);
            return;
        }

        console.log('Email Sent Successfully');
        console.log(info);
    });
}






