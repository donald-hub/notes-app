import nodemailer from "nodemailer";
import { sendOtp } from "./authController";

export const mail = () => {
const transporter = nodemailer.createTransport(
    {
    secure:true,
    host:"smtp.gmail.com",
    port:465,
    auth:{
        user:"donaldmahanta65@gmail.com",
        pass:"fokwkmivsimdnudm"
    }
    }
)

function sendMail(to,sub,msg){
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    }
)
console.log("Mail sent successfully!");
}
const otp = sendOtp;

sendMail("donaldmahanta65@gmail.com","OTP Verification", "Your OTP is ".otp);
};