import type { Metadata } from "next";

import { ContactIntake } from "@/components/contact-intake";
import { SocialLinks } from "@/components/social-links";
import { PageHero } from "@/components/page-hero";
import { SmsLine } from "@/components/phone-cta";
import { VideoEmbed } from "@/components/video-embed";
import { Button } from "@/components/ui/button";
import { AGENT, BROKERAGE } from "@/lib/site";
import { videoForRoute } from "@/lib/video";
import { routeMetadata } from "@/lib/seo";

/*
  docs/CONTENT-PLAN.md: "Phone first, large. Form secondary."

  That still holds, and it is why the number sits in the hero above everything
  else. What changed is that the form is no longer only here —
  docs/CONTACT-STRATEGY.md §2 moves the intake onto every page that does the
  persuading, because a visitor who has just read a pillar page should not have to
  navigate anywhere to act. This page is the destination for nav traffic and the
  people who arrive already looking for a way to reach her, not the only door.
*/

export const metadata: Metadata = {
  title: "Contact",
  description: `Call ${AGENT.name}, ${AGENT.title} with ${BROKERAGE.name}, at ${AGENT.phoneDisplay}. Serving Charlotte, the surrounding NC counties, and across the SC line.`,
  ...routeMetadata({ path: "/contact" }),
};

export default function ContactPage() {
  /* Registered in lib/video/data.ts. No VideoObject here — /about is the
     video's canonical home and emits it once. */
  const intro = videoForRoute("/contact");

  return (
    <>
      <PageHero
        eyebrow="Reach her directly"
        title="The number goes to her."
        lede="Not a call center, not an assistant, and not a form that disappears into a queue. Calls and texts both work."
      >
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="phone" size="xl" className="w-full sm:w-auto">
            <a href={AGENT.phoneHref} data-cta-placement="contact-hero">
              <span className="sr-only">Call {AGENT.name} at </span>
              {AGENT.phoneDisplay}
            </a>
          </Button>
          <Button asChild variant="outlineInk" size="xl" className="w-full sm:w-auto">
            <a href="#start" data-cta-placement="contact-hero">Rather not call? Start here</a>
          </Button>
        </div>

        {/*
          The lede above has said "calls and texts both work" since launch, and
          until 2026-08-31 there was no way to send one from anywhere on the
          site. This is the page that makes that sentence true.
        */}
        <SmsLine placement="contact-hero" className="mt-5" />

        {/*
          No stated hours. mackenziesiek.com publishes "Available 7 days a week";
          we don't publish anything we haven't confirmed with her, and an
          availability claim she can't meet is worse than none.
          Tracked in docs/CONTACT-STRATEGY.md §6.
        */}

        {/*
          Inside the hero, under the number — not between the number and the
          form. The page's job is the phone, and this is an argument for dialling
          it rather than a stop on the way to the intake.
        */}
        {intro ? (
          <VideoEmbed video={intro.video} placement={intro.placement} className="mt-14 max-w-2xl" />
        ) : null}
      </PageHero>

      <ContactIntake
        source="/contact"
        heading="Or tell her what you’re working on."
        body="It takes about a minute, and it means the call starts somewhere useful."
        hairline={false}
      />

      <section aria-labelledby="brokerage" className="mx-auto max-w-6xl px-gutter py-section">
        <p className="eyebrow">Brokerage</p>
        <h2 id="brokerage" className="mt-4 font-display text-4xl leading-tight">
          {BROKERAGE.name}
        </h2>
        <address className="mt-6 text-base leading-relaxed not-italic">
          {BROKERAGE.street}
          <br />
          {BROKERAGE.city}, {BROKERAGE.state} {BROKERAGE.zip}
          <p className="mt-4 tabular-nums text-ink-muted">
            {BROKERAGE.licenses.map((l) => `License ${l.state} ${l.number}`).join(" · ")}
          </p>
        </address>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
          {AGENT.name} is a licensed real estate broker affiliated with {BROKERAGE.name}. All real
          estate services are provided through {BROKERAGE.name}.
        </p>

        {/*
          Below the number and below the form, on purpose. Social is where someone
          decides whether they like her; the phone is where they hire her, and
          docs/CONTENT-PLAN.md puts that first. Link only — lib/site.ts SOCIAL.
        */}
        <SocialLinks className="mt-10 text-base leading-relaxed" />
      </section>
    </>
  );
}
