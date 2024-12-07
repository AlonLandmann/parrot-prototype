import messages from "@/server/messages";
import prisma from "@/server/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.body.email) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  if (!req.body.emailToken) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        emailToken: true,
        emailTokenExpirationDate: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(400).json({ success: false, message: messages.userWithEmailNotFound });
  }

  if (new Date() > user.emailTokenExpirationDate) {
    return res.status(410).json({ success: false, message: "Token has expired." });
  }

  if (req.body.emailToken !== user.emailToken) {
    return res.status(400).json({ success: false, message: "Token is incorrect." });
  }

  try {
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        isVerified: true,
        emailToken: null,
        emailTokenExpirationDate: null,
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  return res.status(200).json({ success: true, message: "Token check successful." });
};