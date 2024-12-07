import messages from "@/server/messages";
import prisma from "@/server/prisma";
import sha256 from "sha256";

export default async function (req, res) {
  if (req.method !== "POST") {
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

  try {
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        hash: sha256(req.body.password + process.env.PASSWORD_SALT),
        passwordResetToken: null,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  return res.status(200).json({ success: true, message: "Password updated." });
};