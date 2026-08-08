# SEO, Social Preview, and AdSense Design

## Goal

Improve link previews and search-engine discovery without replacing the portfolio's existing
localized SEO architecture. Social previews must show Ihab Khaled's supplied avatar alongside a
localized title and description. Google AdSense discovery must use the static publisher identifier
provided by the site owner.

## Social preview

The existing deterministic social-image generator remains the owner of the 17 locale-specific
1200 × 630 PNG files under `public/social/`. The supplied square avatar becomes a checked-in source
asset for that generator. Each card will preserve the avatar's aspect ratio and combine it with the
locale's existing name, role, and description copy. It will not stretch or crop the avatar into a
landscape image.

Open Graph and Twitter metadata continue to point at the locale-specific absolute image URL. The
metadata contract will explicitly describe the PNG type and 1200 × 630 dimensions. Page titles,
descriptions, canonical URLs, locale alternates, and social-image alternative text remain localized.

## Search discovery and crawlers

`robots.txt` will allow all user agents to crawl public documents, including `/ads.txt`, social
images, and the sitemap. Only `/api/` and each locale's offline utility route remain disallowed
because they are not search-result documents. The robots response will advertise the canonical
sitemap and production host.

The sitemap will contain every indexable static route for every supported locale and every
localized project case-study route. Each entry retains canonical absolute URLs and reciprocal
`hreflang` alternates, including `x-default`. Automated contracts will compare route sources with
the sitemap so newly added public routes cannot silently be omitted.

Robots directives in page metadata will allow indexing, following links, image previews, snippets,
and video previews. These directives express permission; no implementation can guarantee a ranking
or force an external crawler to index a page.

## AdSense

The publisher values are intentionally static source constants, not environment variables:

- account/client: `ca-pub-2415314275784926`
- `ads.txt`: `google.com, pub-2415314275784926, DIRECT, f08c47fec0942fa0`

The localized root layout will publish the `google-adsense-account` meta tag and load Google's
asynchronous AdSense bootstrap script once with `crossorigin="anonymous"`. The script will receive
the existing per-request nonce so it works with the strict CSP. CSP changes will be limited to the
Google origins required by the requested bootstrap and will not add `unsafe-inline` or weaken the
nonce/`strict-dynamic` policy. The public `ads.txt` file will be available at the root with its exact
single-line record.

## Testing and verification

Tests will be written before production changes. Unit contracts will cover:

- AdSense constants and root `ads.txt` contents;
- AdSense metadata/script attributes;
- expanded robots directives and crawler accessibility;
- complete localized static and case-study sitemap coverage;
- social-image URL, MIME type, dimensions, and alternative text.

The deterministic social asset check will cover the avatar source hash as well as generated output.
Focused Vitest and SEO Playwright tests will run first, followed by lint, typecheck, social-asset
verification, build, and the repository's required validation gates that are practical in the local
environment.

## Non-goals

- Adding visible ad placements or choosing their layout.
- Guaranteeing a “10/10” ranking or immediate recrawl by third-party services.
- Disclosing private/API/offline utility pages to search results.
- Replacing localized metadata with one global English preview.
