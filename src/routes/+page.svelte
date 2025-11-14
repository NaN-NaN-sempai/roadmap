<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let inAdm = 0;

    export let data;
    let { blocked, kvData } = data;
    
    const uniqueTags = [...new Set(kvData.flatMap(item => item.tags))];

    const tagColors = {};

    const randomHex = () => "#"+Math.floor(Math.random() * 16777215).toString(16);
    
    const getContrastingColor = (hex) => {
        hex = hex.replace('#', '');

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        let brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 128 ? '#000000' : '#FFFFFF';
    }
    for (let i = 0; i < uniqueTags.length; i++) {
        if(uniqueTags[i] == undefined) continue;
        const color = randomHex();
        const contrast = getContrastingColor(color);
        tagColors[uniqueTags[i]] = `--color: ${color}; --contrast: ${contrast};`;
    }
    

    onMount(() => {
        if(blocked) {
            goto("/block");
        }
    })


    let showForm = false;
    
    const workingOn = [
        ["LhsMP I",
        "slider de velocidade",
        "slider de volume",],
        ["LhsMP",
        "slider de velocidade",
        "slider de volume",]
    ];

    const formSubmit = async (e) => {
        const form = e.target;
        const body = new FormData(form);        

        const path = form.action;
        const method = form.method;

        const res = await fetch(path, {
            method,
            body,
        });

        const data = await res.json();
        

        if(data.ok) {
            inAdm = true;
        } else {
            alert("Invalid credentials.");

            blocked = data.blocked;
            if(blocked) {
                alert("Sorry, you are now blocked.");
            }
        }        
    }
</script>


<div class="content">
    <h1>Luís Henrique Space<br>Roadmap</h1>

    <button on:click={() => fetch("/api/login")}> proto </button>

    {#if !inAdm && !blocked}

    {#if !showForm}
    <button class="btn bordered" on:click={() => showForm = true}>edit</button>
    {:else}
    <form action="/api/login" method="POST" on:submit|preventDefault={formSubmit}>
        <input type="password" class="btn bordered" name="user" placeholder="user">
        <input type="password" class="btn bordered" name="pass" placeholder="pass">
        <button type="submit" class="btn bordered">login</button>
    </form>
    {/if}

    {/if}
    {#if inAdm}
    <button class="btn bordered">save</button>
    {/if}

    <h2>Working On</h2>
    <button class="btn bordered plus">+ item</button>

    {#each kvData as item }
        <div class="roadmapItem">
            <div class="item">
                {#if !inAdm}
                <p class="itemTitle bordered">
                    {item.title}
                    {#each item.tags as tag }
                        <span class="tag" style={tagColors[tag]}>{tag}</span>
                    {/each}
                </p>
                {:else}
                <div class="input">
                    <button class="btn bordered plus">↑</button>
                    <button class="btn bordered plus">↓</button>
                </div>
                <textarea class="itemTitle bordered"> {item.title} </textarea>
                <div class="input">
                    <input class="btn bordered plus" placeholder="link" value={item.link} />
                    <input class="btn bordered plus" placeholder="tags (separated by ',' )" value={item?.tags?.join(", ")} />
                </div>
                <button class="btn bordered plus">+</button>
                <div class="input">
                    <button class="btn bordered plus conclude">✓</button>
                    <button class="btn bordered plus del">🗑</button>
                </div>
                {/if}
            </div>
            

            {#each item.subitens as subitem }
                <div class="subitemContainer">
                    {#if !inAdm}
                    <p class="subItem bordered"> {subitem.name} </p>
                    {:else}
                    <div class="input">
                        <button class="btn bordered plus">↑</button>
                        <button class="btn bordered plus">↓</button>
                    </div>
                    <textarea class="subItem bordered"> {subitem.name} </textarea>
                    <div class="input">
                        <button class="btn bordered plus conclude">✓</button>
                        <button class="btn bordered plus del">🗑</button>
                    </div>
                    {/if}
                </div>
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
        margin-bottom: 10px;
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
    }
    .bordered.btn {
        text-align: center;
        width: auto;
        margin: 0;
        padding: 10px 20px;
        margin-bottom: 50px;
        font-family: sansation;
        text-transform: uppercase;
        font-weight: bold;
    }

    textarea.bordered {
        color: white;
        text-decoration: underline;
    }


    button.btn {
        cursor: pointer;
    }
    button.btn.plus, input.btn.plus {
        font-size: 1rem;
        margin: 10px;
        color: palette.$auxiliar;
        border-color: palette.$auxiliar;
    }
    input.btn.plus {
        text-transform: none;
    }

    .roadmapItem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
        margin-bottom: 30px;


        .item, .subitemContainer {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            
            .input {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: auto;
                gap: 5px;

                & input {
                    text-align: left;
                }
                & button, & input {
                    margin: 0;

                    &.conclude {
                        color: green;
                        border-color: green;
                    }

                    &.del {
                        color: #ff4d4d;
                        border-color: #ff4d4d;
                    }
                }
            }

            textarea.itemTitle {
                height: 2rem;
            }
            .itemTitle {
                font-size: 2rem;
                font-weight: bold;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10px;

                .tag:nth-child(1) {
                    margin-left: 30px;
                    &::before {
                        content: "●";
                        margin-right: 10px;
                        position: absolute;
                        left: -25px;
                        color: palette.$highlight;
                    }
                }
                .tag {
                    position: relative;
                    --color: palette.$highlight;
                    --contrast: palette.$secondary;
                    font-size: .7rem;
                    background: var(--color);
                    color: var(--contrast);
                    border: 1px solid var(--contrast);
                    padding: 2px 7px;
                    border-radius: 9999px;
                }
            }

            textarea.subItem {
                height: 2rem;
                margin-inline: 0;
            }
            .subItem {
                font-weight: 600;
                margin-inline: 40px;
                padding-left: 20px;
                padding-block: 10px;
                width: 100%;
                font-family: moupali;

                &::before {
                    content: "●";
                    margin-right: 10px;
                }
            }
        }
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