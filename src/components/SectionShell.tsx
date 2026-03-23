import type { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

type SectionShellProps = PropsWithChildren<{
  id?: string;
  className?: string;
  heading?: string;
  eyebrow?: string;
  subheading?: string;
}>;

export function SectionShell({
  id,
  className,
  heading,
  eyebrow,
  subheading,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={`section-shell ${className ?? ''}`}>
      {(eyebrow || heading || subheading) && (
        <motion.div
          className="section-shell__header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {heading && <h2>{heading}</h2>}
          {subheading && <p className="section-shell__subheading">{subheading}</p>}
        </motion.div>
      )}
      {children}
    </section>
  );
}
