<script>
    const inAdm = false;



    const workingOn = [
        ["LhsMP",
        "slider de velocidade",
        "slider de volume",],
        ["LhsMP",
        "slider de velocidade",
        "slider de volume",]
    ];

</script>


<div class="content">
    <h1>Luís Henrique Space<br>Roadmap</h1>
    <h2>Working On</h2>

    {#each workingOn as item}
        <div class="roadmapItem"> 
            {#each item as text, index }
                {#if index == 0}
                    <p class="itemTitle bordered"> {text} </p>
                {:else}
                    <div class="subitemContainer">
                        <p class="subItem bordered"> {text} </p>
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
</div>



<style lang="scss">
    @use "lhs-svelte-lib/sass/palette";
    @use "lhs-svelte-lib/sass/fonts";

    h1, h2 {
        color: palette.$highlight;
        text-align: center;
        font-family: robotoMono;
        text-transform: uppercase;
        text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.25);
        font-size: 3rem;
        margin-bottom: 50px;
    }

    h2 {
        font-size: 2rem;
        font-weight: 150;
    }

    .bordered {
        color: palette.$highlight;
        font-family: sansation;
        padding-left: 50px;
        padding-block: 15px;
        border: 5px solid palette.$highlight;
        border-radius: 9999px;
        background: palette.$secondary;
        width: 100%;
        text-align: left;
        text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.25);
    }
    .itemTitle {
        text-transform: uppercase;
        font-size: 2rem;
        font-weight: bold;
    }
    .subitemContainer {
        width: 100%;
    }
    .subItem {
        font-weight: 600;
        margin-inline: 20px;
        padding-left: 20px;
        padding-block: 10px;
        width: auto;
        font-family: moupali;

        &::before {
            content: "●";
            margin-right: 20px;
        }
    }

    .roadmapItem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
        margin-bottom: 30px;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 1000px;
        width: 100%;
        margin: auto;
    }

</style>