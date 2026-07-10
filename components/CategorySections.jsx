"use client";
const aiPsychosisArticles = [
  {
    id: 1,
    category: "ARTIFICIAL INTELLIGENCE",
    title: "New Paper Proposes What Really Causes AI Psychosis",
    author: "Maggie Harrison Dupré",
    image: "/images/img1.webp",
    href: "#",
  },
  {
    id: 2,
    category: "OPENAI",
    title: "Was This the Moment That AI Psychosis Began?",
    author: "Maggie Harrison Dupré",
    image: "/images/img2.webp",
    href: "#",
  },
  {
    id: 3,
    category: "XAI",
    title: "Certain Chatbots Vastly Worse For AI Psychosis, Study Finds",
    author: "Maggie Harrison Dupré",
    image: "/images/img3.webp",
    href: "#",
  },
];

const muskWatchArticles = [
  {
    id: 1,
    category: "ELON MUSK",
    title: "Elon Musk Says SpaceX Is Like Union Pacific, Which Is Extremely Funny If You Know What Actually Happened to Union Pacific",
    author: "Joe Wilkins",
    image: "/images/img4.webp",
    href: "#",
  },
  {
    id: 2,
    category: "ELON MUSK",
    title: "Musk Furious After SpaceX Stock Get Worst Possible Environmental Grade",
    author: "Victor Tangermann",
    image: "/images/img5.webp",
    href: "#",
  },
  {
    id: 3,
    category: "ELON MUSK",
    title: "Elon Musk's Conflicts of Interest With the Trump Administration Regulating SpaceX Are So Profound That They Have Grim Implications for Society",
    author: "Victor Tangermann",
    image: "/images/img6.webp",
    href: "#",
  },
];

// ─── Reusable Section ───────────────────────────────────────────────────────

function CategorySection({ title, articles, onReadMore }) {
  return (
    <section className="w-full py-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600">
          {title}
        </h2>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.href}
            className="group flex flex-col gap-2"
          >
            {/* Image */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Category */}
            <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 mt-1">
              {article.category}
            </span>

            {/* Title */}
            <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline">
              {article.title}
            </h3>

            {/* Author */}
            <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
              By{" "}
              <span className="font-semibold text-gray-700 underline">
                {article.author}
              </span>
            </p>
          </a>
        ))}
      </div>

      {/* Read More Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => onReadMore && onReadMore(title)}
          className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full border border-gray-400 text-gray-800 hover:border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-200"
        >
          Read More
        </button>
      </div>
    </section>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function CategorySections() {
  const handleReadMore = (sectionTitle) => {
    // TODO: hook up routing or load-more logic here
    console.log(`Read more clicked for: ${sectionTitle}`);
  };

  return (
    <div className="w-full divide-y divide-gray-200">
      <CategorySection
        title="AI Psychosis"
        articles={aiPsychosisArticles}
        onReadMore={handleReadMore}
      />
      <CategorySection
        title="Musk Watch"
        articles={muskWatchArticles}
        onReadMore={handleReadMore}
      />
    </div>
  );
}