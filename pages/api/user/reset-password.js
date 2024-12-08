import messages from "@/server/messages";
import prisma from "@/server/prisma";
import { validatePassword } from "@/server/validate";
import sha256 from "sha256";

export default async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.cookies.parrotPasswordResetSessionId) {
    return res.status(401).json({ success: false, message: "Session expired. Please request a new token."});
  }

  if (!req.body.email) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  if (!req.body.newPassword) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  if (!validatePassword(req.body.newPassword)) {
    return res.status(422).json({ success: false, message: "Password validation failed." });
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        passwordResetSessionCookie: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(401).json({ success: false, message: messages.userWithEmailNotFound });
  }

  if (req.cookies.parrotPasswordResetSessionId !== user.passwordResetSessionCookie) {
    return res.status(401).json({ success: false, message: "Invalid session detected. Please request a new token." });
  }

  try {
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        hash: sha256(req.body.newPassword + process.env.PASSWORD_SALT),
        sessionCookie: null,
        passwordResetSessionCookie: null,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  res.setHeader("Set-Cookie", `parrotSessionId=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  res.setHeader("Set-Cookie", `parrotPasswordResetSessionId=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);

  return res.status(200).json({ success: true, message: "Password updated." });
};