export function load({ cookies }) {
    const block = cookies.get("login_block");

    return {
        blocked: !!block
    };
}