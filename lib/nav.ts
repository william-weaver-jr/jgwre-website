import { publishedAreas } from "@/lib/areas";
import { publishedPosts } from "@/lib/blog";
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
 * 3. **Search Homes is not here at all.** It was, until 2026-09-04. See the note
 *    at the foot of primaryNav() — it is the one item whose placement is an
 *    economic decision rather than a design one.
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
    "SEARCH HOMES" IS DELIBERATELY NOT HERE. It lives in the footer only, and
    putting it back into the primary navigation costs Jasmine money.

    T6b asked how a lead is attributed when a visitor arrives here from organic
    search, clicks Search Homes, and registers on brokerage-hosted IDX.
    ANSWERED BY JASMINE, 2026-09-04: those leads still go to Matt, and they
    affect her commission split. So the most prominent outbound link on the site
    was converting her own organic traffic into broker-sourced leads at the worse
    rate — the exact thing this site exists to avoid.

    Two findings from the same day reinforce it:

    - `jasmine.mattstoneteam.com` exists and is live, but names her nowhere. No
      bio, no photo, no phone number, a "© 2026 Stone Realty Group" footer, and a
      Create Account / Login gate in front of the listings. The subdomain string
      is the only part of it that is hers.
    - `mattstoneteam.com/idx/` redirects to the generic brokerage search, which
      carries the brokerage's phone number rather than hers.

    Locked Decision #2 requires this site to link out to the Stone Realty Group
    IDX rather than host MLS data here. It says nothing about prominence, and the
    footer satisfies it. Do not "fix" this by promoting the link, by deep-linking
    it to the agent subdomain, or by resolving SEARCH_HOMES_URL to anything that
    captures registrations — none of those change who gets the lead.

    Revisit only if the attribution changes. lib/nav.test.ts holds it here.
  */

  return items;
}
