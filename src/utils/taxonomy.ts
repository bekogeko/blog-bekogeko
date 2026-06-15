import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Turn an arbitrary label ("Web Dev") into a URL-safe slug ("web-dev"). */
export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** All posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export interface TaxonomyTerm {
	/** Display label, taken from the first time the term was seen. */
	name: string;
	slug: string;
	count: number;
}

/** Collect distinct values of a taxonomy field across all posts, with counts. */
function collect(posts: Post[], pick: (post: Post) => string[]): TaxonomyTerm[] {
	const terms = new Map<string, TaxonomyTerm>();
	for (const post of posts) {
		for (const value of pick(post)) {
			const slug = slugify(value);
			if (!slug) continue;
			const existing = terms.get(slug);
			if (existing) {
				existing.count += 1;
			} else {
				terms.set(slug, { name: value, slug, count: 1 });
			}
		}
	}
	return [...terms.values()].sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
	);
}

export async function getTags(posts?: Post[]): Promise<TaxonomyTerm[]> {
	return collect(posts ?? (await getSortedPosts()), (p) => p.data.tags ?? []);
}

export async function getCategories(posts?: Post[]): Promise<TaxonomyTerm[]> {
	return collect(posts ?? (await getSortedPosts()), (p) =>
		p.data.category ? [p.data.category] : [],
	);
}

export function postsWithTag(posts: Post[], slug: string): Post[] {
	return posts.filter((p) => (p.data.tags ?? []).some((t) => slugify(t) === slug));
}

export function postsInCategory(posts: Post[], slug: string): Post[] {
	return posts.filter((p) => p.data.category && slugify(p.data.category) === slug);
}
