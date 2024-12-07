export function generateSixDigitToken() {
  let token = "";
  for (let i = 0; i < 6; i++) {
    const digit = Math.floor(Math.random() * 10);
    token += String(digit);
  }
  return token;
};