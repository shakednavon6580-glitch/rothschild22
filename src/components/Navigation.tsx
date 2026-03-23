import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SUPPORTED_LOCALES } from '../data/project';
import type {
  Chapter,
  Direction,
  Locale,
  NavigationContent,
} from '../types/content';

type NavigationProps = {
  chapters: Chapter[];
  dir: Direction;
  navigation: NavigationContent;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function Navigation({
  chapters,
  dir,
  navigation,
  locale,
  onLocaleChange,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const closedPanelOffset = dir === 'rtl' ? '-100%' : '100%';
  const tocLinkTabIndex = isOpen ? 0 : -1;

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const next = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setProgress(next);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="topbar">
        <a className="topbar__brand" href="#cover">
          <span>{navigation.brandMark}</span>
          <small>{navigation.brandLabel}</small>
        </a>

        <div className="topbar__actions">
          <a className="topbar__link" href="#drawings">
            {navigation.quickLinks.drawings}
          </a>
          <a className="topbar__link" href="#gallery">
            {navigation.quickLinks.gallery}
          </a>
          <a className="topbar__link" href="#film">
            {navigation.quickLinks.film}
          </a>
          <div
            className="language-switcher"
            role="group"
            aria-label={navigation.languageSwitcherLabel}
          >
            {SUPPORTED_LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                className={`language-switcher__button ${
                  locale === option ? 'language-switcher__button--active' : ''
                }`}
                aria-pressed={locale === option}
                lang={option}
                onClick={() => onLocaleChange(option)}
              >
                {navigation.localeLabels[option]}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="topbar__menu"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-controls="toc-panel"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
            {navigation.menuLabel}
          </button>
        </div>

        <div className="topbar__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <motion.aside
        id="toc-panel"
        className={`toc ${isOpen ? 'toc--open' : ''}`}
        initial={false}
        aria-hidden={!isOpen}
        animate={{ x: isOpen ? 0 : closedPanelOffset }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="toc__inner">
          <p className="eyebrow">{navigation.tocTitle}</p>
          <ul>
            <li>
              <a
                href="#introduction"
                tabIndex={tocLinkTabIndex}
                onClick={() => setIsOpen(false)}
              >
                {navigation.tocLinks.introduction}
              </a>
            </li>
            <li>
              <a
                href="#drawings"
                tabIndex={tocLinkTabIndex}
                onClick={() => setIsOpen(false)}
              >
                {navigation.tocLinks.drawings}
              </a>
            </li>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  tabIndex={tocLinkTabIndex}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{chapter.number}</span>
                  {chapter.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#gallery"
                tabIndex={tocLinkTabIndex}
                onClick={() => setIsOpen(false)}
              >
                {navigation.tocLinks.gallery}
              </a>
            </li>
            <li>
              <a
                href="#film"
                tabIndex={tocLinkTabIndex}
                onClick={() => setIsOpen(false)}
              >
                {navigation.tocLinks.film}
              </a>
            </li>
          </ul>
        </div>
      </motion.aside>
    </>
  );
}
