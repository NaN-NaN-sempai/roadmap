<script>
    import { goto } from '$app/navigation';
    import { objToStr, strToObj } from '$lib/parser.js';
    import { onMount } from 'svelte';

    let inAdm = 0;

    export let data;
    let { blocked, kvData } = data;
    let doneList = [];

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
    const buildStructure = (arr) => {

        const uniqueTags = [...new Set(arr.flatMap(item => item.tags))];

        for (let i = 0; i < uniqueTags.length; i++) {
            if(uniqueTags[i] == undefined) continue;
            const color = randomHex();
            const contrast = getContrastingColor(color);
            tagColors[uniqueTags[i]] = `--color: ${color}; --contrast: ${contrast};`;
        }
        console.log(tagColors);
        
        
        doneList = arr.filter(item => {
            if(item.done || item.subitens?.find(subitem => subitem.done) != null) return item;
        });
    }
    buildStructure(kvData);
    


    /* 
    
    let str = [
        gi("LhsMP", ["Slider de velocidade", "☑Slider de volume"]),
        gi(gt("☑LhsML", "https://google.com", ["compiler", "html"]), ["Refactor tokenizer and parser"]),
        gi(gt("JAZZ", null, ["compiler", "styling"]), ["Elaborate synthax", "Build parser"]),
    ].join("␝");
    
    */

    

    onMount(() => {
        if(blocked) {
            goto("/block");
        }
    })


    let kvCopy = [...kvData];
    const resetCopy = () => kvCopy = JSON.parse(JSON.stringify(kvCopy));

    let showForm = false;

    let form;

    const formSubmit = async (e) => {
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
            showForm = false;
            kvCopy = [...kvData];
            console.log(kvCopy);
            
        } else {
            alert("Invalid credentials.");

            blocked = data.blocked;
            if(blocked) {
                alert("Sorry, you are now blocked.");
                goto("/block");
            }
        }        
    }

    const moveInArr = (item, arr, move) => {
        const index = arr.indexOf(item);        
        if(index + move == -1 || move == 0 || index + move >= arr.length) return;

        arr.splice(index + move, 0, arr.splice(index, 1)[0]); 
        console.log(index, move, arr.length, arr.indexOf(item), arr);

        resetCopy();
    }

    const cancel = () => {
        inAdm = false;
        kvCopy = kvData;
    }
    const save = async () => {
        let str = objToStr(kvCopy);
        console.log(str);
        console.log(strToObj(str));

        const fm = new FormData(form);   
        let user = fm.get("user");
        let pass = fm.get("pass");

        const res = await fetch("/api/setval", {
            method: "POST",
            body: JSON.stringify({ user, pass, data: str }),
        });
        
        const data = await res.json();
        if(data.ok) {
            resetCopy();
            buildStructure(kvCopy);
            inAdm = false;
            form.reset();
        }
    }
</script>


