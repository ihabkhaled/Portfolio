/**
 * A nested route such as /projects/clawai still marks "Projects" as current,
 * so the header never loses its place on a case-study page.
 */
export function isCurrentPath(pathname: string, href: string, homeHref: string): boolean {
  if (href === homeHref) return pathname === homeHref;
  return pathname === href || pathname.startsWith(`${href}/`);
}
