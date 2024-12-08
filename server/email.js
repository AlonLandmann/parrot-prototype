import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

function sendEmail(options) {
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export function sendWelcomeEmail(recipient) {
  sendEmail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: "Welcome to parrot",
    text: `Welcome to parrot! Glad to have you on board. If you have any inquiries, please feel free to respond to this email.`,
  });
};

export function sendGeneratedTokenEmail(recipient, token) {
  sendEmail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: "Verification Token - parrot",
    text: `Hi! Parrot has generated the following verification token for you: ${token}. This token will expire in 120 seconds.`,
  });
};