<div class="content">
    <h1>Luís Henrique Space<br>Roadmap</h1>

    <form action="/api/login" style={!showForm && "display: none"} method="POST" on:submit|preventDefault={formSubmit} bind:this={form}>
        <input type="password" class="btn bordered" name="user" placeholder="user">
        <input type="password" class="btn bordered" name="pass" placeholder="pass">
        <button type="submit" class="btn bordered">login</button>
    </form>
    {#if !inAdm && !blocked}
        {#if !showForm}
            <button class="btn bordered" on:click={() => showForm = true}>edit</button>
        {/if}

    {:else}
        <div>
            <button class="btn bordered" on:click={cancel}>cancel</button>
            <button class="btn bordered" on:click={save}>save</button>
        </div>
    {/if}

    <h2>Projects</h2>

    {#if inAdm}
        <button class="btn bordered plus" on:click={() => {
            kvCopy.unshift({title: "", subitens: []});
            resetCopy();            
        }}>+ item</button>
    {/if}

    {#if !kvCopy.length}
        <h2>~ No items ~</h2>
        <br> <br>
    {/if}
    {#each kvCopy as item, index }
    {#if !item.done || inAdm}
        
        <div class="roadmapItem">
            <div class="item">
                {#if !inAdm}
                    <a class="itemTitle bordered"
                        class:done={item.done}
                        href={item.link} target="_blank">

                        {item.title}
                        {#each item.tags as tag }
                            <span class="tag" style={tagColors[tag]}>{tag}</span>
                        {/each}
                    </a>

                {:else}
                    <div class="input">
                        {#if index} <button class="btn bordered plus" on:click={() => moveInArr(item, kvCopy, -1)}>↑</button> {/if}
                        {#if index != kvCopy.length - 1} <button class="btn bordered plus" on:click={() => moveInArr(item, kvCopy, 1)}>↓</button> {/if}
                    </div>

                    <textarea
                        class="itemTitle bordered"
                        class:done={item.done}
                        class:delete={item.delete}
                        bind:value={item.title}></textarea>

                    <div class="input">
                        <input class="btn bordered plus" placeholder="link" bind:value={item.link} />
                        <input class="btn bordered plus" placeholder="tags (separated by ',' )" value={item?.tags?.join(", ")}
                        on:input={(e) => item.tags = e.target.value.split(", ")} />
                    </div>

                    <button class="btn bordered plus"
                    on:click={() => {
                        item.subitens.unshift({name: ""});
                        resetCopy();
                    }}>+</button>

                    <div class="input">
                        <button class="btn bordered plus conclude"
                        on:click={() => item.done = !item?.done}>✓</button>
                        <button class="btn bordered plus del" 
                        on:click={() => item.delete = !item?.delete}>🗑</button>
                    </div>
                {/if}
            </div>
            

            {#each item.subitens as subitem, subindex }
                <div class="subitemContainer">
                    {#if !inAdm}
                    <p class="subItem bordered"
                        class:done={subitem.done}
                        class:delete={subitem.delete || item.delete}>
                        
                        {subitem.name} 
                    </p>
                    {:else}

                    <div class="input">
                        {#if subindex} <button class="btn bordered plus" on:click={() => moveInArr(subitem, item.subitens, -1)}>↑</button> {/if}
                        {#if subindex < item.subitens.length - 1} <button class="btn bordered plus" on:click={() => moveInArr(subitem, item.subitens, 1)}>↓</button> {/if}
                    </div>

                    <textarea
                        class="subItem bordered"
                        class:done={subitem.done}    
                        class:delete={subitem.delete || item.delete}
                        bind:value={subitem.name}></textarea>

                    <div class="input">
                        <button class="btn bordered plus conclude"
                        on:click={() => subitem.done = !subitem?.done}>✓</button>
                        <button class="btn bordered plus del" 
                        on:click={() => subitem.delete = !subitem?.delete}>🗑</button>
                    </div>
                    {/if}
                </div>
            {/each}
        </div>

    {/if}
    {/each}

    {#if !inAdm}
    
    <h2>Finished</h2>
    {#if !doneList.length && !inAdm}
        <h2>~ No items ~</h2>
        <br> <br>
    {/if}
    {#each doneList as item }
    
        <div class="roadmapItem">
            <div class="item">
                <a class="itemTitle bordered {item.done && "done"}" href={item.link} target="_blank">
                    {item.title}
                    {#each item.tags as tag }
                        <span class="tag" style={tagColors[tag]}>{tag}</span>
                    {/each}
                </a>
            </div>
            

            {#each item.subitens as subitem }
                <div class="subitemContainer">
                    <p class="subItem bordered {subitem.done && "done"}"> {subitem.name} </p>
                </div>
            {/each}
        </div>
    {/each}
    {/if}
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

            .itemTitle, .subItem {
                &.done {
                    border-color: green;
                    color: green;
                }

                &.delete {
                    border-color: #ff4d4d;
                    color: #ff4d4d;
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
                text-decoration: none;

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