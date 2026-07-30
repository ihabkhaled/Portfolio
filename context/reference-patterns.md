# Reference Patterns

Canonical excerpts quoted verbatim from the repo. When you write a new file, start from the
matching excerpt here and its source file — do not invent a new shape. The `projects` module is
the flagship reference for the full layer anatomy.

## 1. TSX-only component

From [src/modules/projects/components/project-row.component.tsx](../src/modules/projects/components/project-row.component.tsx).
No hooks, no logic, no raw copy, no raw classes — everything arrives pre-computed on props, and
the caller decides link-vs-plain-row by passing `caseStudyHref` or `null`:

```tsx
export function ProjectRow(props: ProjectRowProps): ReactElement {
  return (
    <li className={projectRowClasses.item}>
      <span className={projectRowClasses.accent} aria-hidden />
      {props.caseStudyHref === null ? (
        <div className={projectRowClasses.link}>
          <ProjectRowBody {...props} />
        </div>
      ) : (
        <AppLink href={props.caseStudyHref} className={projectRowClasses.link}>
          <ProjectRowBody {...props} />
        </AppLink>
      )}
    </li>
  );
}
```

## 2. Container: hook → components, the `.map()`

From [src/modules/site-navigation/containers/site-navigation.container.tsx](../src/modules/site-navigation/containers/site-navigation.container.tsx).
Note the mandatory client-boundary reason comment — the container owns the `.map()`, the hook
owns the view-model shape:

```tsx
'use client';
// client-boundary-reason: reads the active pathname to mark the current route.

export function SiteNavigationContainer(props: SiteNavigationProps): ReactElement {
  const navigation = useSiteNavigation(props);

  return (
    <>
      {navigation.items.map((item) => (
        <AppLink
          key={item.href}
          href={item.href}
          className={cn(
            siteShellClasses.navLink,
            item.isCurrent && siteShellClasses.navLinkCurrent,
          )}
          aria-current={item.isCurrent ? 'page' : undefined}
          onClick={navigation.onSelect}
        >
          {item.label}
        </AppLink>
      ))}
    </>
  );
}
```

## 3. Gateway → mapper → service chain

This app has almost no client-side query cache to speak of — nearly everything renders from
Server Components, so there is currently no live example of a query-key builder file
(`no-inline-query-keys` still applies the moment one is needed; see
`src/modules/contact/queries/contact.mutations.ts` for the one TanStack usage this app has
today, a mutation with no cache to invalidate). The gateway → mapper → service chain the rule
still enforces is best illustrated by the GitHub integration, which also shows the one
deliberate deviation from "gateways always use `httpClient`": calls to third-party origins use
`fetch` directly (`httpClient` is for same-origin calls only), and failures are swallowed by
design rather than surfaced.

Gateway ([src/modules/github-profile/gateway/github.gateway.ts](../src/modules/github-profile/gateway/github.gateway.ts))
speaks HTTP to GitHub's REST API and validates the wire shape; on any failure it returns `null`
rather than throwing, because the page it feeds must never break on GitHub's account:

```ts
export async function fetchRepositorySnapshot(
  owner: string,
  repository: string,
): Promise<RepositorySnapshot | null> {
  const { githubToken } = getServerEnv();

  try {
    const response = await fetch(`${GITHUB_API_ORIGIN}/repos/${owner}/${repository}`, {
      headers: buildHeaders(githubToken),
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      appLogger.warn('github repository request rejected', { repository, status: response.status });
      return null;
    }

    const parsed = githubRepositorySchema.safeParse(await response.json());
    if (!parsed.success) {
      appLogger.warn('github repository payload did not match the schema', { repository });
      return null;
    }

    return mapRepositoryPayload(parsed.data);
  } catch {
    // Deliberately swallowed: the static catalog is the contract with the page.
    appLogger.warn('github repository request failed', { repository });
    return null;
  }
}
```

Mapper ([src/modules/github-profile/mappers/github.mapper.ts](../src/modules/github-profile/mappers/github.mapper.ts))
converts the wire payload to the app's domain shape, normalizing every optional field through a
dedicated helper rather than inline fallbacks:

```ts
export function mapRepositoryPayload(payload: GithubRepositoryPayload): RepositorySnapshot {
  return {
    name: payload.name,
    description: toNullableText(payload.description),
    url: payload.html_url,
    homepage: toVerifiedHomepage(payload.homepage),
    topics: payload.topics ?? [],
    primaryLanguage: toNullableText(payload.language),
    stars: toPositiveCount(payload.stargazers_count),
    forks: toPositiveCount(payload.forks_count),
    license: toLicense(payload.license?.spdx_id),
    lastActivityAt: toNullableText(payload.pushed_at) ?? toNullableText(payload.updated_at),
  };
}
```

