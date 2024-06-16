import { createTransport } from "nodemailer";

 const transporter = createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
   })

   export {transporter};