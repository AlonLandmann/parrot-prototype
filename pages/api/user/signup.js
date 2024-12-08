import { sendWelcomeEmail } from "@/server/email";
import messages from "@/server/messages";
import prisma from "@/server/prisma";
import { validateEmail, validatePassword } from "@/server/validate";
import sha256 from "sha256";
import { v4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.body.email) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  if (!req.body.password) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  if (!validateEmail(req.body.email)) {
    return res.status(422).json({ success: false, message: "Email validation failed." });
  }

  if (!validatePassword(req.body.password)) {
    return res.status(422).json({ success: false, message: "Password validation failed." });
  }

  let existingUser;

  try {
    existingUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (existingUser) {
    return res.status(409).json({ success: false, message: "A user with this email address already exists. Try to log in instead." });
  }

  let newUser;

  try {
    newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        hash: sha256(req.body.password + process.env.PASSWORD_SALT),
        sessionCookie: v4(),
      },
      select: {
        email: true,
        sessionCookie: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  res.setHeader("Set-Cookie", `parrotSessionId=${newUser.sessionCookie}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; Secure; SameSite=Lax`);

  sendWelcomeEmail(newUser.email);

  return res.status(201).json({ success: true, email: newUser.email });
};