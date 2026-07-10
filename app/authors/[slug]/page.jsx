// app/authors/[slug]/page.jsx
// Renders whichever layout variation was chosen for this author in
// Admin -> Authors (Variation 1-4). Falls back to Variation 4 (the
// original default layout) if an author hasn't set one.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AuthorPageResolver from '../../../components/AuthorPageResolver';

// Always render fresh -- never statically cache this page -- so a newly
// saved author profile shows up immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function AuthorPage({ params }) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <AuthorPageResolver slug={slug} />
      <Footer />
    </>
  );
}
