export default function httpHandler(method, handler) {
  return async (req, res) => {
    try {
      if (req.method === method) {
        return await handler(req, res);
      }
      console.log('Invalid request method.');
      return res.status(405).json({ success: false, message: 'Invalid request received.' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
}