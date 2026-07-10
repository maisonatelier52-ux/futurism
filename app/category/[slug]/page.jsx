// app/category/[slug]/page.jsx
// Usage: /category/health-medicine, /category/artificial-intelligence, etc.
// Renders whichever template + content was chosen for this category slug
// in Admin -> Categories -> Page Builder. Falls back to the original default
// layout/content automatically if nothing has been saved yet.

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CategoryPageResolver from '../../../components/CategoryPageResolver';

// Always render fresh -- never statically cache this page -- so a save in
// Category Page Builder shows up immediately on the next page load.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <CategoryPageResolver slug={slug} />
      <Footer />
    </>
  );
}
