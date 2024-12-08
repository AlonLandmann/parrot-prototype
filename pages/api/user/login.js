import messages from "@/server/messages";
import prisma from "@/server/prisma";
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

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        hash: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(401).json({ success: false, message: messages.userWithEmailNotFound });
  }

  if (sha256(req.body.password + process.env.PASSWORD_SALT) !== user.hash) {
    return res.status(401).json({ success: false, message: "Password is incorrect." });
  }

  try {
    user = await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        sessionCookie: v4(),
      },
      select: {
        email: true,
        isVerified: true,
        sessionCookie: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  res.setHeader("Set-Cookie", `parrotSessionId=${user.sessionCookie}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; Secure`);

  return res.status(200).json({ success: true, userEmail: user.email, userVerified: user.isVerified });
};