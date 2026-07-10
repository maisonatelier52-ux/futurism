// components/header-templates/NavLinks.jsx
export default function NavLinks({ links = [], dark = false, className = '' }) {
  const textClass = dark ? 'text-white/90 hover:text-white' : 'text-gray-800 hover:text-gray-600';
  return (
    <nav className={`flex items-center gap-5 text-sm tracking-wider font-[family-name:var(--font-scale)] ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href || '#'}
          className={`${textClass} transition-colors flex items-center gap-0.5 uppercase whitespace-nowrap`}
        >
          {link.name}
          <span className="text-[10px] opacity-50 mt-0.5">▼</span>
        </a>
      ))}
    </nav>
  );
}
