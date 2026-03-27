import type {
  Chapter,
  CreditsContent,
  GallerySectionContent,
  DrawingsSectionData,
  GalleryItem,
  HeroContent,
  IntroContent,
  Locale,
  NavigationContent,
  ProjectFact,
  SiteContent,
  VideoContent,
} from '../types/content';

export const LOCALE_STORAGE_KEY = 'rothschild-22-locale';
export const DEFAULT_LOCALE: Locale = 'en';
export const SUPPORTED_LOCALES: Locale[] = ['en', 'he'];

const englishNavigation: NavigationContent = {
  brandMark: 'R22',
  brandLabel: 'Editorial Edition',
  quickLinks: {
    drawings: 'Drawings',
    gallery: 'Gallery',
    film: 'Film',
  },
  menuLabel: 'Chapters',
  tocTitle: 'Table of Contents',
  tocLinks: {
    introduction: 'Introduction',
    drawings: 'Drawings',
    gallery: 'Gallery',
    film: 'Final Film',
  },
  languageSwitcherLabel: 'Language',
  localeLabels: {
    en: 'English',
    he: 'עברית',
  },
};

const hebrewNavigation: NavigationContent = {
  brandMark: 'R22',
  brandLabel: 'מהדורת מגזין',
  quickLinks: {
    drawings: 'שרטוטים',
    gallery: 'גלריה',
    film: 'הסרט',
  },
  menuLabel: 'פרקים',
  tocTitle: 'תוכן העניינים',
  tocLinks: {
    introduction: 'פתיחה',
    drawings: 'שרטוטים',
    gallery: 'גלריה',
    film: 'סרט סיום',
  },
  languageSwitcherLabel: 'שפה',
  localeLabels: {
    en: 'English',
    he: 'עברית',
  },
};

const englishHero: HeroContent = {
  eyebrow: 'Architectural Editorial Luxury',
  title: 'Rothschild 22',
  subtitle:
    'An editorial walkthrough of light, materiality, and elevated urban living above the Tel Aviv coastline.',
  description:
    'A cinematic residential landmark shaped as a digital magazine: calm typography, immersive media, and a final film that closes the narrative.',
  meta: ['Tel Aviv', '2026', 'Residential Tower'],
  coverVideo: '/assets/videos/hero-film.mp4',
  coverImage: '/assets/images/cover-aerial.png',
  imageAlt: 'Aerial view of Rothschild 22 above the Tel Aviv skyline',
  ctaLabel: 'Enter Project',
  scrollLabel: 'Scroll to begin',
  metaAriaLabel: 'Project summary',
};

const hebrewHero: HeroContent = {
  eyebrow: 'אדריכלות. עריכה. יוקרה.',
  title: 'Rothschild 22',
  subtitle:
    'מסע עריכתי בין אור, חומר וחוויית מגורים עילית מעל קו החוף של תל אביב.',
  description:
    'Rothschild 22 מוצג כאן כמו מגזין דיגיטלי חי: טיפוגרפיה שקטה, דימויים סוחפים וסרט סיום שסוגר את הסיפור בקצב מדויק.',
  meta: ['תל אביב', '2026', 'מגדל מגורים'],
  coverVideo: '/assets/videos/hero-film.mp4',
  coverImage: '/assets/images/cover-aerial.png',
  imageAlt: 'מבט אווירי על Rothschild 22 מעל קו הרקיע של תל אביב',
  ctaLabel: 'להיכנס לפרויקט',
  scrollLabel: 'לגלול כדי להתחיל',
  metaAriaLabel: 'תקציר הפרויקט',
};

const englishIntro: IntroContent = {
  id: 'introduction',
  heading: 'A residential narrative shaped as a digital magazine.',
  eyebrow: 'Introduction',
  subheading: '',
  body:
    'The interface remains intentionally restrained: generous white space, precise typography, and fluid motion that reveals content rather than competing with it.',
  ctaLabel: 'Start Reading',
  ctaHref: '#drawings',
  facts: [
    { label: 'Location', value: 'Rothschild Boulevard, Tel Aviv' },
    { label: 'Year', value: '2026' },
    { label: 'Program', value: 'Luxury Residential' },
    { label: 'Area', value: '4,800 sqm' },
  ],
};

