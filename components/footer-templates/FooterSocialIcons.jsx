// components/footer-templates/FooterSocialIcons.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faXTwitter, faSubstack, faFacebook, faYoutube, faLinkedin, faTiktok } from '@fortawesome/free-brands-svg-icons';

const ICON_MAP = {
  instagram: faInstagram,
  twitter:   faXTwitter,
  substack:  faSubstack,
  facebook:  faFacebook,
  youtube:   faYoutube,
  linkedin:  faLinkedin,
  tiktok:    faTiktok,
};

export default function FooterSocialIcons({ links = [], dark = false, size = 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-base' : 'w-9 h-9 text-lg';
  const style = dark
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800';
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {links.map((s, i) => {
        const icon = ICON_MAP[s.platform];
        if (!icon) return null;
        return (
          <a key={i} href={s.href || '#'}
            className={`${dim} border rounded-full flex items-center justify-center transition-colors ${style}`}>
            <FontAwesomeIcon icon={icon} />
          </a>
        );
      })}
    </div>
  );
}
