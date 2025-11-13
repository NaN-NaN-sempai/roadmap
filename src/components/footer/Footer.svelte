<script>
	import CompoundImage from './components/CompoundImage.svelte';

	import LinkList from '$components/footer/components/LinkList.svelte';
	import PathList from '$components/footer/components/PathList.svelte';

	import usedList from '$components/footer/components/lists/usedList';
	import socialList from '$components/footer/components/lists/socialList';

	/* PathList */
	let author = 'Luís Henrique de Almeida';
	let year = new Date().getFullYear();
	import domain from '$lib/domain';

	let pathList = [];

	import translations from '$trad';
	let texts;
	translations.subscribe((value) => {
		texts = value;

		pathList = [
			{
				text: author,
				href: 'https://' + domain
			},
			{
				text: "PAY",
				href: 'https://en.wikipedia.org/wiki/Pay'
			}
		];
	});
</script>

<footer>
	<div class="content">
		<div class="title">
			<span>{texts.madeWith}</span>
		</div>

		<LinkList list={usedList} />

		<hr />

		<PathList list={pathList} />

		<hr />

		<LinkList list={socialList} social={true} />
	</div>
</footer>

<style lang="scss">
	@use '$style/_fonts.scss';
	@use '$style/_defaults' as defaults;
	@use '$style/_palette.scss' as palette;
	@use '$style/_gradients.scss' as gradients;

	footer {
		width: 100vw;
		text-align: center;
		font-size: 1.2rem;
		background: palette.$secondary;

		color: palette.$highlight;
		overflow: hidden;

		box-shadow: 0 0 30px -10px palette.$tertiary;

		.content {
			padding: 0.75rem;
		}

		hr {
			margin-block: 30px;
			border: 2px solid palette.$highlight;
			border-radius: 9999px;
		}
	}

	.title {
		padding-bottom: 10px;
	}
</style>