const hebrewIntro: IntroContent = {
  id: 'introduction',
  heading: 'פרויקט מגורים שמסופר כמו גיליון דיגיטלי.',
  eyebrow: 'פתיחה',
  subheading: '',
  body:
    'הממשק שומר על איפוק מכוון: מרווחים נדיבים, טיפוגרפיה מדויקת ותנועה זורמת שמגלה את התוכן בלי להתחרות בו.',
  ctaLabel: 'להתחיל את הסיור',
  ctaHref: '#drawings',
  facts: [
    { label: 'מיקום', value: 'שדרות רוטשילד, תל אביב' },
    { label: 'שנה', value: '2026' },
    { label: 'ייעוד', value: 'מגורי יוקרה' },
    { label: 'שטח', value: '4,800 מ"ר' },
  ],
};

const englishChapters: Chapter[] = [
  {
    id: 'vision',
    number: '01',
    title: 'Vision',
    eyebrow: 'A coastal skyline statement',
    intro:
      'The project begins as a quiet monument: generous terraces, continuous glazing, and a sculptural silhouette from every street approach. Rather than compete with the boulevard, it rises as measured setbacks that preserve openness and amplify the sea horizon—a discipline the editorial experience mirrors with wide margins, restrained controls, and one dominant visual move per chapter.',
    body: [],
    quote: 'One iconic frame should carry the chapter before the interface does.',
    image: '/assets/images/glass-corner.png',
    imageAlt: 'Corner view with terrace and glazing',
    layout: 'image-led',
    cta: 'Continue to Context',
  },
  {
    id: 'context',
    number: '02',
    title: 'Context',
    eyebrow: 'City grain and sea proximity',
    intro:
      'The building sits inside a dense white urban fabric, where the coastline and boulevard shape every view corridor. Its placement balances privacy with exposure, opening toward light and long perspectives while preserving a strong street presence—an asymmetric composition where a large image block and compact text column never overpower the visuals.',
    body: [],
    image: '/assets/images/street-facade.png',
    imageAlt: 'Street level perspective of the facade',
    layout: 'split',
    cta: 'Continue to Concept',
  },
  {
    id: 'concept',
    number: '03',
    title: 'Concept',
    eyebrow: 'Terraces as spatial rhythm',
    intro:
      'The massing unfolds as layered planes, using terraces and glazing to turn the skyline into an active part of the interior. Each level acts as a threshold between enclosure and openness, so movement feels like a sequence of framed reveals—a quieter tempo, generous spacing, and subtle motion that speaks to architectural progression rather than spectacle.',
    body: [],
    image: '/assets/images/cover-brand.png',
    imageAlt: 'Aerial architectural view of Rothschild 22',
    layout: 'quiet-image-led',
    cta: 'Continue to Materiality',
  },
  {
    id: 'materiality',
    number: '04',
    title: 'Materiality',
    eyebrow: 'Stone, glass, oak, brushed metal',
    intro:
      'Inside, the palette turns tactile and warm: pale marble, integrated joinery, and soft daylight across smooth surfaces. The material story stays deliberately reduced, letting texture and shadow do the expressive work, supported by restrained accents and image crops that privilege detail over repetition.',
    body: [],
    image: '/assets/images/kitchen-view.png',
    imageAlt: 'Minimal kitchen with sea view',
    layout: 'split',
    cta: 'Continue to Interior',
  },
  {
    id: 'interior',
    number: '05',
    title: 'Interior',
    eyebrow: 'Evening illumination as the final skyline signature',
    intro:
      'The interior sequence becomes softer and more intimate—measured lighting, curated furniture, and tactile finishes turning the residence into a composed evening atmosphere. Rather than a neutral shell, the space focuses on mood and proportion, each object reinforcing the calm architectural language as the palette translates into lived space and comfort.',
    body: [],
    image: '/assets/images/night-aerial.png',
    imageAlt: 'Night aerial view of Rothschild 22 with illuminated skyline presence',
    layout: 'image-led',
    cta: 'Continue to Spatial Experience',
  },
  {
    id: 'spatial-experience',
    number: '06',
    title: 'Spatial Experience',
    eyebrow: 'Living with the city in frame',
    intro:
      'Daily life unfolds in continuous visual contact with the boulevard, where interior calm meets an active urban edge beyond the glass. Rooms are organized for long views, soft transitions, and elevation that stays immersive even when minimal—before the narrative closes by moving into a deeper gallery and a filmic summary.',
    body: [],
    image: '/assets/images/new-me.png',
    imageAlt: 'Living room with panoramic city view',
    layout: 'split',
    cta: 'Open Gallery',
  },
];

