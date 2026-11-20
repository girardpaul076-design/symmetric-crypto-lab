const crypto = require('crypto');

console.log('--- 1. TESTING BROKEN ALGORITHMS ---');

function tryBrokenCipher(name, algorithm, keyLen, ivLen) {
  try {
    const iv = ivLen > 0 ? crypto.randomBytes(ivLen) : null;
    const cipher = crypto.createCipheriv(algorithm, crypto.randomBytes(keyLen), iv);
    cipher.update('test');
    cipher.final();
    console.log(`[${name}] Ran successfully (Legacy OpenSSL provider enabled).`);
  } catch (err) {
    console.log(`[${name}] BLOCKED by modern runtime -> ${err.code || err.message}`);
  }
}

tryBrokenCipher('DES (56-bit)', 'des-cbc', 8, 8);
tryBrokenCipher('RC4 (Stream)', 'rc4', 16, 0);

console.log('\n--- 2. TESTING TAMPER DETECTION (AES-GCM) ---');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update('Transfer $100'), cipher.final()]);
const authTag = cipher.getAuthTag();

// Simulate a hacker modifying 1 byte of the encrypted data
encrypted[0] = encrypted[0] ^ 0xff;

try {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  decipher.update(encrypted);
  decipher.final();
} catch (err) {
  console.log(`[Tamper Test] CAUGHT! Decryption rejected -> ${err.message}`);
}
