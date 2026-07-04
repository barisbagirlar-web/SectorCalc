import forbiddenHashes from "../../../data/governance/forbidden-token-hashes.json";

const forbiddenHashSet = new Set(forbiddenHashes);

// Standard Turkish character range check (using code points to avoid raw characters in code)
const TURKISH_CHAR_CODES = [
  199, 231, // C, c
  286, 287, // G, g
  304, 305, // I, i
  214, 246, // O, o
  350, 351, // S, s
  220, 252  // U, u
];
const TURKISH_PATTERN = new RegExp("[" + TURKISH_CHAR_CODES.map(c => String.fromCharCode(c)).join("") + "]", "u");

/**
 * Pure JavaScript synchronous SHA-256 hash implementation.
 * Safe for execution in both Node.js and browser client/webpack environments.
 */
function sha256Sync(str: string): string {
  function rotr(n: number, x: number) {
    return (x >>> n) | (x << (32 - n));
  }
  
  const h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push((code >> 6) | 192);
      bytes.push((code & 63) | 128);
    } else {
      bytes.push((code >> 12) | 224);
      bytes.push(((code >> 6) & 63) | 128);
      bytes.push((code & 63) | 128);
    }
  }
  
  const byteLength = bytes.length;
  bytes.push(0x80);
  while ((bytes.length + 8) % 64 !== 0) {
    bytes.push(0);
  }
  
  const bitsLength = byteLength * 8;
  const bitsLengthHex = bitsLength.toString(16).padStart(16, '0');
  for (let i = 0; i < 8; i++) {
    bytes.push(parseInt(bitsLengthHex.slice(i * 2, i * 2 + 2), 16));
  }
  
  for (let i = 0; i < bytes.length; i += 64) {
    const w = new Array(64);
    for (let j = 0; j < 16; j++) {
      w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(7, w[j - 15]) ^ rotr(18, w[j - 15]) ^ (w[j - 15] >>> 3);
      const s1 = rotr(17, w[j - 2]) ^ rotr(19, w[j - 2]) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    
    let [a, b, c, d, e, f, g, h0] = h;
    for (let j = 0; j < 64; j++) {
      const S1 = (rotr(6, e) ^ rotr(11, e) ^ rotr(25, e)) | 0;
      const ch = ((e & f) ^ (~e & g)) | 0;
      const temp1 = (h0 + S1 + ch + k[j] + w[j]) | 0;
      const S0 = (rotr(2, a) ^ rotr(13, a) ^ rotr(22, a)) | 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) | 0;
      const temp2 = (S0 + maj) | 0;
      
      h0 = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    
    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0;
    h[5] = (h[5] + f) | 0;
    h[6] = (h[6] + g) | 0;
    h[7] = (h[7] + h0) | 0;
  }
  
  return h.map(val => (val >>> 0).toString(16).padStart(8, '0')).join('');
}

/**
 * Check if a string contains a Turkish token.
 * Uses SHA-256 hashes from forbidden-token-hashes.json.
 * Returns the first matching token or "unicode_char" or null.
 */
export function hasTurkishToken(value: string): string | null {
  if (!value || typeof value !== "string") return null;

  // 1. Unicode character range check
  if (TURKISH_PATTERN.test(value)) {
    const match = value.match(TURKISH_PATTERN);
    return match ? match[0] : "unicode_char";
  }

  // 2. Hash check for transliterated tokens
  const lower = value.toLowerCase().trim();
  // Split by camelCase boundaries, underscores, whitespace, hyphens, slashes
  const parts = lower.split(/(?<=[a-z])(?=[A-Z])|_|\s+|[-/]/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.length < 3) continue;

    // Isomorphic SHA-256 token hashing
    const hash = sha256Sync(trimmed);
    if (forbiddenHashSet.has(hash)) {
      return trimmed;
    }
  }

  return null;
}

/**
 * Check if a value is pure English (no Turkish tokens)
 */
export function isPureEnglish(value: string): boolean {
  return hasTurkishToken(value) === null;
}
