"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faXTwitter,
  faFacebook,
  faLinkedin,
  faYoutube,
  faTiktok,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

// lucide-react 1.0 removed all brand icons (Facebook, Twitter, Instagram,
// Linkedin, Youtube, etc). This wrapper re-implements them using
// @fortawesome/free-brands-svg-icons (already a project dependency) but
// keeps the same call signature lucide icons use: <Instagram size={16} />
// so existing admin-builder code doesn't need to change at every call site.

function makeBrandIcon(faIcon) {
  return function BrandIcon({ size = 16, className = "", style, ...rest }) {
    return (
      <FontAwesomeIcon
        icon={faIcon}
        style={{ width: size, height: size, ...style }}
        className={className}
        {...rest}
      />
    );
  };
}

export const Instagram = makeBrandIcon(faInstagram);
export const Twitter   = makeBrandIcon(faXTwitter);
export const Facebook  = makeBrandIcon(faFacebook);
export const Linkedin  = makeBrandIcon(faLinkedin);
export const Youtube   = makeBrandIcon(faYoutube);
export const Music2    = makeBrandIcon(faTiktok); // used as the "tiktok" platform icon
export const Github    = makeBrandIcon(faGithub);
