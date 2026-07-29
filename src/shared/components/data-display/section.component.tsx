import type { ReactElement } from 'react';

import type {
  ManifestPanelProps,
  ManifestRowProps,
  PageIntroProps,
  SectionProps,
} from '../types/shared-component.types';

import { manifestClasses, sectionClasses } from './section.variants';

/** One editorial section: eyebrow, title, optional lead, then content. */
export function Section(props: SectionProps): ReactElement {
  return (
    <section className={sectionClasses.section} aria-labelledby={props.headingId}>
      <p className={sectionClasses.eyebrow}>{props.eyebrow}</p>
      <div className={sectionClasses.column}>
        <h2 id={props.headingId} className={sectionClasses.title}>
          {props.title}
        </h2>
        {props.lead === undefined ? null : <p className={sectionClasses.lead}>{props.lead}</p>}
        <div className={sectionClasses.body}>{props.children}</div>
      </div>
    </section>
  );
}

/** The single h1 block at the top of a route. */
export function PageIntro(props: PageIntroProps): ReactElement {
  return (
    <div className={sectionClasses.pageHeader}>
      <p className={sectionClasses.eyebrow}>{props.eyebrow}</p>
      <h1 className={sectionClasses.pageTitle}>{props.title}</h1>
      <p className={sectionClasses.pageLead}>{props.lead}</p>
    </div>
  );
}

/** One label/value row — the recurring manifest motif. */
export function ManifestRow(props: ManifestRowProps): ReactElement {
  return (
    <div className={manifestClasses.row}>
      <dt className={manifestClasses.label}>{props.label}</dt>
      <dd className={props.mono === true ? manifestClasses.valueMono : manifestClasses.value}>
        {props.value}
      </dd>
    </div>
  );
}

/** Wraps pre-rendered `ManifestRow` elements. The caller owns the `.map()`. */
export function ManifestPanel(props: ManifestPanelProps): ReactElement {
  return <dl className={manifestClasses.panel}>{props.rows}</dl>;
}
