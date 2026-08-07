import { z } from "zod";

/**
 * Every lead form on the site posts this shape to /api/lead.
 *
 * `website` is a honeypot — a hidden field real users never fill in. Bots do.
 * See CLAUDE.md §9.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(40),
  message: z.string().trim().max(2000).optional(),

  /** Which page the lead came from, e.g. "/new-construction". */
  source: z.string().trim().max(120),
  leadType: z.enum(["buyer", "seller", "valuation", "guide", "relocation", "general"]),

  /** TCPA consent. Must be explicitly true — never pre-checked in the UI. */
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to submit this form." }),
  }),

  utm: z
    .object({
      source: z.string().max(120).optional(),
      medium: z.string().max(120).optional(),
      campaign: z.string().max(120).optional(),
      term: z.string().max(120).optional(),
      content: z.string().max(120).optional(),
    })
    .optional(),

  /** Honeypot. Must be empty. */
  website: z.string().max(0).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
