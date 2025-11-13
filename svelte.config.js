import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),

		alias: {
			$style: "src/sass",
			$assets: "static/assets",
			$components: "src/components",
			$fonts: "src/fonts",
			$lib: "src/lib",
			$lang: "src/lib/translations/languages",
			$trad: "src/lib/translations",
		},
	}
};

export default config;
