import { motion } from 'framer-motion';
import type { ProjectFact } from '../types/content';
import { SectionShell } from './SectionShell';

type ProjectDataProps = {
  facts: ProjectFact[];
};

export function ProjectData({ facts }: ProjectDataProps) {
  return (
    <SectionShell
      id="project-data"
      heading="Project Data"
      eyebrow="Reference layer"
      subheading="A quiet typographic summary that keeps professional information accessible without breaking the visual rhythm."
    >
      <motion.dl
        className="project-data"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </motion.dl>
    </SectionShell>
  );
}
