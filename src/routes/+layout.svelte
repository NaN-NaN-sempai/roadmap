<script>
	import 'lhs-svelte-lib/sass/index.scss';

	import favicon from '$lib/assets/favicon.svg';
	import { DarkModeSwitch, footer } from 'lhs-svelte-lib';
	const {Footer} = footer;
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>



<div class="container">
	<div class="inner">
		<div class="darkmode centralize">
			<DarkModeSwitch />
		</div>
	</div>
	{@render children()}
	<div class="footer">
		<Footer pathList={[{
				text: "Luis Henrique Space",
				href: "https://resume.luishenrique.space/",
			}, {
				text: "Roadmap",
				href: "https://en.wikipedia.org/wiki/Roadmap",
			}]}
		/>
	</div>
</div>


<style lang="scss">
	@use 'lhs-svelte-lib/sass/fonts';
	@use 'lhs-svelte-lib/sass/defaults' as defaults;
	@use 'lhs-svelte-lib/sass/palette' as palette;
	@use 'lhs-svelte-lib/sass/cursors' as cursors;

	.hidden {
		display: none;
	}

	@media only screen and (min-width: defaults.$mediaMinWidth) {
		.outer {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	.container {
		display: flex;
		min-height: 100vh;
		flex-direction: column;
		justify-content: space-between;
	}
    .footer {
        margin-top: 20px;    
    }

	.inner > * {
		margin-block: 20px;
	}

	.centralize {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.chooselang {
		margin-top: -10px;
	}
	.summarize {
		margin-top: -5px;
		margin-bottom: -10px;
	}
</style>