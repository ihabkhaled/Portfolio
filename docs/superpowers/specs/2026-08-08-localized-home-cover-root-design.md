# Localized Home Cover and English Root Design

## Goal

Show the current locale's generated social cover inside the home-page hero and make the bare root
URL render the complete English site without redirecting. `/en` and every other localized URL must
remain available.

## Hero cover

The hero's main content column will render `/social/<locale>.png` immediately above its eyebrow,
name, and role. The image retains its native 1200:630 aspect ratio and uses the existing generated
asset for the active URL locale, so switching from `/en` to `/ar` also switches from
`/social/en.png` to `/social/ar.png` without client-side state or browser APIs.

The cover sits in a responsive editorial frame derived from the current portfolio visual system:
a raised surface, double border, subtle primary-colour edge accent, and restrained shadow. It will
not crop the image. Arabic and Persian inherit the document's RTL direction; the image itself is
already generated with the matching mirrored layout. The image receives localized alternative text
and is prioritized because it appears in the initial viewport.

The existing profile manifest remains in the hero's secondary column. The cover does not replace
profile facts or introduce new visible copy.

## Root English document

`/` will render the same English application shell and home-page composition as `/en` instead of
redirecting. This includes the i18n provider, navigation, theme controls, structured data, CSP
nonce, AdSense metadata, service-worker registration policy, toast host, footer, and English
messages.

The localized layout and root layout will reuse one shared server-owned document shell rather than
maintaining two independent copies of application wiring. The root page composes
`HomePageContainer` with the default locale.

Both `/` and `/en` remain reachable. To avoid duplicate English search results, `/` publishes the
same English metadata while declaring `/en` as canonical. English navigation continues to use
locale-prefixed URLs, language switching continues to preserve route intent, and the existing
sitemap remains authoritative for `/en` rather than adding a duplicate `/` entry.

## Testing

Implementation follows TDD. Tests will prove that:

- the hero renders the locale-specific 1200×630 image above the name;
- English and Arabic URLs select different cover paths;
- RTL and LTR pages retain correct document direction;
- `/` responds with English content directly and does not redirect;
- `/en` remains reachable;
- `/` declares `/en` as canonical and preserves the full application shell;
- visual baselines intentionally reflect the new framed hero cover.

Focused integration and E2E tests run before lint, typecheck, coverage, production build, visual
review, and the repository pre-push gate.

## Non-goals

- Adding `/` as a second English sitemap entry.
- Replacing the existing locale-specific social-image generator.
- Adding a carousel, animation, image upload flow, or client-side locale image state.
- Removing `/en` or changing any non-English route.
