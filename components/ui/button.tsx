import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Ported from the Lovable draft. Three variants carry the brand:
 *
 * - `phone`   — the primary CTA everywhere. Solid navy, tabular figures so the
 *               number reads as a number. CLAUDE.md Locked Decision #4 makes the
 *               phone the main conversion path, so it gets the only solid fill.
 * - `outlineInk` — secondary. Champagne hairline, no fill.
 * - `gold`    — tertiary. Gold hairline that fills on hover. Used sparingly;
 *               antique gold is never a resting fill. See docs/brand-decisions.md.
 */
const buttonVariants = cva(
  // No `whitespace-nowrap` and no fixed heights: "The 19 Things Besides Price You
  // Can Negotiate" is a real label, and nowrap forced 438px of horizontal overflow
  // at 375px. Sizes set a minimum height and let the box grow when text wraps.
  "inline-flex items-center justify-center gap-2 rounded-sm text-center font-sans font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-deep active:bg-primary-deep",
        /*
          `whitespace-nowrap` here and nowhere else, and the distinction is the
          point. It was removed from the base class because a real secondary
          label — "The 19 Things Besides Price You Can Negotiate" — forced 438px
          of horizontal overflow at 375px when it could not wrap.

          This variant only ever contains a phone number. Left to wrap, it did:
          in the home page hero the button sits in a flex row beside that same
          long label, lost the shrink contest, and broke "(704) 200-9360" across
          two lines — rendering 76px tall against 56px for the identical button
          in the closing section. A phone number split over two lines reads as a
          rendering fault in the most prominent CTA on the site.
        */
        phone:
          "bg-primary text-primary-foreground whitespace-nowrap tabular-nums hover:bg-primary-deep active:bg-primary-deep",
        outlineInk:
          "border border-accent-soft bg-transparent text-ink hover:border-accent hover:bg-surface-sunken",
        gold: "border border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground",
        ghost: "text-ink hover:bg-surface-sunken",
        link: "text-accent underline decoration-accent-soft underline-offset-4 hover:decoration-accent",
      },
      size: {
        default: "min-h-11 px-5 py-2.5 text-sm",
        sm: "min-h-9 px-3 py-2 text-sm",
        lg: "min-h-13 px-7 py-3 text-base",
        xl: "min-h-14 px-8 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
