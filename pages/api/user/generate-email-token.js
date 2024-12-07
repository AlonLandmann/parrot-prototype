import { sendGeneratedTokenEmail } from "@/server/email";
import messages from "@/server/messages";
import prisma from "@/server/prisma";
import { generateSixDigitToken } from "@/server/tokens";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.body.email) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(400).json({ success: false, message: messages.userWithEmailNotFound });
  }

  try {
    user = await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        emailToken: generateSixDigitToken(),
        emailTokenExpirationDate: new Date(Date.now() + 120 * 1000),
      },
      select: {
        email: true,
        emailToken: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  sendGeneratedTokenEmail(user.email, user.emailToken);

  return res.status(200).json({ success: true, message: "A verfication token has been sent to your email." });
};