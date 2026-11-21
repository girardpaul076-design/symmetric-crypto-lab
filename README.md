# Symmetric Encryption Lab

Hands-on practice comparing modern, legacy, and broken symmetric (secret key) algorithms.

## Quick Reference

| Algorithm | Type | Status | Key Notes |
| :--- | :--- | :--- | :--- |
| **AES** | Block Cipher | Modern Standard | 128-bit blocks; 128, 192, or 256-bit keys. Fast with CPU hardware acceleration. |
| **ChaCha20** | Stream Cipher | Modern Standard | Fast on mobile and TLS; paired with **Poly1305** for authentication. |
| **3DES** | Block Cipher | Legacy / Retiring | Applies DES 3 times. Slow and weaker than AES. |
| **DES** | Block Cipher | Broken | 56-bit key. Easily broken by brute force. Do not use. |
| **RC4** | Stream Cipher | Prohibited | Known statistical weaknesses. Banned in TLS. |
| **Blowfish / Twofish** | Block Ciphers | Legacy | Older ciphers; Twofish was an AES finalist. |

## How to Run
1. Run modern ciphers & speed benchmark: `node 01-modern-and-speed.js`
2. Test legacy & broken ciphers: `node 02-legacy-and-broken.js`

## My Benchmark Results (50 MB Payload)

| Algorithm | Time | Relative Speed | Key Takeaway |
| :--- | :--- | :--- | :--- |
| **AES-256-GCM** | `36.878ms` | Fastest (Baseline) | Benefits from modern CPU hardware acceleration (AES-NI). |
| **ChaCha20-Poly1305** | `49.477ms` | ~1.3x slower than AES | Very fast stream cipher; excels on mobile devices without AES hardware. |
| **3DES** | `1.808s` (`1808ms`) | **~49x slower than AES** | Legacy cipher; massive performance penalty confirms why it is being retired. |

### Security & Integrity Checks
* **Broken Algorithms (`DES`, `RC4`):** Blocked at runtime (`ERR_OSSL_EVP_UNSUPPORTED`) by modern OpenSSL/Node.js defaults.
* **Tamper Detection (`AES-256-GCM`):** Modifying a single byte of ciphertext caused decryption to fail immediately (`Unsupported state or unable to authenticate data`).


