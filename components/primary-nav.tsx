"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { isNavGroup, type NavGroup, type NavItem, type NavLink } from "@/lib/nav";

/**
 * The primary navigation, in both of its forms.
 *
 * Until 2026-08-31 there was only one form. The header rendered its links as
 * `hidden md:flex`, so on a phone the entire structure of the site was
 * `display: none` — not merely invisible but absent from the tab order and the
 * accessibility tree. A mobile visitor saw her name, the phone button, and
 * nothing else, with Buyers, Sellers, Areas, Reviews, Transactions and the blog
 * all unreachable.
 *
 * Worth knowing why that survived a green test suite: tests/accessibility.test.tsx
 * runs axe inside jsdom, which has no viewport and evaluates no media queries. A
 * nav that is display:none at every width it can observe is indistinguishable
 * from a correctly responsive one. This is the case for the browser-level suite
 * CLAUDE.md §4 names as the deliberate gap — until it exists, changes here are
 * verified in a real browser by hand.
 *
 * No router hooks. `usePathname` would be the obvious way to close the menu on
 * navigation, and it reads from a context the test suites do not provide — the
 * header is rendered bare by renderToStaticMarkup. Closing on link click costs
 * one handler and keeps this component renderable anywhere.
 */
export function PrimaryNav({ items }: { items: readonly NavItem[] }) {
  return (
    <>
      <DesktopNav items={items} />
      <MobileNav items={items} />
    </>
  );
}

const LINK = "decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline";

/**
 * Hydration detection for the portal below, via `useSyncExternalStore` rather
 * than a `setMounted(true)` in an effect: the server snapshot is `false`, the
 * client snapshot is `true`, and nothing ever changes after that — so there is
 * no subscription to make and no synchronous setState to cascade from.
 */
const subscribeNever = () => () => {};

/** The external-site cue, visible and audible. One place so they cannot diverge. */
function ExternalLabel({ label }: { label: string }) {
  return (
    <>
      {label}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> (opens an external site)</span>
    </>
  );
}

function NavAnchor({
  link,
  className,
  onNavigate,
}: {
  link: NavLink;
  className?: string;
  onNavigate?: () => void;
}) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        <ExternalLabel label={link.label} />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      {link.label}
    </Link>
  );
}

/* ------------------------------------------------------------------ DESKTOP */

function DesktopNav({ items }: { items: readonly NavItem[] }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-8">
      {items.map((item) =>
        isNavGroup(item) ? (
          <DesktopGroup key={item.label} group={item} />
        ) : (
          <NavAnchor key={item.href} link={item} className={`text-sm ${LINK}`} />
        ),
      )}
    </nav>
  );
}

/**
 * "Proof" — Reviews, Transactions, and the blog under one heading.
 *
 * A disclosure button rather than a hover-only menu: hover menus are unreachable
 * by keyboard and by touch, and this nav has to work for both. Pointer users
 * still get hover-to-open on top of the click, because a nav that only responds
 * to clicks feels broken with a mouse.
 */
