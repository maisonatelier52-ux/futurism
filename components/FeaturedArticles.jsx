// Sample data — replace with real props or API data
const heroArticle = {
  category: "MENTAL HEALTH",
  title: "Google's AI Overviews Feature Is Telling Users That SCP Horror Fiction Entities Are Real",
  excerpt:
    "Google's AI Overviews are having severe trouble distinguishing between fact and fiction.",
  author: "Maggie Harrison Dupré",
  image: "/images/img1.webp",
  href: "#",
};

const secondaryArticles = [
  {
    id: 1,
    category: "ROBOTICS",
    title: "DoorDash Delivery Robot Invades SWAT Scene, Won't Leave as Cops Flashbang Resident",
    author: "Frank Landymore",
    image: "/images/img2.webp",
    href: "#",
  },
  {
    id: 2,
    category: "CLIMATE CHANGE",
    title: "Mass Deaths Attributed to Brutal Heat Wave",
    author: "Frank Landymore",
    image: "/images/img3.webp",
    href: "#",
  },
];

export default function FeaturedArticles() {
  return (
    <section className="w-full">
<div className="grid grid-cols-1 md:grid-cols-3 gap-0">

        {/* Hero Article */}
  <div className="md:col-span-2 md:border-r border-gray-200 md:pr-6">
          <a href={heroArticle.href} className="group block">
            {/* Image */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
              <img
                src={heroArticle.image}
                alt={heroArticle.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
{/* Category — Barlow replaces Scale Variable */}
<span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 block mb-2 text-center">
  {heroArticle.category}
</span>

{/* Title — Big Shoulders replaces Owners XNarrow */}
<h2 className="font-[family-name:var(--font-owners-xnarrow)] 
text-2xl md:text-4xl 
font-black leading-tight uppercase 
text-gray-900 text-center 
group-hover:underline mb-4 px-2 
break-words hyphens-auto
md:line-clamp-3 line-clamp-none">
  {heroArticle.title}
</h2>

{/* Excerpt — Bitter italic */}
<p className="font-[family-name:var(--font-bitter)] italic text-xl text-[#4a90a4] text-center leading-relaxed mb-3 px-4">
  "{heroArticle.excerpt}"
</p>

{/* Author — DM Sans replaces Owners Text */}
<p className="font-[family-name:var(--font-owners-text)] text-xs text-center text-gray-500">
  By <span className="font-semibold text-gray-800 underline">{heroArticle.author}</span>
</p>
          </a>
        </div>

        {/* Secondary Articles */}
  <div className="flex flex-col divide-y divide-gray-200 md:pl-6">
          {secondaryArticles.map((article) => (
            <a
              key={article.id}
              href={article.href}
              className="group flex flex-col gap-3 py-5 first:pt-0 md:first:pt-0"
            >
              {/* Category */}
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                {article.category}
              </span>

{/* Secondary titles */}
<h3 className="font-[family-name:var(--font-owners-xnarrow)] text-2xl font-black leading-none uppercase text-gray-900 group-hover:underline">
  {article.title}
</h3>

              {/* Author */}
              <p className="text-xs text-gray-500">
                By{" "}
                <span className="font-semibold text-gray-800 underline">
                  {article.author}
                </span>
              </p>

              {/* Image */}
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}