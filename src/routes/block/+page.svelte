<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data;

    onMount(() => {
        if(!data.blocked) goto("/");
    });
</script>

<h1> COPY RESUME PAGE WITH CHARACTER !!!! </h1>
<h1> You are blocked </h1>
<h2> Too many login attempts </h2>

<style lang="scss">
    @use "lhs-svelte-lib/sass/palette";
    @use "lhs-svelte-lib/sass/fonts";

    h1, h2 {
        color: palette.$highlight;
        text-align: center;
        font-family: robotoMono;
        text-transform: uppercase;
        text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.25);
        font-weight: bold;
    }
</style>