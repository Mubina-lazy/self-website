// Supabase Edge Function: send-push
// Triggered by Database Webhook on chat_messages INSERT
// Deploy: Supabase Dashboard → Edge Functions → New function → paste this code
// Then: Database → Webhooks → New webhook → Table: chat_messages, Event: INSERT → HTTP Request → Edge Function URL

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC = 'E5PNWsgtY3lCHfSpt7WPFrkQboUSlH54dLO2egUSXk7IwAEMxnalDhkWT7l8sOBrZpyTdZdCnG7bA0G3iG5JUg';
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const VAPID_SUBJECT = 'mailto:mubinabkhdr@gmail.com';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ── VAPID JWT ─────────────────────────────────────────────────
async function importPrivateKey(b64url: string): Promise<CryptoKey> {
  const raw = base64urlToUint8Array(b64url);
  return crypto.subtle.importKey(
    'raw', raw, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  ).catch(async () => {
    // Try as pkcs8
    return crypto.subtle.importKey(
      'pkcs8',
      buildPkcs8(raw),
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, ['sign']
    );
  });
}

function base64urlToUint8Array(b64: string): Uint8Array {
  const pad = b64 + '='.repeat((4 - b64.length % 4) % 4);
  const bin = atob(pad.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...bin].map(c => c.charCodeAt(0)));
}

function uint8ArrayToBase64url(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function buildPkcs8(rawKey: Uint8Array): Uint8Array {
  // PKCS8 wrapper for P-256 raw private key (32 bytes)
  const header = new Uint8Array([
    0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06,
    0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
    0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03,
    0x01, 0x07, 0x04, 0x27, 0x30, 0x25, 0x02, 0x01,
    0x01, 0x04, 0x20
  ]);
  const result = new Uint8Array(header.length + rawKey.length);
  result.set(header);
  result.set(rawKey, header.length);
  return result;
}

async function makeVapidJwt(audience: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = uint8ArrayToBase64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = uint8ArrayToBase64url(new TextEncoder().encode(JSON.stringify({
    aud: audience, exp: now + 43200, sub: VAPID_SUBJECT
  })));
  const unsigned = `${header}.${payload}`;

  const rawPriv = base64urlToUint8Array(VAPID_PRIVATE);
  const pkcs8 = buildPkcs8(rawPriv);
  const key = await crypto.subtle.importKey(
    'pkcs8', pkcs8, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsigned)
  );
  return `${unsigned}.${uint8ArrayToBase64url(new Uint8Array(sig))}`;
}

// ── SEND PUSH ─────────────────────────────────────────────────
async function sendPush(sub: { endpoint: string; p256dh: string; auth: string }, payload: string): Promise<boolean> {
  const url = new URL(sub.endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const jwt = await makeVapidJwt(audience);

  const res = await fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'TTL': '86400',
      'Authorization': `vapid t=${jwt},k=${VAPID_PUBLIC}`,
      'Content-Encoding': 'aes128gcm',
    },
    body: await encryptPayload(payload, sub.p256dh, sub.auth),
  });

  if (res.status === 410 || res.status === 404) {
    // Subscription expired — remove it
    await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
  }
  return res.ok;
}

// AES-128-GCM encryption for Web Push
async function encryptPayload(payload: string, p256dhB64: string, authB64: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const payloadBytes = enc.encode(payload);

  const serverKeys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits']);
  const serverPublicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', serverKeys.publicKey));

  const clientPubRaw = base64urlToUint8Array(p256dhB64);
  const clientPubKey = await crypto.subtle.importKey('raw', clientPubRaw, { name: 'ECDH', namedCurve: 'P-256' }, false, []);

  const sharedBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: clientPubKey }, serverKeys.privateKey, 256);

  const authSecret = base64urlToUint8Array(authB64);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF
  async function hkdf(ikm: ArrayBuffer, salt: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
    const ikmKey = await crypto.subtle.importKey('raw', ikm, { name: 'HKDF' }, false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, ikmKey, length * 8);
    return new Uint8Array(bits);
  }

  const prk = await hkdf(sharedBits, authSecret,
    concat(enc.encode('WebPush: info\x00'), clientPubRaw, serverPublicRaw), 32);

  const cek = await hkdf(prk, salt,
    concat(enc.encode('Content-Encoding: aes128gcm\x00'), new Uint8Array([0, 16])), 16);
  const nonce = await hkdf(prk, salt,
    concat(enc.encode('Content-Encoding: nonce\x00'), new Uint8Array([0, 12])), 12);

  const aesKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const paddedPayload = concat(payloadBytes, new Uint8Array([0x02]));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, paddedPayload));

  // Build RFC 8188 header (salt 16 + rs 4 + idlen 1 + server pub 65)
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096, false);
  const header = concat(salt, rs, new Uint8Array([serverPublicRaw.length]), serverPublicRaw);
  return concat(header, encrypted);
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) { result.set(a, offset); offset += a.length; }
  return result;
}

// ── HANDLER ───────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body = await req.json();
  const record = body.record; // chat_messages row
  if (!record) return new Response('No record', { status: 400 });

  // Only send push when admin sends a message
  if (!record.is_admin) return new Response('Not admin message', { status: 200 });

  const userId = record.thread_user_id;
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId);

  if (!subs || subs.length === 0) return new Response('No subscriptions', { status: 200 });

  const msgText = record.message.startsWith('__IMG__')
    ? '📷 Rasm yuborildi'
    : record.message.startsWith('__STICKER__')
    ? record.message.replace('__STICKER__', '') + ' Stiker'
    : record.message;

  const payload = JSON.stringify({
    title: '💌 Mubinadan yangi habar!',
    body: msgText.length > 80 ? msgText.slice(0, 80) + '…' : msgText,
    url: 'https://mubina-lazy.github.io/self-website/dashboard.html'
  });

  await Promise.all(subs.map(s => sendPush(s, payload)));

  return new Response('OK', { status: 200 });
});
