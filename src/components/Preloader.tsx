import { PRELOADER_LOGO_SRC } from './preloaderConfig';

type PreloaderProps = {
  phase: 'active' | 'exiting';
  exitReason: string | null;
  title: string;
};

export function Preloader({ phase, exitReason, title }: PreloaderProps) {
  return (
    <div
      className={`preloader${phase === 'exiting' ? ' preloader--exiting' : ''}`}
      data-testid="site-preloader"
      data-state={phase}
      data-exit-reason={exitReason ?? 'pending'}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${title}`}
    >
      <div className="preloader__art" aria-hidden="true">
        <img className="preloader__logo preloader__logo--base" src={PRELOADER_LOGO_SRC} alt="" />
        <div className="preloader__reveal">
          <img className="preloader__logo preloader__logo--fill" src={PRELOADER_LOGO_SRC} alt="" />
          <span className="preloader__band preloader__band--primary" />
          <span className="preloader__band preloader__band--secondary" />
          <span className="preloader__band preloader__band--accent" />
        </div>
        <span className="preloader__pulse" />
      </div>
      <span className="sr-only">Preparing the opening film.</span>
    </div>
  );
}
