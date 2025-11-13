import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	css: {
		preprocessorOptions: {
			scss: {
				includePaths: ['node_modules']
			}
		}
	}
});
