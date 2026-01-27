import { getCollection } from 'astro:content'

const sortByPubDateDesc = (a: any, b: any) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()

const sortByPostOrderAscThenPubDateDesc = (a: any, b: any) => {
	const ao = a.data.postOrder
	const bo = b.data.postOrder

	// Posts with an explicit order come first.
	if (ao == null && bo != null) return 1
	if (ao != null && bo == null) return -1
	if (ao != null && bo != null && ao !== bo) return ao - bo

	return sortByPubDateDesc(a, b)
}

export const getCategories = async () => {
	const posts = await getCollection('blog')
	const categories = new Set(
		posts.filter((post) => !post.data.draft).map((post) => post.data.category)
	)
	return Array.from(categories)
}

export const getPosts = async (max?: number, filterByPortfolio: boolean = false) => {
	return (await getCollection('blog'))
		.filter(
			(post) =>
				!post.data.draft &&
				!(filterByPortfolio && post.data.tags.includes('portfolio') && post.data.tags.length === 1)
		)
		.sort(sortByPubDateDesc)
		.slice(0, max)
}

export const getTags = async () => {
	const posts = await getCollection('blog')
	const tags = new Set()
	posts
		.filter((post) => !post.data.draft)
		.forEach((post) => {
			post.data.tags.forEach((tag) => {
				tags.add(tag.toLowerCase())
			})
		})

	return Array.from(tags)
}

export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const lowercaseTag = tag.toLowerCase()
	return posts
		.filter((post) => !post.data.draft)
		.filter((post) => {
			return post.data.tags.some((postTag) => postTag.toLowerCase() === lowercaseTag)
		})
}

export const filterPostsByCategory = async (category: string) => {
	const normalizedCategory = category.toLowerCase()
	const posts = await getPosts()
	const filtered = posts.filter((post) => {
		if (post.data.draft) return false

		// The Portfolio page is tag-driven: include anything tagged `portfolio`
		// (and still include posts whose category is Portfolio).
		if (normalizedCategory === 'portfolio') {
			const hasPortfolioTag = post.data.tags.some((t) => t.toLowerCase() === 'portfolio')
			return post.data.category.toLowerCase() === 'portfolio' || hasPortfolioTag
		}

		return post.data.category.toLowerCase() === normalizedCategory
	})

	// Portfolio is curated; allow manual ordering without lying about pubDate.
	if (normalizedCategory === 'portfolio') {
		return filtered.sort(sortByPostOrderAscThenPubDateDesc)
	}

	return filtered.sort(sortByPubDateDesc)
}
