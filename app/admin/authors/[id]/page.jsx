import AuthorEditor from '../AuthorEditor';

// Next.js 16: `params` is a Promise in Server Components and must be awaited.
export default async function EditAuthorPage({ params }) {
  const { id } = await params;
  return <AuthorEditor authorId={id} />;
}
