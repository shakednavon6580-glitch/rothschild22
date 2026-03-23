export type Locale = 'en' | 'he';

export type Direction = 'ltr' | 'rtl';

export type Chapter = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  intro: string;
  body: string[];
  quote?: string;
  image: string;
  imageAlt: string;
  layout?: 'split' | 'image-led' | 'quiet';
  cta: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export type DrawingItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export type DrawingsSectionData = {
  id: string;
  heading: string;
  eyebrow: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  missingFileLabel: string;
  items: DrawingItem[];
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type MetadataContent = {
  lang: Locale;
  dir: Direction;
  title: string;
  description: string;
};

export type NavigationContent = {
  brandMark: string;
  brandLabel: string;
  quickLinks: {
    drawings: string;
    gallery: string;
    film: string;
  };
  menuLabel: string;
  tocTitle: string;
  tocLinks: {
    introduction: string;
    drawings: string;
    gallery: string;
    film: string;
  };
  languageSwitcherLabel: string;
  localeLabels: Record<Locale, string>;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string[];
  coverVideo: string;
  coverImage: string;
  imageAlt: string;
  ctaLabel: string;
  scrollLabel: string;
  metaAriaLabel: string;
};

export type IntroContent = {
  id: string;
  heading: string;
  eyebrow: string;
  subheading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  facts: ProjectFact[];
};

export type GallerySectionContent = {
  id: string;
  heading: string;
  eyebrow: string;
  subheading: string;
  items: GalleryItem[];
};

export type VideoContent = {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  playLabel: string;
  unsupportedMessage: string;
  src: string;
  poster: string;
};

export type CreditsContent = {
  eyebrow: string;
  heading: string;
  body: string;
  backToCoverLabel: string;
};

export type SiteContent = {
  metadata: MetadataContent;
  navigation: NavigationContent;
  hero: HeroContent;
  intro: IntroContent;
  drawings: DrawingsSectionData;
  chapters: Chapter[];
  gallery: GallerySectionContent;
  video: VideoContent;
  credits: CreditsContent;
};
