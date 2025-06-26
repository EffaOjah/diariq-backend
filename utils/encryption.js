const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENTRY_ENCRYPTION_SECRET; // 32 bytes
const IV_LENGTH = 12; // Recommended for GCM

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(encryptedText) {
    const [ivHex, tagHex, encryptedHex] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
}

module.exports = { encrypt, decrypt };