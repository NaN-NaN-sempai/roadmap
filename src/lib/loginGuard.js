import { kv } from '@vercel/kv';

export const MAX_ATTEMPTS = 2;
export const BLOCK_TIME = 6 * 60 * 60 * 1000;

export async function checkAttempt(ip) {
    const entry = await kv.get(`login:${ip}`);

    if (!entry) return { blocked: false };

    if (entry.blockUntil && Date.now() < entry.blockUntil) {
        return {
            blocked: true,
            wait: entry.blockUntil - Date.now()
        };
    }

    return { blocked: false };
}

export async function registerFail(ip) {
    const entry = (await kv.get(`login:${ip}`)) || { count: 0 };
    entry.count++;

    if (entry.count > MAX_ATTEMPTS) {
        entry.blockUntil = Date.now() + BLOCK_TIME;
    }

    await kv.set(`login:${ip}`, entry, { ex: BLOCK_TIME / 1000 });
}

export async function registerSuccess(ip) {
    await kv.del(`login:${ip}`);
}
