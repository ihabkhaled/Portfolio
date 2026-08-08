import type { AppLocale } from '@/packages/i18n';

/**
 * `getTranslations` from `next-intl/server` resolves to a client-only stub
 * outside a real Next.js RSC build (Vitest/jsdom has no `react-server`
 * export condition), so async Server Component containers cannot call the
 * real thing in tests. This re-implements the narrow subset of ICU our
 * catalogs use — plain `{var}` interpolation and `{var, plural, ...}` —
 * against the real locale JSON, so container tests exercise real copy and
 * real key paths without retesting next-intl itself.
 */

type MessageNode = string | { readonly [key: string]: MessageNode };
type MessageTree = Readonly<Record<string, MessageNode>>;

const messageTreeCache = new Map<AppLocale, Promise<MessageTree>>();

function loadMessageTree(locale: AppLocale): Promise<MessageTree> {
  const cached = messageTreeCache.get(locale);
  if (cached) return cached;

  const promise = (async (): Promise<MessageTree> => {
    const imported = (await import(`@/packages/i18n/messages/${locale}.json`)) as {
      default: MessageTree;
    };
    return imported.default;
  })();
  messageTreeCache.set(locale, promise);
  return promise;
}

function resolveMessage(tree: MessageTree, path: string): string {
  const segments = path.split('.');
  let node: MessageNode = tree;

  for (const segment of segments) {
    if (typeof node === 'string' || node[segment] === undefined) {
      throw new Error(`Stub translation missing key "${path}"`);
    }
    node = node[segment];
  }

  if (typeof node !== 'string') {
    throw new TypeError(`Stub translation key "${path}" does not resolve to a string`);
  }

  return node;
}

/**
Parses `label {text} label {text}…` ICU plural forms without regex backtracking risk.
*/
function parsePluralForms(body: string): Map<string, string> {
  const forms = new Map<string, string>();
  let cursor = 0;

  while (cursor < body.length) {
    const braceStart = body.indexOf('{', cursor);
    if (braceStart === -1) break;
    const braceEnd = body.indexOf('}', braceStart);
    if (braceEnd === -1) break;

    const label = body.slice(cursor, braceStart).trim();
    if (label !== '') {
      forms.set(label, body.slice(braceStart + 1, braceEnd));
    }
    cursor = braceEnd + 1;
  }

  return forms;
}

function selectIcuPluralText(body: string, locale: AppLocale, count: number): string {
  const category = new Intl.PluralRules(locale).select(count);
  const forms = parsePluralForms(body);

  const text = forms.get(category) ?? forms.get('other') ?? '';
  return text.replaceAll('#', () => String(count));
}

function interpolate(
  template: string,
  locale: AppLocale,
  values?: Readonly<Record<string, string | number>>,
): string {
  const pluralMatch = /^\{(\w+), plural, (.*)\}$/su.exec(template.trim());
  if (pluralMatch) {
    const [, variableName, body] = pluralMatch;
    const count = Number(variableName === undefined ? undefined : values?.[variableName]);
    return selectIcuPluralText(body ?? '', locale, count);
  }

  return template.replaceAll(/\{(\w+)\}/gu, (match, key: string) => {
    const value = values?.[key];
    return value === undefined ? match : String(value);
  });
}

export type StubTranslator = (
  key: string,
  values?: Readonly<Record<string, string | number>>,
) => string;

/**
Test-only stand-in for `getServerTranslations({ locale, namespace })`.
*/
export async function stubServerTranslations(
  locale: AppLocale,
  namespace: string,
): Promise<StubTranslator> {
  const tree = await loadMessageTree(locale);

  return (key, values) => interpolate(resolveMessage(tree, `${namespace}.${key}`), locale, values);
}
