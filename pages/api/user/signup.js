import { sendVerificationTokenEmail } from "@/server/email";
import messages from "@/server/messages";
import prisma from "@/server/prisma";
import { generateSixDigitToken } from "@/server/tokens";
import sha256 from "sha256";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
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
        verificationToken: generateSixDigitToken(),
      },
      select: {
        email: true,
        verificationToken: true,
        sessionToken: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  res.setHeader("Set-Cookie", `parrotSessionId=${newUser.sessionToken}; Path=/api; Max-Age=2592000; HttpOnly; Secure`);

  sendVerificationTokenEmail(newUser.email, newUser.verificationToken);

  return res.status(201).json({ success: true, message: "User created." });
};