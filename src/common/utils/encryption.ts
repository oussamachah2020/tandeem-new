import crypto from "crypto";

const algorithm = "aes-256-cbc";

// Use a fixed key and IV for testing (replace with secure storage in production)
const key = Buffer.from(
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  "hex"
); // 32 bytes
const iv = Buffer.from("0123456789abcdef0123456789abcdef", "hex"); // 16 bytes

// Encrypt function
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // Prepend IV for decryption
}

// Decrypt function
export function decrypt(text: string): string {
  const [ivHex, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