function DesktopGroup({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapper = useRef<HTMLDivElement>(null);

  // Close when focus or the pointer leaves the whole control. Checked against
  // the wrapper rather than the button so moving between the trigger and the
  // panel — which is the normal path — does not close it underneath the cursor.
  useEffect(() => {
    if (!open) return;

    function onDocument(event: MouseEvent | FocusEvent) {
      const target = event.target as Node | null;
      if (target && !wrapper.current?.contains(target)) setOpen(false);
    }

    document.addEventListener("mousedown", onDocument);
    document.addEventListener("focusin", onDocument);
    return () => {
      document.removeEventListener("mousedown", onDocument);
      document.removeEventListener("focusin", onDocument);
    };
  }, [open]);

  return (
    <div
      ref={wrapper}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        setOpen(false);
        // Escape must land the visitor back on the trigger, not adrift in the
        // header. Without this the next Tab restarts from the document.
        wrapper.current?.querySelector("button")?.focus();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((was) => !was)}
        className={`flex items-center gap-1.5 text-sm ${LINK}`}
      >
        {group.label}
        <Chevron open={open} />
      </button>

      <ul
        id={panelId}
        // `hidden` rather than an opacity transition: a menu that is merely
        // transparent is still focusable, which is how keyboard users end up
        // tabbing into links they cannot see.
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-3 min-w-44 border border-border bg-surface py-2 shadow-lg"
      >
        {group.children.map((child) => (
          <li key={child.href}>
            <NavAnchor
              link={child}
              onNavigate={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-surface-sunken"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 4.5 6 8.5 10 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------- MOBILE */

function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /*
    The panel is portalled to <body>, and that is load-bearing rather than tidy.

    SiteHeader carries `backdrop-blur`. A `backdrop-filter` makes an element the
    containing block for any `position: fixed` descendant, so a panel rendered
    inside the header resolves `inset-0` against the *header* instead of the
    viewport: computed top/right/bottom/left were all 0px and the panel was 76px
    tall — exactly the height of the header — with the whole nav overflowing
    invisibly inside it. Nothing about the markup looked wrong, which is why this
    is written down.

    Mounting is gated because there is no document during server rendering. The
    panel is closed on first paint anyway, so nothing is lost by it appearing at
    hydration.
  */
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    // Focus into the panel so a keyboard visitor is inside the menu they just
    // opened, and so a screen reader announces it rather than staying on the
    // trigger. The close button is first, which is also where a visitor who
    // opened it by accident wants to be.
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      /*
        Explicit Tab cycling, not an `inert` on the rest of the page.

        StickyContactBar is `fixed` and mobile-only too, so while this panel is
        open there is another pair of focusable controls sitting underneath it.
        Trapping Tab here is what stops focus landing on a Call button the
        visitor cannot see.
      */
      const focusable = panel.current?.querySelectorAll<HTMLElement>("a, button");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // The page behind must not scroll under an open full-height panel.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const panelMarkup = (
    <div
      id={panelId}
      ref={panel}
      hidden={!open}
      /*
        Full screen, and it covers the header rather than sitting under it.

        The alternative — offsetting the panel by the header's height — needs a
        number this component does not have: the header grows and shrinks with
        the `hidden sm:inline` title beneath her name. Covering everything and
        carrying its own close button means there is no measurement to get wrong.

        `lg:hidden` is repeated here because the portal lands this outside the
        trigger's wrapper, so it no longer inherits that breakpoint. Without it a
        desktop visitor who opened the menu on a narrow window and then widened
        it would be left staring at a full-screen panel.

        z-60, not z-50: StickyContactBar is also z-50 and is rendered after the
        header in the root layout, so on equal z-index the later element wins and
        the Call / Start here bar paints on top of the open menu.
      */
      className="fixed inset-0 z-[60] overflow-y-auto bg-surface lg:hidden"
    >
        <div className="flex items-center justify-end px-gutter py-4">
          <button
            type="button"
            onClick={close}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="sr-only">Close menu</span>
            <MenuIcon open />
          </button>
        </div>

        <nav aria-label="Primary" className="px-gutter pb-10">
          <ul className="divide-y divide-border">
            {items.map((item) =>
              isNavGroup(item) ? (
                // Flattened, not nested behind a second tap. There is room on a
                // phone for six more words, and there is no room for a visitor's
                // patience with a menu that hides things inside a menu.
                <li key={item.label} className="py-4">
                  <p className="eyebrow">{item.label}</p>
                  <ul className="mt-3 space-y-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavAnchor
                          link={child}
                          onNavigate={close}
                          className="block text-lg"
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href} className="py-4">
                  <NavAnchor
                    link={item}
                    onNavigate={close}
                    className="block font-display text-2xl"
                  />
                </li>
              ),
            )}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((was) => !was)}
        // 44px minimum target. CLAUDE.md §10.
        className="flex min-h-11 min-w-11 items-center justify-center rounded-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="sr-only">{open ? "Close menu" : "Menu"}</span>
        <MenuIcon open={open} />
      </button>

      {mounted ? createPortal(panelMarkup, document.body) : null}
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
