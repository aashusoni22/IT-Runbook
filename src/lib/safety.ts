export const blockedPatterns = [
  /guest\s*(name|email|phone|address|id|data|profile)/i,
  /\b(credit\s*card|card\s*number|cvv|billing\s*details)\b/i,
  /\b(password|passcode|pin\s*code|credential|secret\s*key)\b/i,
  /internal\s*ip|private\s*ip|\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}\b|\b192\.168\.\d{1,3}\.\d{1,3}\b/i,
  /\b(server\s*name|hostname|domain\s*controller)\b/i,
  /\b(confidential|proprietary|nda)\b/i
];

export const safetyMessage =
  "Remove guest data, payment data, passwords, internal IPs, server names, and confidential company details, then try again.";

export function containsSensitiveData(text: string) {
  return blockedPatterns.some((pattern) => pattern.test(text));
}
