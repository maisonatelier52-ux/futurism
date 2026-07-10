const feedArticles = [
  {
    id: 1,
    category: "ETHICS",
    title: "Softbank CEO Who's Invested $64 Billion in OpenAI Says It's Blasphemy to Mention the AI Bubble",
    author: "Victor Tangermann",
    image: "/images/img1.webp",
    href: "#",
  },
  {
    id: 2,
    category: "ETHICS",
    title: "Customers Are Ditching Companies That Force Them to Talk to an AI Agent",
    author: "Victor Tangermann",
    image: "/images/img2.webp",
    href: "#",
  },
  {
    id: 3,
    category: "FINANCE",
    title: "Americans Increasingly Alarmed About Tech Industry's Looming AI Bubble",
    author: "Joe Wilkins",
    image: "/images/img3.webp",
    href: "#",
  },
  {
    id: 4,
    category: "CLIMATE CHANGE",
    title: "Government Scientists Fired by Trump Launch New Website for Sharing Climate Data",
    author: "Frank Landymore",
    image: "/images/img4.webp",
    href: "#",
  },
  {
    id: 5,
    category: "ARTIFICIAL INTELLIGENCE",
    title: "New Study Finds AI Models Are Getting Worse at Basic Reasoning Tasks Over Time",
    author: "Maggie Harrison Dupré",
    image: "/images/img5.webp",
    href: "#",
  },
  {
    id: 6,
    category: "SPACEX",
    title: "SpaceX's Latest Starship Test Ends in Another Spectacular Explosion Over the Gulf",
    author: "Victor Tangermann",
    image: "/images/img6.webp",
    href: "#",
  },
  {
    id: 7,
    category: "HEALTH",
    title: "Scientists Discover Gut Bacteria That May Protect Against Alzheimer's Disease",
    author: "Joe Wilkins",
    image: "/images/img7.webp",
    href: "#",
  },
  {
    id: 8,
    category: "ROBOTICS",
    title: "Boston Dynamics Robot Dog Now Being Used to Patrol National Parks",
    author: "Frank Landymore",
    image: "/images/img2.webp",
    href: "#",
  },
  {
    id: 9,
    category: "OPENAI",
    title: "OpenAI Quietly Removes Safety Commitments From Its Website Ahead of New Model Launch",
    author: "Maggie Harrison Dupré",
    image: "/images/img6.webp",
    href: "#",
  },
  {
    id: 10,
    category: "ENVIRONMENT",
    title: "Arctic Sea Ice Just Hit Its Lowest Recorded Level for This Time of Year",
    author: "Victor Tangermann",
    image: "/images/img7.webp",
    href: "#",
  },
];

export default function TheFeed() {
  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h2 className="font-[family-name:var(--font-owners-xnarrow)] text-xl font-black uppercase tracking-wide text-red-600">
          The Feed
        </h2>
      </div>

{/* Article List */}
<ul className="divide-y divide-dashed divide-gray-300">
  {feedArticles.map((article) => (
    <li key={article.id}>
      <a
        href={article.href}
        className="group flex flex-row gap-4 py-4 items-start"
      >
        {/* Image */}
<div className="flex-shrink-0 w-36 sm:w-44 lg:w-80 aspect-[4/3] overflow-hidden bg-gray-100">
  <img
    src={article.image}
    alt={article.title}
    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
  />
</div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600">
            {article.category}
          </span>

          <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-xl sm:text-2xl font-black uppercase leading-tight text-gray-900 group-hover:underline">
            {article.title}
          </h3>

          <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
            By{" "}
            <span className="font-semibold text-gray-700 underline">
              {article.author}
            </span>
          </p>
        </div>
      </a>
    </li>
  ))}
</ul>

{/* More Stories Button */}
<div className="flex justify-center pt-6">
  <button
    className="font-[family-name:var(--font-scale)] text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full border border-gray-400 text-gray-800 hover:border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-200"
  >
    More Stories
  </button>
</div>
    </section>
  );
}