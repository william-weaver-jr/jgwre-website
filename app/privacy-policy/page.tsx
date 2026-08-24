import type { Metadata } from "next";

import { AnalyticsOptOut } from "@/components/analytics-opt-out";
import { AGENT, BROKERAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${AGENT.name} and ${BROKERAGE.name} collect and use information submitted through this site.`,
  robots: { index: true, follow: false },
};

/*
  TODO(legal): still a working draft, and still not reviewed counsel language.

  The BIC approved the site on 2026-08-10 (CLAUDE.md §7). That does not close
  this out: a Broker-in-Charge supervises brokerage advertising, and a privacy
  policy is a lawyer's document.

  What this page says about Resend still has to be checked against what that
  vendor actually does with submitted data. The matching check for Follow Up
  Boss is **parked until the CRM is connected** (Bill, 2026-08-24) — there is
  no account, no API key, and nothing has ever been sent there, so reading its
  terms now would be reading them for a configuration nobody has chosen yet.

  "How we use it" named Follow Up Boss until 2026-08-24 and no longer does. The
  sentence was describing where submissions were going to go, while every
  submission was in fact reaching one place: the notification email. A privacy
  policy is the wrong document to be forward-looking in — it is read by someone
  deciding whether to type their phone number in, and it should describe what
  happens to it today.

  Put the vendor back the day the integration is connected. Locked Decision #5
  gates launch on the forms reaching FUB, so that day is before launch, and the
  parked vendor check (CLAUDE.md §7) comes off the lot with it. The sentence to
  restore names the CRM and says a copy of the submission is stored there.

  The consent question this comment used to hold open was decided on 2026-08-24
  (Bill): no banner, a full disclosure, and a reachable opt-out. A GA4 install
  serving one metro, with the advertising features off, is not what a consent
  interstitial exists for. The reasoning and the conditions that would reopen it
  — Google Signals, remarketing, a Google Ads link, or marketing beyond the local
  area — are recorded in lib/analytics-consent.ts, next to the code that would
  have to change. It is practical guidance rather than a formal legal opinion,
  which is worth knowing before anyone treats it as settled forever.

  Everything loaded is named below: GA4 (components/google-analytics.tsx) plus
  Vercel Web Analytics and Speed Insights (components/vercel-analytics.tsx), all
  production only, all covered by the opt-out.
*/

/**
 * Rendered as the page's "Last updated". Bump it whenever the wording below
 * changes — a privacy policy dated earlier than its own text is worse than one
 * with no date at all.
 */
const LAST_UPDATED = "August 24, 2026";

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-gutter py-section">
      <h1 className="font-display text-4xl leading-tight md:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink-muted">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <section>
          <h2 className="font-display text-2xl">Who we are</h2>
          <p className="mt-3">
            This site is operated by {AGENT.name}, a licensed real estate broker affiliated
            with {BROKERAGE.name}, {BROKERAGE.street}, {BROKERAGE.city}, {BROKERAGE.state}{" "}
            {BROKERAGE.zip}. All real estate services are provided through {BROKERAGE.name}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">What we collect</h2>
          <p className="mt-3">
            When you submit a form we collect the name, email address, and phone number you
            provide, along with the page you submitted from and any campaign parameters in
            the link you arrived through. We do not collect financial account information,
            government identification numbers, or payment details anywhere on this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">How we use it</h2>
          <p className="mt-3">
            We use your information to respond to your inquiry and to provide real estate
            services you request. What you submit is emailed to {AGENT.name}, who contacts
            you directly. We do not sell your information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Contact by phone, email, and text</h2>
          <p className="mt-3">
            When you check the consent box on a form, you agree to be contacted by{" "}
            {BROKERAGE.name} via call, email, and text. You can opt out at any time by
            replying &ldquo;stop&rdquo; to a text, using the unsubscribe link in an email, or
            calling {AGENT.phoneDisplay}. Message and data rates may apply, and message
            frequency may vary. Consent is not a condition of any purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Analytics</h2>
          <p className="mt-3">
            We use Google Analytics to record which pages are visited and when someone taps
            a phone number or submits a form, so we can tell what is useful. Google
            Analytics sets cookies in your browser to do this. We also use Vercel Web
            Analytics and Vercel Speed Insights, which count page views and measure how
            quickly pages load for real visitors; these set no cookies and do not identify
            you.
          </p>
          <p className="mt-3">
            We have turned off Google&rsquo;s advertising features — Google Signals and ad
            personalization — so this site does not build advertising audiences or follow
            you across the web, and we do not sell any of it. We also never send your name,
            email address, phone number, or anything you type into a form to any analytics
            service. What we send is which page you were on and which button you tapped.
          </p>
          <p className="mt-3">
            Because of that, this site does not put a cookie banner in front of you. You can
            switch analytics off for this browser at any time under{" "}
            <a href="#privacy-choices" className="underline underline-offset-2">
              Your privacy choices
            </a>{" "}
            below, and you can opt out of Google Analytics across all sites using{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="underline underline-offset-2"
            >
              Google&rsquo;s browser add-on
            </a>
            .
          </p>
        </section>

        <section id="privacy-choices">
          <h2 className="font-display text-2xl">Your privacy choices</h2>
          <p className="mt-3">
            You can switch analytics off for this browser. Nothing else on the site changes,
            and you never have to tell us who you are to do it.
          </p>
          <AnalyticsOptOut />
        </section>

        <section>
          <h2 className="font-display text-2xl">Your choices about your information</h2>
          <p className="mt-3">
            You can ask us to correct or delete the information you submitted by calling{" "}
            {AGENT.phoneDisplay}. Records we are required to retain under North Carolina or
            South Carolina real estate regulations will be kept for the required period.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Fair housing</h2>
          <p className="mt-3">
            {AGENT.name} and {BROKERAGE.name} comply with federal, North Carolina, and South
            Carolina fair housing law. We do not discriminate on the basis of race, color,
            religion, sex, familial status, national origin, disability, or any other
            protected characteristic.
          </p>
        </section>
      </div>
    </article>
  );
}
