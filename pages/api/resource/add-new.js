import messages from "@/server/messages";
import prisma from "@/server/prisma";

export default async function hanlder(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.cookies.parrotSessionId) {
    return res.status(401).json({ success: false, message: messages.noSessionDetected });
  }

  if (
    !req.body.type ||
    !req.body.href ||
    !req.body.name
  ) {
    return res.status(400).json({ success: false, message: messages.missingFormData });
  }

  let user;

  try {
    user = await prisma.user.update({
      where: {
        sessionCookie: req.cookies.parrotSessionId,
      },
      data: {
        resources: {
          create: {
            isAuthor: true,
            name: req.body.name,
            resource: {
              create: {
                type: req.body.type,
                href: req.body.href,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  if (!user) {
    return res.status(401).json({ success: false, message: messages.userNotFound });
  }

  return res.status(201).json({ success: true });
};