import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactElement, ReactNode } from 'react';

import { PUBLIC_PROFILE } from '@/modules/profile';
import { ServiceWorkerRegistrationContainer } from '@/modules/pwa';
import { SiteNavigationContainer, type SiteNavigationLabels } from '@/modules/site-navigation';
import { ShellControlsContainer } from '@/modules/ui-preferences';
import {
  AppIntlProvider,
  getLocaleDirection,
  getServerMessages,
  getServerTranslations,
  isSupportedLocale,
  setServerLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from '@/packages/i18n';
import { AppLink, ExternalLink } from '@/packages/link';
import { appNotFound } from '@/packages/navigation';
import { AppToaster } from '@/packages/toast';
import { buttonVariants, cn } from '@/packages/ui-primitives';
import { LANDMARK_IDS } from '@/shared/accessibility/landmark-ids.constants';
import { SiteShell } from '@/shared/components/layout/site-shell.component';
import { siteShellClasses } from '@/shared/components/layout/site-shell.variants';
import { SkipLink } from '@/shared/components/primitives/skip-link.component';
import { StructuredDataScript } from '@/shared/components/seo/structured-data-script.component';
import { appConfig } from '@/shared/config/app-config';
import { ROUTE_PATHS } from '@/shared/constants/route-paths.constants';
import { TEST_IDS } from '@/shared/constants/test-ids.constants';
import { appFontClassName } from '@/shared/fonts/app-fonts';
import { buildLocalizedPath } from '@/shared/helpers/localized-route.helper';
import { buildAbsoluteAppUrl } from '@/shared/helpers/seo-metadata.helper';
import {
  buildPersonStructuredData,
  buildWebsiteStructuredData,
  serializeStructuredData,
} from '@/shared/helpers/structured-data.helper';
import { I18N_NAMESPACES } from '@/shared/i18n/i18n-namespaces.constants';

import { AppProviders } from '../providers';

import { layoutClasses } from './layout.variants';

import '../styles.css';

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.appUrl),
};

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: AppLocale }[] {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: LocaleLayoutProps): Promise<ReactElement> {
  const { locale: candidate } = await props.params;
  if (!isSupportedLocale(candidate)) {
    appNotFound();
  }

  const locale = candidate;
  setServerLocale(locale);
  const direction = getLocaleDirection(locale);
  const messages = await getServerMessages({ locale });
  const tApp = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.app });
  const tNav = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.nav });
  const tContact = await getServerTranslations({ locale, namespace: I18N_NAMESPACES.contact });

  const navigationLabels: SiteNavigationLabels = {
    home: tNav('home'),
    experience: tNav('experience'),
    projects: tNav('projects'),
    skills: tNav('skills'),
    about: tNav('about'),
    resume: tNav('resume'),
    contact: tNav('contact'),
  };

  const socialLabels: Readonly<Record<string, string>> = {
    github: tContact('githubLabel'),
    linkedin: tContact('linkedinLabel'),
  };

  const socialLinks = PUBLIC_PROFILE.links
    .filter((link) => link.id !== 'email')
    .map((link) => (
      <ExternalLink key={link.id} href={link.href} className={siteShellClasses.footerLink}>
        {socialLabels[link.id] ?? link.id}
      </ExternalLink>
    ));

  const homeUrl = buildAbsoluteAppUrl(buildLocalizedPath(locale, ROUTE_PATHS.home));
  const personJsonLd = serializeStructuredData(
    buildPersonStructuredData({
      name: PUBLIC_PROFILE.displayName,
      jobTitle: tApp('role'),
      url: homeUrl,
      sameAs: PUBLIC_PROFILE.links.filter((link) => link.id !== 'email').map((link) => link.href),
      addressLocality: 'Giza',
      addressCountry: 'Egypt',
    }),
  );
  const websiteJsonLd = serializeStructuredData(
    buildWebsiteStructuredData({ name: PUBLIC_PROFILE.displayName, url: homeUrl, locale }),
  );

  return (
    <html lang={locale} dir={direction} data-theme="light" className={appFontClassName}>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <StructuredDataScript json={personJsonLd} />
        <StructuredDataScript json={websiteJsonLd} />
      </head>
      <body className={layoutClasses.body}>
        <AppIntlProvider locale={locale} messages={messages}>
          <AppProviders key={locale}>
            {appConfig.isProduction ? <ServiceWorkerRegistrationContainer /> : null}
            <SkipLink targetHref={`#${LANDMARK_IDS.mainContent}`} label={tApp('skipToContent')} />
            <div data-testid={TEST_IDS.appHeader}>
              <SiteShell
                navigationLabel={tNav('landmarkLabel')}
                menuLabel={tNav('menu')}
                brandHomeLink={
                  <AppLink
                    href={buildLocalizedPath(locale, ROUTE_PATHS.home)}
                    className={siteShellClasses.brand}
                  >
                    <span className={siteShellClasses.brandName}>{tApp('title')}</span>
                    <span className={siteShellClasses.brandRole}>{tApp('role')}</span>
                  </AppLink>
                }
                desktopNavigation={
                  <SiteNavigationContainer
                    locale={locale}
                    labels={navigationLabels}
                    scope="primary"
                  />
                }
                mobileNavigation={
                  <SiteNavigationContainer locale={locale} labels={navigationLabels} scope="all" />
                }
                headerAction={
                  <ExternalLink
                    href={PUBLIC_PROFILE.curriculumVitaePath}
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'sm' }),
                      siteShellClasses.headerAction,
                    )}
                  >
                    {tApp('downloadCv')}
                  </ExternalLink>
                }
                controls={
                  <ShellControlsContainer
                    locale={locale}
                    localeLabel={tApp('localeSwitchLabel')}
                    themeLabel={tApp('themeSwitchLabel')}
                    themeLabels={{
                      light: tApp('theme.light'),
                      dark: tApp('theme.dark'),
                      system: tApp('theme.system'),
                    }}
                  />
                }
                footerNote={tApp('footerNote')}
                footerNavigation={
                  <SiteNavigationContainer
                    locale={locale}
                    labels={navigationLabels}
                    scope="footer"
                  />
                }
                footerSocial={socialLinks}
              >
                <main id={LANDMARK_IDS.mainContent} className={layoutClasses.main}>
                  {props.children}
                </main>
              </SiteShell>
            </div>
            <AppToaster />
          </AppProviders>
        </AppIntlProvider>
      </body>
    </html>
  );
}
