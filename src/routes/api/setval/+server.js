import { ADMIN_USER, ADMIN_PASS } from '$env/static/private';

import { json } from "@sveltejs/kit";
import { kv } from '@vercel/kv';

import LZString from "lz-string";

export async function POST({ request }) {
    const {user, pass, data} = await request.json();

    if (user != ADMIN_USER || pass != ADMIN_PASS) {
        return json({ ok: false });
    }

    await kv.set('roadmap', data);
    
    return json({ ok: true });
}