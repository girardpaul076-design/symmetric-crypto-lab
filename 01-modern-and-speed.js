const crypto = require('crypto');

const message = Buffer.from('Symmetric encryption uses one shared secret key!');
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(12);  // 96-bit nonce

console.log('--- 1. MODERN ENCRYPTION & DECRYPTION ---');

function runModernDemo(algorithm) {
  // Encrypt
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Decrypt
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  console.log(`[${algorithm}]`);
  console.log(`  Ciphertext: ${encrypted.toString('hex')}`);
  console.log(`  Decrypted:  ${decrypted.toString()}\n`);
}

runModernDemo('aes-256-gcm');
runModernDemo('chacha20-poly1305');

console.log('--- 2. SPEED BENCHMARK (50 MB PAYLOAD) ---');
const payload = crypto.randomBytes(50 * 1024 * 1024);

console.time('AES-256-GCM (Modern Block)');
const aes = crypto.createCipheriv('aes-256-gcm', key, iv);
aes.update(payload);
aes.final();
console.timeEnd('AES-256-GCM (Modern Block)');

console.time('ChaCha20-Poly1305 (Modern Stream)');
const chacha = crypto.createCipheriv('chacha20-poly1305', key, iv);
chacha.update(payload);
chacha.final();
console.timeEnd('ChaCha20-Poly1305 (Modern Stream)');

console.time('3DES (Legacy Block)');
const des3 = crypto.createCipheriv('des-ede3-cbc', crypto.randomBytes(24), crypto.randomBytes(8));
des3.update(payload);
des3.final();
console.timeEnd('3DES (Legacy Block)');
