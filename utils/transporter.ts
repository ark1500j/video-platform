import { createTransport } from "nodemailer";
import { UTApi } from "uploadthing/server";


 const transporter = createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
   })

const utapi = new UTApi();



export {transporter, utapi};