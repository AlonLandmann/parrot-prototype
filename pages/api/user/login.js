import messages from "@/server/messages";
import prisma from "@/server/prisma";
import sha256 from "sha256";
import { v4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
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
    return res.status(401).json({ success: false, message: "No user with this email address has been found." });
  }

  if (sha256(req.body.password + process.env.PASSWORD_SALT) !== user.hash) {
    return res.status(401).json({ success: false, message: "Password is incorrect." });
  }

  let newSessionToken = v4();

  try {
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        sessionToken: newSessionToken,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  res.setHeader("Set-Cookie", `parrotSessionId=${newSessionToken}; Path=/api; Max-Age=2592000; HttpOnly; Secure`);

  return res.status(200).json({ success: true, message: "Login successful." });
};