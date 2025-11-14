import { strToObj } from "$lib/parser.js";
import LZString from "lz-string";
import { kv } from '@vercel/kv';

export async function load({ cookies }) {
    const block = cookies.get("login_block");

    if (!!block) return { blocked: true };
    
    let kvData;

    const getKv = await kv.get("roadmap");

    if(!getKv) kvData = [];
    else {
        console.log(getKv, LZString.decompress(getKv));
        
        kvData = strToObj(getKv);
    }

    return {
        blocked: !!block,
        kvData
    };
}