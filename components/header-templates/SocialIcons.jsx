// components/header-templates/SocialIcons.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram, faXTwitter, faSubstack,
  faFacebook, faYoutube, faLinkedin, faTiktok,
} from '@fortawesome/free-brands-svg-icons';

const ICON_MAP = {
  instagram: faInstagram,
  twitter:   faXTwitter,
  substack:  faSubstack,
  facebook:  faFacebook,
  youtube:   faYoutube,
  linkedin:  faLinkedin,
  tiktok:    faTiktok,
};

export default function SocialIcons({ links = [], size = 'sm', rounded = true, dark = false }) {
  const sizeClass = size === 'lg' ? 'w-9 h-9 text-lg' : 'w-8 h-8 text-base';
  const borderClass = dark
    ? 'border-white/30 hover:bg-white/20 text-white'
    : 'border-gray-300 hover:bg-gray-100 text-gray-700';

  return (
    <div className="flex items-center gap-1.5">
      {links.map((s, i) => {
        const icon = ICON_MAP[s.platform];
        if (!icon) return null;
        return (
          <a
            key={i}
            href={s.href || '#'}
            className={`${sizeClass} flex items-center justify-center transition-colors ${
              rounded ? 'rounded-full border ' + borderClass : 'hover:opacity-70 ' + borderClass
            }`}
          >
            <FontAwesomeIcon icon={icon} />
          </a>
        );
      })}
    </div>
  );
}
