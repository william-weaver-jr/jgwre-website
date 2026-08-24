import Script from "next/script";

import { ANALYTICS_OPT_OUT_KEY } from "@/lib/analytics-consent";

/*
  A missing measurement ID renders nothing, which is the right behaviour and
  also the reason this file warns.

  NEXT_PUBLIC_* values are inlined at build time, so "the tag is configured"
  is decided when the build runs, not when a visitor loads the page. A build
  that never saw the variable produces a page that is byte-for-byte a page
  with analytics deliberately switched off. Nothing on the site can tell you
  which one you deployed, and it cost several deploys to find that out by
  diffing HTML sizes. So the absence is announced in the build log instead,
  where the answer is cheap to read.

  Module scope on purpose: this fires once per build worker rather than once
  per prerendered page, so it stays a few lines in the log and not two dozen.
*/
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

if (process.env.NODE_ENV === "production" && !MEASUREMENT_ID) {
  console.warn(
    "[analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set for this build. " +
      "No GA4 tag will be rendered on any page.",
  );
}

/**
 * GA4 tag, mounted once in the root layout so every page inherits it — current
 * pages and any added later. Production only, so local dev and CI never report
 * into the real property. Measurement ID comes from env, never hardcoded, so a
 * fork or a staging host cannot silently write into her live data.
 *
 * Two things the config below does on purpose, both from the 2026-08-24 privacy
 * decision recorded in lib/analytics-consent.ts:
 *
 * - Google Signals and ad personalization are switched off explicitly rather
 *   than left to the account default. They are what turns a plain measurement
 *   install into an advertising one, and they are the trigger that would make a
 *   consent banner advisable. Off in code means turning one on is a diff someone
 *   reviews, not a checkbox in a console nobody is watching.
 *
 *   The property-level toggle is the other half and it wins independently of
 *   this config: Google Signals is **confirmed off in the GA4 property itself**
 *   (Bill, 2026-08-24). Nothing in this repo can see or assert that, so if it is
 *   ever switched on in the console, this comment is the only thing that will
 *   look wrong — and the consent decision it supports is the thing that would
 *   actually be wrong.
 * - The opt-out is applied before the first hit. gtag.js reads `ga-disable-<id>`
 *   on every hit, and setting it inline — ahead of `config` — is the only way a
 *   returning visitor who opted out is never measured, not even on the page
 *   where they land.
 *
 * What is never sent is enforced elsewhere: lib/analytics.ts carries the event
 * shim, its call sites pass step numbers and page slugs, and a test asserts no
 * name, email, phone, or message ever becomes an event parameter.
 *
 * See .env.example and CLAUDE.md §4.
 */
export function GoogleAnalytics() {
  if (!MEASUREMENT_ID || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          try {
            if (window.localStorage.getItem('${ANALYTICS_OPT_OUT_KEY}') === '1') {
              window['ga-disable-${MEASUREMENT_ID}'] = true;
            }
          } catch (e) {}
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}
