import type { Metadata } from "next";

import { AGENT, BROKERAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${AGENT.name} and ${BROKERAGE.name} collect and use information submitted through this site.`,
  robots: { index: true, follow: false },
};

/*
  TODO(legal): this is a working draft, not reviewed counsel language. The
  Broker-in-Charge must approve it before launch, and it must be accurate about
  what Follow Up Boss and Resend actually do with submitted data. CLAUDE.md §7.
*/
export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-gutter py-section">
      <h1 className="font-display text-4xl leading-tight md:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink-muted">Last updated: TODO(verify)</p>

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
            services you request. Submissions are stored in our customer relationship
            manager, Follow Up Boss, and a notification is emailed to {AGENT.name}. We do not
            sell your information.
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
            We use analytics to understand which pages are useful. TODO(verify): confirm the
            exact providers and whether any cookie consent mechanism is required.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Your choices</h2>
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
