import { useCallback, useEffect, useRef, useState } from 'react';
import { Hero } from './components/Hero';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { IntroSection } from './components/IntroSection';
import { ChapterSection } from './components/ChapterSection';
import { DrawingSection } from './components/DrawingSection';
import { Gallery } from './components/Gallery';
import { VideoSection } from './components/VideoSection';
import { Credits } from './components/Credits';
import { PRELOADER_EXIT_MS, PRELOADER_FALLBACK_MS } from './components/preloaderConfig';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  siteContentByLocale,
} from './data/project';
import type { Locale, MetadataContent } from './types/content';
import type { HeroMediaSettledReason } from './components/Hero';

type PreloaderPhase = 'active' | 'exiting' | 'complete';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isLocale(storedLocale)) {
    return storedLocale;
  }

  return DEFAULT_LOCALE;
}

function syncDocumentMetadata(metadata: MetadataContent) {
  document.documentElement.lang = metadata.lang;
  document.documentElement.dir = metadata.dir;
  document.body.dir = metadata.dir;
  document.title = metadata.title;

  let descriptionTag = document.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }

  descriptionTag.setAttribute('content', metadata.description);
}

function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [preloaderPhase, setPreloaderPhase] = useState<PreloaderPhase>('active');
  const [preloaderExitReason, setPreloaderExitReason] = useState<string | null>(null);
  const hasDismissedPreloaderRef = useRef(false);
  const content = siteContentByLocale[locale];

  const dismissPreloader = useCallback((reason: HeroMediaSettledReason | 'timeout') => {
    if (hasDismissedPreloaderRef.current) {
      return;
    }

    hasDismissedPreloaderRef.current = true;
    setPreloaderExitReason(reason);
    setPreloaderPhase('exiting');
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    syncDocumentMetadata(content.metadata);
  }, [content.metadata, locale]);

  useEffect(() => {
    if (preloaderPhase === 'complete') {
      document.body.classList.remove('body--preloader-active');
      return;
    }

    document.body.classList.add('body--preloader-active');

    return () => {
      document.body.classList.remove('body--preloader-active');
    };
  }, [preloaderPhase]);

  useEffect(() => {
    if (preloaderPhase !== 'active') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dismissPreloader('timeout');
    }, PRELOADER_FALLBACK_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dismissPreloader, preloaderPhase]);

  useEffect(() => {
    if (preloaderPhase !== 'exiting') {
      return;
    }

    const exitTimeoutId = window.setTimeout(() => {
      setPreloaderPhase('complete');
    }, PRELOADER_EXIT_MS);

    return () => {
      window.clearTimeout(exitTimeoutId);
    };
  }, [preloaderPhase]);

  return (
    <div className={`app-shell${preloaderPhase !== 'complete' ? ' app-shell--preloader-active' : ''}`}>
      {preloaderPhase !== 'complete' ? (
        <Preloader
          phase={preloaderPhase}
          exitReason={preloaderExitReason}
          title={content.hero.title}
        />
      ) : null}
      <Navigation
        chapters={content.chapters}
        dir={content.metadata.dir}
        navigation={content.navigation}
        locale={locale}
        onLocaleChange={setLocale}
      />
      <main>
        <Hero
          {...content.hero}
          dir={content.metadata.dir}
          onMediaSettled={dismissPreloader}
        />
        <IntroSection content={content.intro} />
        <DrawingSection section={content.drawings} />
        {content.chapters.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter} />
        ))}
        <Gallery dir={content.metadata.dir} section={content.gallery} />
        <VideoSection {...content.video} />
        <Credits content={content.credits} />
      </main>
    </div>
  );
}

export default App;