const hebrewChapters: Chapter[] = [
  {
    id: 'vision',
    number: '01',
    title: 'חזון',
    eyebrow: 'אייקון שקט על קו הרקיע',
    intro:
      'הפרויקט נולד כמבנה שיודע לנכוח בלי להרים קול: טרסות נדיבות, מעטפת זכוכית רציפה וצללית פיסולית שנקראת היטב מכל גישה רחוב. במקום להתחרות בשדרה, המגדל עולה כרצף מדוד של נסיגות שמגדילות את תחושת הפתיחות ומחדדות את המפגש עם האופק—איפוק שהממשק מאמץ בשוליים רחבים, שליטה שקטה ופריים מרכזי אחד שנותן לכל פרק את הטון שלו.',
    body: [],
    quote: 'הפריים צריך להוביל את הפרק עוד לפני שהממשק נכנס לתמונה.',
    image: '/assets/images/glass-corner.png',
    imageAlt: 'מבט פינתי עם טרסה ומעטפת זכוכית',
    layout: 'image-led',
    cta: 'להמשיך אל ההקשר',
  },
  {
    id: 'context',
    number: '02',
    title: 'הקשר',
    eyebrow: 'עיר, קו חוף ורשת של מבטים',
    intro:
      'הבניין נטוע בתוך מרקם עירוני לבן וצפוף, כזה שבו החוף והשדרה מגדירים כל כיוון מבט משמעותי. המיקום שלו מאזן בין פרטיות לחשיפה—נפתח אל האור והמרחק, אבל שומר על נוכחות חדה וברורה בגובה הרחוב—וקומפוזיציה א-סימטרית שמעניקה לדימוי מקום גדול ולקריאה מקום מדויק, בלי שאחד יגבר על השני.',
    body: [],
    image: '/assets/images/street-facade.png',
    imageAlt: 'מבט רחוב על החזית',
    layout: 'split',
    cta: 'להמשיך אל הרעיון',
  },
  {
    id: 'concept',
    number: '03',
    title: 'הרעיון',
    eyebrow: 'טרסות כקצב אדריכלי',
    intro:
      'המסה נפרשת כשכבות מדורגות, והטרסות הופכות את קו הרקיע לחלק פעיל מחוויית הפנים. כל קומה מתפקדת כנקודת מעבר בין סגירות לפתיחות, כך שהתנועה בפרויקט מרגישה כמו סדרה של גילויים מדויקים—קצב רגוע, מרווחים אנכיים נדיבים ותנועה עדינה שמדגישה מהלך אדריכלי ולא מופע.',
    body: [],
    image: '/assets/images/cover-brand.png',
    imageAlt: 'מבט אווירי אדריכלי על Rothschild 22',
    layout: 'quiet-image-led',
    cta: 'להמשיך אל החומריות',
  },
  {
    id: 'materiality',
    number: '04',
    title: 'חומריות',
    eyebrow: 'אבן, זכוכית, עץ אלון ומתכת מוברשת',
    intro:
      'בפנים, הפלטה נעשית חמה ומוחשית יותר: שיש בהיר, נגרות אינטגרלית ואור יום רך שנשבר על משטחים מדויקים. סיפור החומרים נשאר מצומצם במתכוון, כדי שהמרקם והצל יעשו את העבודה האקספרסיבית—צבע הדגשה מרוסן, קווי חלוקה דקים וחיתוכי תמונה שמעדיפים חומר ופרט על פני עומס.',
    body: [],
    image: '/assets/images/kitchen-view.png',
    imageAlt: 'מטבח מינימליסטי עם מבט לים',
    layout: 'split',
    cta: 'להמשיך אל חללי הפנים',
  },
  {
    id: 'interior',
    number: '05',
    title: 'חללי הפנים',
    eyebrow: 'אור ערב שנותן למגדל זהות לילית',
    intro:
      'רצף הפנים נעשה אינטימי ורך יותר, עם תאורה מדודה, ריהוט אצור וטקסטורות שמייצרות אווירה אסופה ומעודנת. במקום להתייחס לדירה כקליפה ניטרלית, הפרק עוסק במצב רוח ובפרופורציה—כל אובייקט מחזק את השפה האדריכלית, והפלטה הופכת לחיים עצמם ומחברת בין מעטפת מדויקת לנוחות יומיומית.',
    body: [],
    image: '/assets/images/night-aerial.png',
    imageAlt: 'מבט לילי אווירי על Rothschild 22',
    layout: 'image-led',
    cta: 'להמשיך אל חוויית המגורים',
  },
  {
    id: 'spatial-experience',
    number: '06',
    title: 'חוויית המגורים',
    eyebrow: 'העיר תמיד בתוך הפריים',
    intro:
      'חיי היומיום נפתחים אל השדרה ברצף כמעט קולנועי, במקום שבו שקט פנימי פוגש קצב אורבני מעבר לזכוכית. החדרים מסודרים לטובת מבטים ארוכים, מעברים רכים ותחושת גובה שנשארת נוכחת גם כשהשפה נשמרת מינימלית—מכאן המסלול נסגר באופן טבעי אל גלריית הדימויים ומשם אל סרט הסיום שמסכם את הסיפור בתנועה.',
    body: [],
    image: '/assets/images/new-me.png',
    imageAlt: 'סלון עם מבט פנורמי על העיר',
    layout: 'split',
    cta: 'לפתוח את הגלריה',
  },
];

