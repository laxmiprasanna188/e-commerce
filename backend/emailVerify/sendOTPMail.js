import 'dotenv/config';
import nodemailer from "nodemailer";

export const sendOTPMail = async(otp, email) => {

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

        subject: 'Password Reset OTP',

        html: `<p>Your OTP for password reset is:<b>${otp}</b></p>`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {

        if (error) {
            console.log(error);
            return;
        }

        console.log('OTP Sent Successfully');
        console.log(info);
    });
}