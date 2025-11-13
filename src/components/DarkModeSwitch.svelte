<script>
    import { onMount } from "svelte";

    let checked = false;

    const setupLocalValue = () => {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const getColor = (bool) => (bool ?
            'color: #d14f0e; background: #0f1016; border: 3px solid #1f2231;' :
            'color: #E9773C; background: #ffd39c; border: 3px solid #f8a162;')
            + "padding-inline: 7px; border-radius: 10px;"; 
        const getColorName = (bool) => bool? "Dark": "Light"

        console.log(`Color scheme preferences: %c${getColorName(prefersDarkScheme)}`, getColor(prefersDarkScheme)); 

        let savedScheme = JSON.parse(localStorage.getItem("darkmode"));
        if(savedScheme != null)
            return console.log(`Using saved color scheme: %c${getColorName(savedScheme)}`, getColor(savedScheme));
       

        localStorage.setItem("darkmode", prefersDarkScheme);
    }

    const saveCheck = () => {        
        localStorage.setItem("darkmode", checked);
        changeIcon(!checked);
    }

    
    let doAnimaiton = false;
    const playAnimation = () => {
        let selector = document.querySelector('.switch__indicator');
        doAnimaiton = true;
        
        const animEnd = () => {
            doAnimaiton = false;
            console.log("ENDED");            
            
            selector.removeEventListener("animationend", animEnd);
        }
        selector.addEventListener("animationend", animEnd);
    }

    const changeIcon = (bool) => {
        let favicon = document.querySelector("link[rel~='icon']");

        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }

        favicon.href = bool?
            "/favicon.png":
            "/faviconDark.png";
        
    }

    onMount(() => {
        doAnimaiton = false;
        setupLocalValue();

        checked = !JSON.parse(localStorage.getItem("darkmode"));

        const params = new URLSearchParams(location.hash.substring(1));
        if(params.get('dm')){
            checked = !(params.get('dm') == "1");
        }
        
        changeIcon(checked);
    });
</script>

<div class="switch">
    <input type="checkbox" class="switch__input" id="darkModeSwitch" bind:checked={checked} on:input={saveCheck} on:input={playAnimation}>
    <label class="switch__label" for="darkModeSwitch">
        <span class="switch__indicator {doAnimaiton? "animate": ""}"></span>
        <span class="switch__decoration"></span>
    </label>
</div>

<style lang="scss">
    /*
    Thanks to Murray Nuttall on CodePen
    https://codepen.io/irunatbullets/pen/MWwyVOw
    */

    @use "$style/palette";

    .switch {
        display: inline-block;
        position: relative;
        filter: drop-shadow(-10px 15px 5px rgba(0, 0, 0, 0.25));
    }

    .switch__input {
        clip: rect(1px, 1px, 1px, 1px);
        clip-path: inset(50%);
        height: 1px;
        width: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
    }

    .switch__label {
        position: relative;
        display: inline-block;
        width: 120px;
        height: 60px;
        background: palette.$secondary;
        border: 5px solid palette.$iconbg;
        border-radius: 9999px;
        cursor: url("/assets/cursor/toDay.png"), auto;
        transition: all 0.4s cubic-bezier(.46,.03,.52,.96);
    }

    .switch__indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateX(-72%);
        display: block;
        --size: 40px;
        width: var(--size);
        height: var(--size);
        background-color: palette.$moonGrey;
        border-radius: 9999px;
        box-shadow: 10px 0px 0 0 rgba(#000000, 0.2) inset;

        overflow: hidden;
        
        &.animate {
            animation: celestialBody .4s linear;
            &::before {
                animation: decorationAnimation .4s linear;
            }
        }

        @keyframes celestialBody {
            0% {
                width: calc(var(--size));
                height: calc(var(--size));
            }   
            50% {
                width: calc(var(--size) * 1.4);
                height: calc(var(--size) * 1.4);
            }
            to {
                width: calc(var(--size));
                height: calc(var(--size));
            }
        }

        @keyframes decorationAnimation {
            0% {
                width: 9px;
                height: 9px;
            }   
            50% {
                width: 27px;
                height: 27px;
            }
            to {
                width: 9px;
                height: 9px;
            }
        }

        &::before,
        &::after {
            position: absolute;
            content: '';
            display: block;
            background-color: #FFFFFF;
            border-radius: 9999px;
        }

        &::before {
            top: 7px;
            left: 7px;
            width: 9px;
            height: 9px;
            opacity: 0.6;
        }

        &::after {
            bottom: 8px;
            right: 6px;
            width: 14px;
            height: 14px;
            opacity: 0.8;
        }
    }

    .switch__decoration {
        position: absolute;
        top: 65%;
        left: 50%;
        display: block;
        width: 5px;
        height: 5px;
        background-color: transparent;
        border-radius: 9999px;
        animation: twinkle 0.8s infinite -0.6s;

        &::before,
        &::after {
            position: absolute;
            display: block;
            content: '\2726';
            width: 5px;
            height: 5px;
            background-color: transparent;
            color: #FFFFFF;
            border-radius: 9999px;
        }

        &::before {
            top: -35px;
            left: 5px;
            opacity: 1;
        }

        &::after {
            top: -10px;
            left: 25px;
        }
    }

    @keyframes twinkle {
        50% { opacity: 0.2; }
    }

    .switch__indicator {
        &,
        &::before,
        &::after {
            transition: all 0.4s cubic-bezier(.46,.03,.52,.96);
        }
    }

    .switch__input:checked + .switch__label {
        background-color: #8FB5F5;
        border-color: palette.$highlight;
        cursor: url("/assets/cursor/toNight.png"), auto;


        .switch__indicator {
            background: linear-gradient(#ECD21F, palette.$highlight);
            box-shadow: none;
            transform: translate(-50%, -50%) translateX(72%);

            &::before,
            &::after {
                display: none;
            }
        }

        .switch__decoration {
            top: 50%;
            transform: translate(0%, -50%);
            animation: cloud 8s infinite;

            width: 20px;
            height: 20px;

            opacity: .8;

            background: white;


            &::before {
                width: 10px;
                height: 10px;
                top: auto;
                bottom: 0;
                left: -8px;
                animation: none;
            }

            &::after {
                width: 15px;
                height: 15px;
                top: auto;
                bottom: 0;
                left: 16px;
                animation: none;
            }

            &,
            &::before,
            &::after {
                content: '';
                background: white;
                border-radius: 9999px 9999px 0 0;
            }

            &::after {
                border-bottom-right-radius: 9999px;
            }
        }
    }

    @keyframes cloud {
        0% {
            transform: translate(0%, -40%);
        }
        50% {
            transform: translate(-100%, -40%);
        }
        100% {
            transform: translate(0%, -40%);
        }
    }
</style>