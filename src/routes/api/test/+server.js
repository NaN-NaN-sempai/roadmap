import kv from '$lib/server/kv';

export async function GET() {
    await kv.set('hello', 'world');
    const value = await kv.get('hello');

    return new Response(JSON.stringify({ value }), {
        headers: { 'Content-Type': 'application/json' }
    });
}