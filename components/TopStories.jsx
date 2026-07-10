const topStories = [
  {
    id: 1,
    category: "ROBOTICS",
    title: "Failing Robot Cop Company Knightscope Now Publishing Bizarre AI Slop Fan Fiction About Its Robots Solving Absurd Crimes",
    author: "Joe Wilkins",
    image: "/images/img4.webp",
    href: "#",
  },
  {
    id: 2,
    category: "PRIVACY",
    title: "Amazon Investigating Its Own Employees for Daring to Oppose AI Data Center",
    author: "Joe Wilkins",
    image: "/images/img5.webp",
    href: "#",
  },
  {
    id: 3,
    category: "META",
    title: "Meta's Program That Spies on Every Employee's Computer Just Blew Up in Its Face In Spectacular Fashion",
    author: "Frank Landymore",
    image: "/images/img6.webp",
    href: "#",
  },
  {
    id: 4,
    category: "TREATMENTS",
    title: "White House Pushes Back Against Claim That Trump Was Given Early Access to a Powerful Experimental Weight Loss Drug",
    author: "Victor Tangermann",
    image: "/images/img7.webp",
    href: "#",
  },
];

export default function TopStories() {
  return (
    <section className="w-full py-1">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-300 pb-3">
        <h2 className="font-[family-name:var(--font-scale)] text-sm font-bold uppercase tracking-widest text-red-600">
          Top Stories
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStories.map((story) => (
          <a
            key={story.id}
            href={story.href}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Image */}
            <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 text-center">
              {/* Category */}
              <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 block mb-2">
                {story.category}
              </span>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-base md:text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline mb-3 flex-1">
                {story.title}
              </h3>

              {/* Author */}
              <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500 mb-4">
                By{" "}
                <span className="font-semibold text-gray-700 underline">
                  {story.author}
                </span>
              </p>

              {/* Arrow */}
              <div className="flex justify-center">
                <span className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}