import Script from "next/script";

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
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
