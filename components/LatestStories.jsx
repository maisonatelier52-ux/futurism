// Sample data — replace with real props or API data
const stories = [
  {
    id: 1,
    category: "FUTURE SOCIETY",
    title: "Trump's Truth Social Stock Just Hit Its Lowest Point Ever",
    author: "Victor Tangermann",
  },
  {
    id: 2,
    category: "SPACEX",
    title: "SpaceX Stock Has Fallen So Far That Elon Musk Is No Longer a Trillionaire",
    author: "Victor Tangermann",
  },
  {
    id: 3,
    category: "ENVIRONMENT",
    title: "Trump's Reflecting Pool Is No Match for the AlgaeBTQ Agenda",
    author: "Victor Tangermann",
  },
  {
    id: 4,
    category: "RENEWABLE ENERGY",
    title: "Scientists Say New Method Turns Coffee Grounds Into High-Potency Renewable Fuel",
    author: "Joe Wilkins",
  },
  {
    id: 5,
    category: "SPACEX",
    title: "SpaceX Launches Secretive New Spacecraft Shaped Like Flying Saucer",
    author: "Victor Tangermann",
  },
];

export default function LatestStories() {
  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-300">
<span className="relative inline-flex h-2.5 w-2.5">
  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping"></span>
  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-md shadow-red-500/40"></span>
</span>
        <h2 className="font-[family-name:var(--font-owners-text)] text-xs font-black uppercase tracking-widest text-gray-900">
          Our Latest Stories
        </h2>
      </div>

      {/* Story List */}
      <ul className="divide-y divide-gray-200">
        {stories.map((story) => (
          <li key={story.id} className="py-5">
            <a href="#" className="group block">
              {/* Category — Barlow/Scale */}
              <span className="font-[family-name:var(--font-scale)] text-[10px] font-semibold uppercase tracking-widest text-red-600 block mb-1">
                {story.category}
              </span>
              {/* Title — Anton/Owners XNarrow */}
              <h3 className="font-[family-name:var(--font-owners-xnarrow)] text-lg font-black uppercase leading-tight text-gray-900 group-hover:underline mb-1">
                {story.title}
              </h3>
              {/* Author — DM Sans/Owners Text */}
              <p className="font-[family-name:var(--font-owners-text)] text-xs text-gray-500">
                By{" "}
                <span className="font-semibold text-gray-700 hover:underline cursor-pointer">
                  {story.author}
                </span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}