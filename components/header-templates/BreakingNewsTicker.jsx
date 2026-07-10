// components/header-templates/BreakingNewsTicker.jsx
export default function BreakingNewsTicker({ items = [], dark = false, accentColor = '#ef4444' }) {
  const bg    = dark ? 'bg-[#111]' : 'bg-white';
  const border = dark ? 'border-white/10' : 'border-gray-200';
  const textClass = dark ? 'text-white/80' : 'text-gray-800';

  if (!items.length) return null;

  return (
    <div className={`${bg} border-t ${border} flex items-stretch text-xs`}>
      {/* Badge */}
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0"
        style={{ backgroundColor: accentColor, color: '#fff' }}
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
        BREAKING NEWS
      </div>

      {/* Items */}
      <div className="flex items-center flex-1 overflow-hidden divide-x divide-gray-200 border-l border-gray-200">
        {items.slice(0, 3).map((item, i) => (
          <a
            key={i}
            href={item.href || '#'}
            className={`flex items-center gap-2 px-4 py-2.5 ${textClass} hover:underline whitespace-nowrap truncate flex-1 min-w-0`}
          >
            <span className="truncate">{item.text}</span>
            {item.time && (
              <span className="ml-1 font-semibold flex-shrink-0" style={{ color: accentColor }}>
                {item.time}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* View all */}
      <a
        href="#"
        className={`px-4 py-2.5 flex-shrink-0 font-semibold whitespace-nowrap flex items-center gap-1 ${dark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-900'} border-l ${border}`}
      >
        View All →
      </a>
    </div>
  );
}
