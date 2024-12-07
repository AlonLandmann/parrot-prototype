import { sendVerificationTokenEmail } from "@/server/email";
import httpHandler from "@/server/httpHandler";
import prisma from "@/server/prisma";
import { generateSixDigitToken } from "@/server/tokens";
import sha256 from "sha256";

export default httpHandler('POST', async (req, res) => {
  const { email, password } = req.body;

  const existingEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingEmail) {
    return res.status(409).json({ success: false, message: "A user with this email address already exists. Try to log in instead." });
  }

  const newUser = await prisma.user.create({
    data: {
      email: email,
      hash: sha256(password + process.env.PASSWORD_SALT),
      verificationToken: generateSixDigitToken(),
    },
    select: {
      email: true,
      verificationToken: true,
      sessionToken: true,
    },
  });

  res.setHeader("Set-Cookie", `parrot-session-id=${newUser.sessionToken}; Path=/api; Max-Age=2592000; HttpOnly; Secure`);
  sendVerificationTokenEmail(newUser.email, newUser.verificationToken);

  return res.status(201).json({ success: true, message: "User created."});
});