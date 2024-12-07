import messages from "@/server/messages";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: messages.invalidRequestMethod });
  }

  res.setHeader("Set-Cookie", `parrotSessionId=; Path=/api; Max-Age=0; HttpOnly; Secure`);

  return res.status(200).json({ success: true, message: "Logout successful." });
};