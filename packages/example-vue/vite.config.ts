
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	root: './src',
	build: {
		outDir: '../dist',
		minify: false,
		emptyOutDir: true,
	},
	plugins: [vue()],
	server: {
		host: true,
	},
})
