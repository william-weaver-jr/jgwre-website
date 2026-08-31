import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every static route under `app/` that has its own `page.tsx`, read from the
 * filesystem rather than maintained by hand.
 *
 * tests/compliance.test.tsx, tests/accessibility.test.tsx, and
 * tests/metadata.test.ts each keep their own `PAGES`/`STATIC` list, because
 * each renders differently and needs its own imports. CLAUDE.md §4 used to warn
 * that a new page "ships unchecked" unless someone remembers to add it to both
 * — which is exactly what happened to `/transactions`: present in one suite,
 * silently absent from the other two.
 *
 * This is the check that catches the next one. Each suite asserts its own list
 * is a superset of this function's output, less that suite's own stated
 * exemptions.
 *
 * Excludes:
 * - `app/api/**` — route handlers, not pages.
 * - Dynamic segments (`[slug]`) — a route with no concrete param has nothing
 *   to render. Those pages are covered by generating one entry per published
 *   post or area, which each suite already does.
 * - Route groups (`(name)`) and private folders (`_name`) — Next.js does not
 *   route to either.
 */
export function staticPageRoutes(appDir = join(process.cwd(), "app")): string[] {
  const routes: string[] = [];

  function walk(dir: string, route: string) {
    if (existsSync(join(dir, "page.tsx"))) {
      routes.push(route === "" ? "/" : route);
    }

    for (const entry of readdirSync(dir)) {
      if (entry === "api") continue;
      if (entry.startsWith("[") || entry.startsWith("(") || entry.startsWith("_")) continue;
      if (entry.startsWith(".")) continue;

      const full = join(dir, entry);
      if (!statSync(full).isDirectory()) continue;

      walk(full, `${route}/${entry}`);
    }
  }

  walk(appDir, "");
  return routes.sort();
}
