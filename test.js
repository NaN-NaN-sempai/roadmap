import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { kv } from "@vercel/kv";

async function testKV() {
  try {
    await kv.set("hello", "world");
    const value = await kv.get("hello");
    console.log("KV OK:", value);
  } catch (err) {
    console.error("Erro KV:", err);
  }
}

testKV();
