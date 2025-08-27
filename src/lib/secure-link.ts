// Lightweight AES-GCM encrypt/decrypt for embedding small payloads in URLs.
// NOTE: Frontend-only crypto is obfuscation, not true security. Use a backend for real secrecy.

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const str = atob(normalized);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function importKeyFromSecret(secret: string): Promise<CryptoKey> {
  // Derive key material by hashing the secret (UTF-8) with SHA-256
  const secretBytes = textEncoder.encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', secretBytes);
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptPayload(payload: unknown, secret?: string): Promise<string> {
  const usedSecret = secret ?? (import.meta as any).env?.VITE_LINK_SECRET ?? '';
  const key = await importKeyFromSecret(String(usedSecret));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = textEncoder.encode(JSON.stringify(payload));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data));
  const token = `${base64UrlEncode(iv)}.${base64UrlEncode(cipher)}`;
  return token;
}

export async function decryptPayload(token: string, secret?: string): Promise<any | null> {
  try {
    const usedSecret = secret ?? (import.meta as any).env?.VITE_LINK_SECRET ?? '';
    const key = await importKeyFromSecret(String(usedSecret));
    const [ivB64, dataB64] = token.split('.');
    if (!ivB64 || !dataB64) return null;
    const iv = base64UrlDecode(ivB64);
    const cipher = base64UrlDecode(dataB64);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
    const text = textDecoder.decode(new Uint8Array(plain));
    return JSON.parse(text);
  } catch {
    return null;
  }
}


