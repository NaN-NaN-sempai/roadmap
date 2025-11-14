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

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

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

    if (attempt.blocked) {
        return new Response(
            JSON.stringify({ ok: false, blocked: true, wait: attempt.wait }),
            { status: 429 }
        );
    }

    const form = await request.formData();
    const user = form.get("user");
    const pass = form.get("pass");

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        registerSuccess(ip);
        cookies.delete("login_block", { path: "/" });
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    registerFail(ip);

    const newAttempt = checkAttempt(ip);
    if (newAttempt.blocked) {
        cookies.set("login_block", String(Date.now() + BLOCK_TIME), {
            path: "/",
            httpOnly: true,
            maxAge: BLOCK_TIME / 1000
        });
    }

    return new Response(JSON.stringify({ ok: false }), { status: 401 });
}


export async function GET(request) {

    const gi = (str, itens) => {
        return [str, ...itens].join("␟");
    }
    const gt = (str, link, tags=[]) => {
        if(link) str += "␜" + link;
        return [str, ...tags].join("␞");
    }

    let str = [
        gi("LhsMP", ["Slider de velocidade", "☑Slider de volume"]),
        gi(gt("LhsML", null, ["compiler", "html"]), ["Refactor tokenizer and parser"]),
        gi(gt("JAZZ", null, ["compiler", "styling"]), ["Elaborate synthax", "Build parser"]),
    ].join("␝");

    const compressed = LZString.compress(str);
    
    const decompressed = LZString.decompress(compressed);

    const parser = (src) => {

        const itens = src.split("␝");
        
        return itens.map((item) => {
            const composedTitle = item.split("␟")[0];
            const subitens = item.split("␟").slice(1).map((subitem) => {
                const status = subitem.startsWith("☑");
                return {
                    name: subitem.slice(status ? 1 : 0),
                    status
                }
            });
            let title;
            let link;
            let tags;
            
            if(composedTitle.includes("␜")) {
                title = composedTitle.split("␜")[0];
                
                link = composedTitle.split("␜")[1];
            }
            if(composedTitle.includes("␞")) {
                if(title == null) title = composedTitle.split("␞")[0];
                tags = composedTitle.split("␞").slice(1);
            }
            if(title == null) title = composedTitle;

            return {
                title,
                link,
                tags,
                subitens
            };
        });
    }

    console.log(parser(decompressed));

    return new Response({});
    

    //kv.set("roadmapData", "LhsMP␟Slider de velocidade␟Slider de volume␝LhsML");
    
}