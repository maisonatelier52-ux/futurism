// app/articles/[slug]/page.jsx
// Renders whichever layout variation was chosen for this article in
// Admin -> Articles (Variation 1-4). Falls back to Variation 4 (the
// original default layout) if an article hasn't set one.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ArticlePageResolver from '../../../components/ArticlePageResolver';

// Always render fresh -- never statically cache this page -- so a newly
// published/edited article shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function ArticlePage({ params }) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <ArticlePageResolver slug={slug} />
      <Footer />
    </>
  );
}
