import { ui, defaultLang } from './ui';

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}

export function getLocalePath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}

// Maps DE slugs to EN slugs for pages with different paths per language
const routeMap: Record<string, string> = {
  '/impressum': '/legal-notice',
  '/datenschutz': '/privacy',
  '/kompetenzen': '/skills',
  '/grundsaetze': '/principles',
};

const reverseRouteMap: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([de, en]) => [en, de])
);

export function getTranslatedPath(basePath: string, fromLang: Lang, toLang: Lang): string {
  // Normalize: strip trailing slash (except root)
  const normalized = basePath === '/' ? '/' : basePath.replace(/\/$/, '');

  if (fromLang === 'de' && toLang === 'en' && routeMap[normalized]) {
    return routeMap[normalized];
  }
  if (fromLang === 'en' && toLang === 'de' && reverseRouteMap[normalized]) {
    return reverseRouteMap[normalized];
  }
  return normalized;
}
