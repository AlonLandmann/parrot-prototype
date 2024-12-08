import messages from "@/server/messages";
import prisma from "@/server/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.cookies.parrotSessionId) {
    return res.status(401).json({ success: false, message: "No session detected." });
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        sessionCookie: req.cookies.parrotSessionId,
      },
      select: {
        email: true,
        isVerified: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(401).json({ success: false, message: "User not found." });
  }

  return res.status(200).json({ success: true, user });
};