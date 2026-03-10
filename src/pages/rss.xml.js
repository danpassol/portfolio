import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../site.config';

export async function GET(context) {
  const blog = await getCollection('blog');

  const items = blog
    .sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
    .map((post) => {
      // post.id = "es/mi-post.md" o "en/my-post.md"
      const [lang, ...rest] = post.id.split('/');
      const slug = rest.join('/').replace(/\.[^/.]+$/, '');
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/${lang}/blog/${slug}/`,
      };
    });

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site,
    items,
    customData: `<language>es</language>`,
    trailingSlash: false,
  });
}