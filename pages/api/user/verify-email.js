import messages from "@/server/messages";
import prisma from "@/server/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.cookies.parrotSessionId) {
    return res.status(401).json({ success: false, message: "No session detected." });
  }

  let user;
  
  try {
    user = await prisma.user.findUnique({
      where: {
        sessionToken: req.cookies.parrotSessionId,
      },
      select: {
        verificationToken: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(401).json({ success: false, message: "No login detected." });
  }

  if (req.body.verificationToken !== user.verificationToken) {
    return res.status(400).json({ success: false, message: "Token is incorrect." });
  }

  try {
    await prisma.user.update({
      where: {
        sessionToken: req.cookies.parrotSessionId,
      },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  return res.status(200).json({ success: true, message: "Email has been verified." });
};