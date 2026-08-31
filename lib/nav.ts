import { publishedAreas } from "@/lib/areas";
import { publishedPosts } from "@/lib/blog";
import { SEARCH_HOMES_URL } from "@/lib/site";
import { isTransactionsPageIndexable } from "@/lib/transactions";

/**
 * The primary navigation, as data.
 *
 * It lives here rather than inside the header for one reason: every gate below
 * is a rule about what the site is allowed to advertise, and those rules already
 * exist elsewhere in this repo. Expressing them once, in a pure function, means
 * the header cannot quietly disagree with the footer or the sitemap about
 * whether a section is ready to be linked.
 *
 * Structure agreed 2026-08-31 from the Visual & Structural Website Audit:
 *
 *   Buy | Sell | Areas | Negotiation | Proof | About
 *
 * Two deliberate departures from what that audit proposed:
 *
 * 1. **Negotiation stays top-level.** The audit dropped it. The home page hero's
 *    secondary CTA points at it, so demoting it to the footer would strand the
 *    site's main non-phone conversion path.
 * 2. **Contact is not a nav item.** It is the phone button, which is the whole
 *    point of CLAUDE.md Locked Decision #4.
 *
 * NOT DECIDED HERE: where "Search Homes" belongs. See the note on it below.
 */

export type NavLink = {
  href: string;
  label: string;
  /**
   * Leaves the site. The renderer owes these a visible cue as well as the
   * screen-reader one — tests/accessibility.test.tsx enforces the latter.
   */
  external?: boolean;
};

export type NavGroup = {
  label: string;
  children: readonly NavLink[];
};

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

/**
 * Everything under "Proof" — the pages that exist to be checked rather than
 * read. Reviews is unconditional; the other two carry the same gates they carry
 * in the footer, and for the same reason: linking an empty section sitewide
 * advertises the gap more loudly than not linking it at all.
 */
function proofChildren(): NavLink[] {
  const children: NavLink[] = [{ href: "/reviews", label: "Reviews" }];

  if (isTransactionsPageIndexable()) {
    children.push({ href: "/transactions", label: "Transactions" });
  }

  /*
    /blog was reachable from nowhere on the site until 2026-08-31 — not the
    header, not the footer, not one link on the home page. Two published posts
    were live and discoverable only through sitemap.xml, with four or five more
    drafted against the pipeline in docs/CONTENT-MARKETING.md.

    The gate is the same shape as the two above so an empty blog cannot ship a
    link, but the failure this fixes was the opposite one: a full blog with no
    link at all.
  */
  if (publishedPosts().length > 0) {
    children.push({ href: "/blog", label: "Blog" });
  }

  return children;
}

export function primaryNav(): NavItem[] {
  const items: NavItem[] = [
    { href: "/buyers", label: "Buy" },
    { href: "/sellers", label: "Sell" },
  ];

  // Same gate the footer uses. lib/areas keeps unwrittenMarkets() out of the UI
  // deliberately: a card pointing at a 404, or a guide rushed thin to justify
  // one, is the failure docs/AREAS-SPEC.md exists to prevent.
  if (publishedAreas().length > 0) {
    items.push({ href: "/areas", label: "Areas" });
  }

  items.push(
    { href: "/negotiation", label: "Negotiation" },
    { label: "Proof", children: proofChildren() },
    { href: "/about", label: "About" },
  );

  /*
    "Search Homes" is LEFT EXACTLY WHERE IT WAS, and that is a decision rather
    than an oversight.

    The audit recommended deep-linking it and giving it a visible external cue,
    on the reasonable assumption that a link pointing at a brokerage home page is
    simply broken. It is — SEARCH_HOMES_URL is still the bare root. But T6b in
    the implementation backlog raises what that audit could not know: a visitor
    who arrives here from organic search, clicks through to brokerage-hosted IDX,
    and registers may become a *brokerage-sourced* lead, at a materially worse
    commission split for Jasmine. This site exists to avoid exactly that.

    So "fix the destination" and "demote it out of primary navigation" are
    opposite responses to one finding, and which is right depends on a written
    answer from Stone Realty Group that nobody has yet. Until it arrives, the
    honest move is to change neither the destination nor the prominence.

    Do not resolve this by guessing. See task V4.
  */
  items.push({ href: SEARCH_HOMES_URL, label: "Search Homes", external: true });

  return items;
}
