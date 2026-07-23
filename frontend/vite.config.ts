import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ProxyOptions } from 'vite';

const proxyConfig: Record<string, string | ProxyOptions> = {
	'/auth': 'http://localhost:3000',
	'/config/smtp': 'http://localhost:3000',
	'/send': 'http://localhost:3000',
	'/report': {
		target: 'http://localhost:3000',
		bypass: (req) => {
			if (req.url?.startsWith('/reports')) {
				return req.url;
			}
		}
	},
	'/dashboard/poll-status': 'http://localhost:3000',
	'/dashboard/data': 'http://localhost:3000',
	'/parse-excel': 'http://localhost:3000',
	'/user': 'http://localhost:3000',
	'/test-notification': 'http://localhost:3000',
	'/batch': 'http://localhost:3000',
	'/scheduled-jobs': 'http://localhost:3000',
	'/provider-info': 'http://localhost:3000'
};

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: proxyConfig
	},
	preview: {
		proxy: proxyConfig
	}
});
