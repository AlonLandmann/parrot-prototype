import messages from "@/server/messages";
import prisma from "@/server/prisma";

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
        passwordResetToken: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(400).json({ success: false, message: messages.userWithEmailNotFound });
  }

  if (req.body.resetToken !== user.passwordResetToken) {
    return res.status(400).json({ success: false, message: "Token is incorrect." });
  }

  return res.status(200).json({ success: true, message: "Reset token is correct" });
};