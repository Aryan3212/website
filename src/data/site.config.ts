interface SiteConfig {
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: 'Aryan Rahman',
	// Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
	title: 'Aryan Rahman: Building Reality',
	// Meta property used as the default description meta property
	description:
		'Blog and website for Aryan Rahman, full-stack software product engineer based in Bangladesh',
	// HTML lang property, found in src/layouts/Base.astro L:18
	lang: 'en-US',
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: 'en_US',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 10 // Number of posts per page
}
