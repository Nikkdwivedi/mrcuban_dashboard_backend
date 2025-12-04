import { createTransport } from "nodemailer";
import axios from "axios";

// -------------------------
// Gmail Sending (No Change)
// -------------------------

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
    html,
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
    html,
  });
};

// ---------------------------------------
// 🔥 Brevo (Sendinblue) - API v3 VERSION
// ---------------------------------------

export const senBrevoMail = async (email, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "mrcubandev@gmail.com", name: "Mr Cuban" },
        to: [{ email }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY, // <-- Your API Key
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Brevo mail sent successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "Brevo API Error:",
      error.response?.data || error.message
    );
    throw new Error("Email sending failed");
  }
};
