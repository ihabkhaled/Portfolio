import type { ReactElement } from 'react';

import type {
  ManifestPanelProperties,
  ManifestRowProperties,
  PageIntroProperties,
  SectionProperties,
} from '../types/shared-component.types';

import { manifestClasses, sectionClasses } from './section.variants';

/**
One editorial section: eyebrow, title, optional lead, then content.
*/
export function Section(properties: SectionProperties): ReactElement {
  return (
    <section className={sectionClasses.section} aria-labelledby={properties.headingId}>
      <p className={sectionClasses.eyebrow}>{properties.eyebrow}</p>
      <div className={sectionClasses.column}>
        <h2 id={properties.headingId} className={sectionClasses.title}>
          {properties.title}
        </h2>
        {properties.lead === undefined ? null : (
          <p className={sectionClasses.lead}>{properties.lead}</p>
        )}
        <div className={sectionClasses.body}>{properties.children}</div>
      </div>
    </section>
  );
}

/**
The single h1 block at the top of a route.
*/
export function PageIntro(properties: PageIntroProperties): ReactElement {
  return (
    <div className={sectionClasses.pageHeader}>
      <p className={sectionClasses.eyebrow}>{properties.eyebrow}</p>
      <h1 className={sectionClasses.pageTitle}>{properties.title}</h1>
      <p className={sectionClasses.pageLead}>{properties.lead}</p>
    </div>
  );
}

/**
One label/value row — the recurring manifest motif.
*/
export function ManifestRow(properties: ManifestRowProperties): ReactElement {
  return (
    <div className={manifestClasses.row}>
      <dt className={manifestClasses.label}>{properties.label}</dt>
      <dd className={properties.mono === true ? manifestClasses.valueMono : manifestClasses.value}>
        {properties.value}
      </dd>
    </div>
  );
}

/**
Wraps pre-rendered `ManifestRow` elements. The caller owns the `.map()`.
*/
export function ManifestPanel(properties: ManifestPanelProperties): ReactElement {
  return <dl className={manifestClasses.panel}>{properties.rows}</dl>;
}