const englishDrawings: DrawingsSectionData = {
  id: 'drawings',
  heading: '3D Drawings',
  eyebrow: 'Interior and building studies',
  subheading:
    'A dedicated pair of architectural sheets that read the project in section-like interior perspective and full-building axonometric form.',
  ctaLabel: 'Continue to Vision',
  ctaHref: '#vision',
  missingFileLabel: 'Waiting for the local file at',
  items: [
    {
      src: '/assets/images/drawing-interior.png',
      alt: 'Architectural interior drawing of the penthouse at Rothschild 22',
      title: 'Interior Drawing',
      caption:
        'Penthouse interior sheet with annotated materials, lighting, and furniture composition.',
    },
    {
      src: '/assets/images/drawing-structure.png',
      alt: '3D architectural drawing of Rothschild 22 in Tel Aviv',
      title: 'Building Drawing',
      caption:
        'Axonometric building study showing terraces, glazing, planted decks, and the skyline-facing massing.',
    },
  ],
};

const hebrewDrawings: DrawingsSectionData = {
  id: 'drawings',
  heading: 'שרטוטי 3D',
  eyebrow: 'חתכי פנים ומבטי מבנה',
  subheading:
    'שני לוחות אדריכליים שמציגים את הפרויקט גם מבפנים וגם כמסה שלמה, עם קריאה מדויקת של חלל, מבנה וקצב.',
  ctaLabel: 'להמשיך אל החזון',
  ctaHref: '#vision',
  missingFileLabel: 'הקובץ המקומי עדיין לא זמין בנתיב',
  items: [
    {
      src: '/assets/images/drawing-interior.png',
      alt: 'שרטוט אדריכלי של חלל הפנטהאוז ב-Rothschild 22',
      title: 'שרטוט פנים',
      caption:
        'לוח פנימי של הפנטהאוז עם קריאת חומרים, אור וריהוט כמקשה אחת.',
    },
    {
      src: '/assets/images/drawing-structure.png',
      alt: 'שרטוט תלת-ממדי של Rothschild 22 בתל אביב',
      title: 'שרטוט מבנה',
      caption:
        'אקסונומטריה של המגדל שמחדדת את הטרסות, הזיגוג והמפגש עם קו הרקיע.',
    },
  ],
};

const englishGalleryItems: GalleryItem[] = [
  {
    src: '/assets/images/cover-aerial.png',
    alt: 'Aerial building hero view',
    caption: 'Opening frame above the urban grid',
  },
  {
    src: '/assets/images/pool-perspective.png',
    alt: 'Terrace and pool perspective',
    caption: 'A horizon line that begins in water and ends at sea',
  },
  {
    src: '/assets/images/interior-portrait.png',
    alt: 'Portrait interior moment',
    caption: 'Scale, intimacy, and domestic presence',
  },
  {
    src: '/assets/images/cover-brand.png',
    alt: 'Architectural aerial silhouette of the tower',
    caption: 'Layered terraces read as a single skyline silhouette',
  },
  {
    src: '/assets/images/night-aerial.png',
    alt: 'Night aerial building view',
    caption: 'Evening illumination as the final skyline signature',
  },
];