Service ([src/modules/github-profile/services/github-activity.service.ts](../src/modules/github-profile/services/github-activity.service.ts))
is the React-free use case: it fans out the gateway call across every curated repository
concurrently and reports whether any of them fell back, so the caller can render a degraded
state without caring which specific repository failed:

```ts
export async function buildRepositoryActivityReport(
  repositoryNames: readonly string[],
): Promise<RepositoryActivityReport> {
  const results = await Promise.all(
    repositoryNames.map((name) => fetchRepositorySnapshot(GITHUB_OWNER, name)),
  );

  const repositories = results.filter(
    (snapshot): snapshot is RepositorySnapshot => snapshot !== null,
  );

  return { repositories, degraded: repositories.length !== repositoryNames.length };
}
```

## 4. Zustand store

From [src/modules/ui-preferences/store/ui-preferences.store.ts](../src/modules/ui-preferences/store/ui-preferences.store.ts).
The store stays pure; persistence and DOM sync live in `use-ui-preferences-effects.hook.ts` via the
storage and browser facades.

```ts
export const useUiPreferencesStore = createAppStore<UiPreferencesState>()((set) => ({
  ...UI_PREFERENCES_DEFAULTS,
  hasHydrated: false,
  setTheme: (theme) => {
    set({ theme });
  },
  setDirection: (direction) => {
    set({ direction });
  },
  toggleSidebar: () => {
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded }));
  },
  hydrate: (snapshot: UiPreferencesSnapshot) => {
    set({ ...snapshot, hasHydrated: true });
  },
}));
```

## 5. Form: server-authoritative schema + status-driven submit hook

This app's one form (contact) trusts the browser's native constraint validation
(`required`/`minLength`/`maxLength` on the inputs) for the client-side experience and treats the
Zod schema as server-side authority only — there is no per-field i18n error-key mapping to quote
here, because the form never needs one. What it does demonstrate: `.strict()` schemas that reject
unknown keys, and a submit hook whose entire return value is a translated view model driven by
mutation lifecycle, not local component state.

Schema ([src/modules/contact/schemas/contact.schema.ts](../src/modules/contact/schemas/contact.schema.ts)):

```ts
export const contactRequestSchema = z
  .object({
    email: z.email().max(CONTACT_EMAIL_MAX_LENGTH),
    subject: z.string().trim().min(CONTACT_SUBJECT_MIN_LENGTH).max(CONTACT_SUBJECT_MAX_LENGTH),
    message: z.string().trim().min(CONTACT_MESSAGE_MIN_LENGTH).max(CONTACT_MESSAGE_MAX_LENGTH),
  })
  .strict();
```

Hook ([src/modules/contact/hooks/use-contact-form.hook.ts](../src/modules/contact/hooks/use-contact-form.hook.ts)):

```ts
export function useContactForm(labels: ContactFormLabels): UseContactFormResult {
  const mutation = useSendContactMutation();
  const status = resolveContactStatus(mutation);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = contactRequestSchema.safeParse(readContactFormValues(form));
    if (!parsed.success) return;

    mutation.mutate(parsed.data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return { status, ...buildContactStatusViewModel(status, labels), onSubmit };
}
```

`resolveContactStatus` distinguishes a 503 ("service unavailable, email me directly") from any
other failure — see `src/modules/contact/helpers/contact-mutation-status.helper.ts`.

## 6. Error mapping chain

From [src/shared/errors/http-error-to-message-key.mapper.ts](../src/shared/errors/http-error-to-message-key.mapper.ts) —
"the only path from transport failures to user-visible copy". `HttpError` in, translatable key out:

```ts
export function mapErrorToMessageKey(error: unknown): ErrorMessageKey {
  if (!isHttpError(error)) {
    return ERROR_MESSAGE_KEYS.generic;
  }

  if (error.kind === 'network') {
    return ERROR_MESSAGE_KEYS.network;
  }
  // … timeout / 401 / 403 / 404 / >=500 branches elided …
  return ERROR_MESSAGE_KEYS.generic;
}
```

The full chain: axios interceptor normalizes to `HttpError` (`@/packages/axios`), hooks map it with
`mapErrorToMessageKey`, and `useAppTranslation` renders the key. Raw error text never reaches users —
see [rules/18-error-handling.md](../rules/18-error-handling.md).
