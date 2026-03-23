import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRef } from 'react';
import { SectionShell } from './SectionShell';
import type { VideoContent } from '../types/content';

export function VideoSection({
  id,
  title,
  eyebrow,
  subtitle,
  description,
  playLabel,
  unsupportedMessage,
  src,
  poster,
}: VideoContent) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = async () => {
    if (!videoRef.current) {
      return;
    }

    await videoRef.current.play();
    videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <SectionShell
      id={id}
      heading={title}
      eyebrow={eyebrow}
      subheading={description}
    >
      <motion.div
        className="film-panel"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        <div className="film-panel__intro">
          <p>{subtitle}</p>
          <button className="button button--primary" type="button" onClick={handlePlay}>
            <Play size={16} />
            {playLabel}
          </button>
        </div>

        <video
          ref={videoRef}
          className="film-panel__video"
          controls
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
          {unsupportedMessage}
        </video>
      </motion.div>
    </SectionShell>
  );
}
