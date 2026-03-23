import { useEffect, useState } from 'react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { IntroSection } from './components/IntroSection';
import { ChapterSection } from './components/ChapterSection';
import { DrawingSection } from './components/DrawingSection';
import { Gallery } from './components/Gallery';
import { VideoSection } from './components/VideoSection';
import { Credits } from './components/Credits';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  siteContentByLocale,
} from './data/project';
import type { Locale, MetadataContent } from './types/content';

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
  const content = siteContentByLocale[locale];

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    syncDocumentMetadata(content.metadata);
  }, [content.metadata, locale]);

  return (
    <div className="app-shell">
      <Navigation
        chapters={content.chapters}
        dir={content.metadata.dir}
        navigation={content.navigation}
        locale={locale}
        onLocaleChange={setLocale}
      />
      <main>
        <Hero {...content.hero} dir={content.metadata.dir} />
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
