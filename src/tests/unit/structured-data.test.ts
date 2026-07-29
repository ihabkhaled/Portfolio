import { describe, expect, it } from 'vitest';

import {
  buildBreadcrumbStructuredData,
  buildPersonStructuredData,
  buildSoftwareSourceCodeStructuredData,
  buildWebsiteStructuredData,
  serializeStructuredData,
} from '@/shared/helpers/structured-data.helper';

describe('buildPersonStructuredData', () => {
  it('builds a schema.org Person with a PostalAddress and sameAs profile links', () => {
    expect(
      buildPersonStructuredData({
        name: 'Ihab Khaled',
        jobTitle: 'Senior Software Engineer',
        url: 'https://ihabkhaled.com/en',
        sameAs: ['https://github.com/ihabkhaled', 'https://www.linkedin.com/in/ihabkhaled94/'],
        addressLocality: 'Giza',
        addressCountry: 'Egypt',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ihab Khaled',
      jobTitle: 'Senior Software Engineer',
      url: 'https://ihabkhaled.com/en',
      sameAs: ['https://github.com/ihabkhaled', 'https://www.linkedin.com/in/ihabkhaled94/'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Giza',
        addressCountry: 'Egypt',
      },
    });
  });
});

describe('buildWebsiteStructuredData', () => {
  it('builds a schema.org WebSite tagged with the current locale', () => {
    expect(
      buildWebsiteStructuredData({
        name: 'Ihab Khaled',
        url: 'https://ihabkhaled.com/fr',
        locale: 'fr',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Ihab Khaled',
      url: 'https://ihabkhaled.com/fr',
      inLanguage: 'fr',
    });
  });
});

describe('buildBreadcrumbStructuredData', () => {
  it('numbers each item by its position, starting at 1', () => {
    const result = buildBreadcrumbStructuredData({
      items: [
        { name: 'Home', url: 'https://ihabkhaled.com/en' },
        { name: 'Projects', url: 'https://ihabkhaled.com/en/projects' },
        { name: 'ClawAI', url: 'https://ihabkhaled.com/en/projects/clawai' },
      ],
    });

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ihabkhaled.com/en' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: 'https://ihabkhaled.com/en/projects',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'ClawAI',
          item: 'https://ihabkhaled.com/en/projects/clawai',
        },
      ],
    });
  });

  it('produces an empty item list for no items', () => {
    expect(buildBreadcrumbStructuredData({ items: [] })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    });
  });
});

describe('buildSoftwareSourceCodeStructuredData', () => {
  it('includes codeRepository for an open-source project', () => {
    const result = buildSoftwareSourceCodeStructuredData({
      name: 'ClawAI',
      description: 'Local-first AI orchestration platform.',
      url: 'https://ihabkhaled.com/en/projects/clawai',
      codeRepository: 'https://github.com/ihabkhaled/ClawAI',
      keywords: ['Next.js', 'NestJS', 'TypeScript'],
      authorName: 'Ihab Khaled',
      authorUrl: 'https://ihabkhaled.com/en',
    });

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: 'ClawAI',
      description: 'Local-first AI orchestration platform.',
      url: 'https://ihabkhaled.com/en/projects/clawai',
      codeRepository: 'https://github.com/ihabkhaled/ClawAI',
      keywords: 'Next.js, NestJS, TypeScript',
      author: { '@type': 'Person', name: 'Ihab Khaled', url: 'https://ihabkhaled.com/en' },
    });
  });

  it('omits codeRepository for an employer-owned project with no public repo', () => {
    const result = buildSoftwareSourceCodeStructuredData({
      name: 'myoncare',
      description: 'A medical device platform.',
      url: 'https://ihabkhaled.com/en/projects/myoncare',
      codeRepository: null,
      keywords: ['Node.js'],
      authorName: 'Ihab Khaled',
      authorUrl: 'https://ihabkhaled.com/en',
    });

    expect(result).not.toHaveProperty('codeRepository');
  });
});

describe('serializeStructuredData', () => {
  it('produces valid, parseable JSON', () => {
    const json = serializeStructuredData({ '@type': 'Person', name: 'Ihab Khaled' });

    expect(JSON.parse(json)).toEqual({ '@type': 'Person', name: 'Ihab Khaled' });
  });

  it('escapes every literal "<" so an embedded value cannot close the script tag early', () => {
    const dangerousValue = ['</scr', 'ipt><scr', 'ipt>alert(1)</scr', 'ipt>'].join('');
    const json = serializeStructuredData({ description: dangerousValue });
    const openAngleBracketCount = json.split('<').length - 1;

    expect(openAngleBracketCount).toBe(0);
    expect(JSON.parse(json)).toEqual({ description: dangerousValue });
  });
});
