import { createTransport } from "nodemailer";

export const sendMails = async (email, subject, html) => {

  const transport = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSKEY,
    },
    port: 465,
    host: "smtp.gmail.com",
    tls: { rejectUnauthorized: false },
  });

  await transport.sendMail({
    from: "Mrcuban777@gmail.com",
    to: email,
    subject,
    html: html,
  });


};

export const sendDevMail = async (email, subject, html) => {

  const transport = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_DEV_ACCOUNT,
      pass: process.env.GMAIL_DEV_PASSKEY,
    },
    port: 465,
    host: "smtp.gmail.com",
    tls: { rejectUnauthorized: false },
  });

  await transport.sendMail({
    from: "mrcubandev@gmail.com",
    to: email,
    subject,
    html: html,
  });


};



export const senBrevoMail = async (email, subject, html) => {

  const transport = createTransport({
    host: "smtp-relay.brevo.com", // Brevo SMTP host
    port: 587,
    secure: false, // Use true for port 465
    auth: {
      user: process.env.BREVO_SMTP_USER, // Your Brevo email
      pass: process.env.BREVO_PASSKEY, // Your Brevo SMTP Key
    },
  });




  await transport.sendMail({
    from: "mrcubandev@gmail.com",
    to: email,
    subject,
    html: html,
  });


};



// atrsrivjusmxpbhs.com
// "amazonego23@gmail.com"