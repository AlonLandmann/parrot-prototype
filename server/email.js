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

export function sendEmailVerificationTokenEmail(recipient, token) {
  sendEmail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: "Email Verification Token",
    text: `Welcome to parrot! Your verfication token is ${token}.`,
  });
};

export function sendPasswordResetTokenEmail(recipient, token) {
  sendEmail({
    from: process.env.GMAIL_USER,
    to: recipient,
    subject: "Password Reset Token",
    text: `Hi! Your password reset token is ${token}.`,
  });
};