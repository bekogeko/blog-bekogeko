// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// NOTE: this is the canonical production URL. It drives the sitemap,
	// canonical <link> tags, the RSS feed, and Open Graph image URLs.
	// Change it if your blog lives on a different domain/subdomain.
	site: 'https://bekogeko.dev',
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
			// Give the homepage top priority; everything else inherits the defaults.
			serialize(item) {
				if (item.url === 'https://bekogeko.dev/') {
					item.priority = 1.0;
				}
				return item;
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
