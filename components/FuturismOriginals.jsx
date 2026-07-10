const originalsArticles = [
  {
    id: 1,
    category: "ETHICS",
    title: "ChatGPT Is Blowing Up Marriages as Spouses Use AI to Attack Their Partners",
    author: "Maggie Harrison Dupré",
    href: "#",
  },
  {
    id: 2,
    category: "ARTIFICIAL INTELLIGENCE",
    title: 'Support Group Launches for People Suffering "AI Psychosis"',
    author: "Maggie Harrison Dupré",
    href: "#",
  },
  {
    id: 3,
    category: "ARTIFICIAL INTELLIGENCE",
    title: 'People Are Being Involuntarily Committed, Jailed After Spiraling Into "ChatGPT Psychosis"',
    author: "Maggie Harrison Dupré",
    href: "#",
  },
  {
    id: 4,
    category: "OPENAI",
    title: "People Are Becoming Obsessed with ChatGPT and Spiraling Into Severe Delusions",
    author: "Maggie Harrison Dupré",
    href: "#",
  },
];

const featuredImage = "/images/originals-featured.webp";

export default function FuturismOriginals() {
  return (
    <div className="border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-2">
        <h2 className="font-[family-name:var(--font-scale)] text-[11px] font-bold uppercase tracking-widest text-gray-900">
          Futurism Originals
        </h2>
      </div>

      {/* Featured Image */}
      <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src="/images/img8.webp"
          alt="Futurism Originals"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article List */}
      <ul className="divide-y divide-dashed divide-gray-200">
        {originalsArticles.map((article) => (
          <li key={article.id} className="px-4 py-3">
            <a href={article.href} className="group block">
              <span className="font-[family-name:var(--font-scale)] text-[9px] font-semibold uppercase tracking-widest text-red-600 block mb-1">
                {article.category}
              </span>
              <h3 className="font-[family-name:var(--font-owners-text)] text-sm leading-snug text-gray-900 group-hover:underline mb-1">
                {article.title}
              </h3>
              <p className="font-[family-name:var(--font-owners-text)] text-[10px] text-gray-500">
                By{" "}
                <span className="font-semibold text-gray-700 underline">
                  {article.author}
                </span>
              </p>
            </a>
          </li>
        ))}
      </ul>

      {/* See More */}
      <div className="flex justify-center py-4 px-4">
        <button className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-2.5 rounded-full border border-gray-400 text-gray-800 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 w-full">
          See More
        </button>
      </div>
    </div>
  );
}