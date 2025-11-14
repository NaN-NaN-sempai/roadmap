import { ADMIN_USER, ADMIN_PASS } from '$env/static/private';
import { 
    checkAttempt, registerFail, registerSuccess,
    MAX_ATTEMPTS, BLOCK_TIME
} from '$lib/loginGuard.js';

import { json } from "@sveltejs/kit";
import { kv } from '@vercel/kv';

import LZString from "lz-string";

export async function POST({ request, getClientAddress, cookies }) {
    const ip = getClientAddress();    

    //return new Response(JSON.stringify({ ok: true }), { status: 200 });
    
    const cookieBlock = cookies.get("login_block");
    if (cookieBlock) {
        const expires = Number(cookieBlock);
        if (Date.now() < expires) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    blocked: true,
                    wait: expires - Date.now()
                }),
                { status: 429 }
            );
        }
    }

    const attempt = await checkAttempt(ip);
    
    if (attempt.blocked) {
        cookies.set("login_block", String(Date.now() + BLOCK_TIME), {
            path: "/",
            httpOnly: true,
            maxAge: BLOCK_TIME / 1000
        });
        return new Response(
            JSON.stringify({ ok: false, blocked: true, wait: attempt.wait }),
            { status: 429 }
        );
    }

    const form = await request.formData();
    const user = form.get("user");
    const pass = form.get("pass");
    


    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        await registerSuccess(ip);
        cookies.delete("login_block", { path: "/" });
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    await registerFail(ip);


    return new Response(JSON.stringify({ ok: false }), { status: 401 });
}