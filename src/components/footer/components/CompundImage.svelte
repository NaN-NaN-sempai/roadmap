<script>
	export let name = 'Svelte Kit';
	export let src = '/assets/imgs/tools/developer/Svelte.png';
	export let href = 'https://svelte.dev/';
    export let social = false;
    export let bgColor = "white";
</script>

<a class="compoundImage" {href}>
	<div class="image"
    style="--size: {social? "1rem": "1.5rem"}; --containerSize: {social? "125%": "100%"}; --bgColor: {bgColor};">
		<img {src} alt={src.split('/').pop()} />
	</div>
	<div class="text">
		<span>{name}</span>
	</div>
</a>

<style lang="scss">
	@use '$style/_fonts.scss';
	@use '$style/_defaults' as defaults;
	@use '$style/_palette.scss' as palette;
	@use '$style/_gradients.scss' as gradients;

	.compoundImage {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		padding: 10px;
		border-radius: 9999px;
		font-size: 1.2rem;
		text-decoration: inherit;
		color: inherit;
		transition: padding-right 0.2s, background 0.2s;

		&:hover {
			text-decoration: underline;
			background: palette.$primary;
			color: palette.$highlight;
			padding-right: 15px;
		}

		.image {
			width: var(--size);
			height: var(--size);
			padding: 5px;
			background: var(--bgColor);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 9999px;
			outline: 2px solid black;
            overflow: hidden;

			img {
				max-width:100%;
				max-height:100%;
			}
		}

		@media (max-width: defaults.$mediaMaxWidth) {
			flex-direction: column;
			gap: 5px;
			border-radius: 10px;
			padding-inline: 10px;

			&:hover {
				padding: 5px;
				padding-inline: 10px;
			}
		}
	}
</style>