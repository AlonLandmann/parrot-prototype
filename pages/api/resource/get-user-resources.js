import messages from "@/server/messages";
import prisma from "@/server/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  if (!req.cookies.parrotSessionId) {
    return res.status(401).json({ success: false, message: messages.noSessionDetected });
  }

  let resources;

  try {
    resources = await prisma.userResourceLink.findMany({
      where: {
        user: {
          is: {
            sessionCookie: req.cookies.parrotSessionId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        resource: {
          select: {
            type: true,
            href: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: messages.internalServerError });
  }

  return res.status(200).json({ success: true, resources });
}