const hebrewGalleryItems: GalleryItem[] = [
  {
    src: '/assets/images/cover-aerial.png',
    alt: 'מבט פתיחה אווירי על המגדל',
    caption: 'פריים פתיחה מעל המרקם העירוני',
  },
  {
    src: '/assets/images/pool-perspective.png',
    alt: 'מבט על הטרסה והבריכה',
    caption: 'קו אופק שמתחיל במים ונגמר בים',
  },
  {
    src: '/assets/images/interior-portrait.png',
    alt: 'רגע אינטימי מתוך חלל הפנים',
    caption: 'קנה מידה, אינטימיות ונוכחות ביתית',
  },
  {
    src: '/assets/images/cover-brand.png',
    alt: 'מבט אווירי אדריכלי על המגדל',
    caption: 'הטרסות המדורגות נקראות כצללית אחת',
  },
  {
    src: '/assets/images/night-aerial.png',
    alt: 'מבט לילי אווירי על המגדל',
    caption: 'חתימת ערב שמבליטה את קו הרקיע',
  },
];

const englishGallery: GallerySectionContent = {
  id: 'gallery',
  heading: 'Gallery',
  eyebrow: 'Deep visual reading',
  subheading:
    'A continuous ribbon of featured frames, scaled up to feel cinematic while staying calm, legible, and truly seamless.',
  items: englishGalleryItems,
};

const hebrewGallery: GallerySectionContent = {
  id: 'gallery',
  heading: 'גלריה',
  eyebrow: 'קריאה ויזואלית עמוקה',
  subheading:
    'רצועה רציפה של פריימים נבחרים, גדולה ונוכחת, שנעה בלי להפר את השקט של הקריאה.',
  items: hebrewGalleryItems,
};

const englishVideo: VideoContent = {
  id: 'film',
  title: 'Final Film',
  eyebrow: 'Closing moment',
  subtitle: 'A final look',
  description:
    'A calm transition into motion, designed as the emotional closing sequence rather than a disruptive autoplay element.',
  playLabel: 'Play Film',
  unsupportedMessage: 'Your browser does not support HTML5 video.',
  src: '/assets/videos/final.video.mp4',
  poster: '/assets/images/night-aerial.png',
};

const hebrewVideo: VideoContent = {
  id: 'film',
  title: 'סרט סיום',
  eyebrow: 'פריים אחרון',
  subtitle: 'מבט אחרון',
  description:
    'מעבר רגוע מתמונה לתנועה, שנועד לסגור את החוויה רגשית ולא להרגיש כמו נגן אוטומטי פולשני.',
  playLabel: 'להפעיל את הסרט',
  unsupportedMessage: 'הדפדפן שלך לא תומך בניגון וידאו HTML5.',
  src: '/assets/videos/final.video.mp4',
  poster: '/assets/images/night-aerial.png',
};

const englishCredits: CreditsContent = {
  eyebrow: 'Credits / Exit',
  heading: 'End of Experience',
  body:
    'Architecture, editorial direction, and visual storytelling aligned into one scroll narrative.',
  backToCoverLabel: 'Back to Cover',
};

const hebrewCredits: CreditsContent = {
  eyebrow: 'קרדיטים / יציאה',
  heading: 'סוף החוויה',
  body:
    'אדריכלות, בימוי עריכתי וסיפור חזותי מתחברים כאן למסע גלילה אחד, מדויק ושקט.',
  backToCoverLabel: 'חזרה לכריכה',
};

const englishMetadata = {
  lang: 'en',
  dir: 'ltr',
  title: 'Rothschild 22 Magazine',
  description: 'Interactive editorial magazine for the Rothschild 22 architectural project.',
} as const;

const hebrewMetadata = {
  lang: 'he',
  dir: 'rtl',
  title: 'Rothschild 22 | מהדורה אדריכלית',
  description: 'מגזין דיגיטלי אינטראקטיבי לפרויקט האדריכלי Rothschild 22.',
} as const;

export const siteContentByLocale: Record<Locale, SiteContent> = {
  en: {
    metadata: englishMetadata,
    navigation: englishNavigation,
    hero: englishHero,
    intro: englishIntro,
    drawings: englishDrawings,
    chapters: englishChapters,
    gallery: englishGallery,
    video: englishVideo,
    credits: englishCredits,
  },
  he: {
    metadata: hebrewMetadata,
    navigation: hebrewNavigation,
    hero: hebrewHero,
    intro: hebrewIntro,
    drawings: hebrewDrawings,
    chapters: hebrewChapters,
    gallery: hebrewGallery,
    video: hebrewVideo,
    credits: hebrewCredits,
  },
};

export const isLocale = (value: string | null): value is Locale =>
  value === 'en' || value === 'he';
