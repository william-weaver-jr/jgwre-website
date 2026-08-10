import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactIntake } from "./contact-intake";
import { TCPA_CONSENT } from "@/lib/site";

/**
 * The intake is the site's only conversion path, and two of its properties are
 * compliance rules rather than UX preferences: the consent box is never
 * pre-checked and the consent text is never reworded (CLAUDE.md §7).
 *
 * The rest of this suite covers the thing a stepped form actually risks — a
 * visitor who wanted to send a message getting stuck behind the qualifying
 * questions. docs/CONTACT-STRATEGY.md §4.
 */

const props = {
  source: "/contact",
  heading: "Tell me where you are.",
  body: "Three steps.",
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function fillContactStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Dana Ruiz");
  await user.type(screen.getByLabelText("Email"), "dana@example.com");
  await user.type(screen.getByLabelText("Phone"), "704-555-0100");
  await user.click(screen.getByRole("checkbox", { name: new RegExp(TCPA_CONSENT.slice(0, 40)) }));
}

function payload() {
  return JSON.parse(fetchMock.mock.calls[0][1].body as string);
}

describe("step 1", () => {
  it("asks which side of the table first, and for nothing personal", () => {
    render(<ContactIntake {...props} />);

    expect(screen.getByText("Which side of the table are you on?")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("announces the step count", () => {
    render(<ContactIntake {...props} />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("advances to the matching branch on one tap", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);

    await user.click(screen.getByRole("radio", { name: /Listing a home you own/ }));

    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("Where is the home?")).toBeInTheDocument();
    expect(screen.getByText("Have you had it valued?")).toBeInTheDocument();
  });

  it("starts at step 2 when the page already knows the side", () => {
    render(<ContactIntake {...props} prefill={{ side: "relocating" }} />);

    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("Where are you moving from?")).toBeInTheDocument();
  });
});

describe("step 2", () => {
  it("lets a visitor skip every question and continue", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);

    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("accumulates a multi-select rather than replacing the answer", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);

    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("checkbox", { name: /South Charlotte/ }));
    await user.click(screen.getByRole("checkbox", { name: /The NC\/SC border/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(payload().intake.markets).toEqual(["south-charlotte", "carolinas-border"]);
  });

  it("removes a deselected option", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);

    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    const option = screen.getByRole("checkbox", { name: /South Charlotte/ });
    await user.click(option);
    await user.click(option);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(payload().intake).toBeUndefined();
  });

  it("clears earlier answers when the visitor goes back and changes side", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);

    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("checkbox", { name: /South Charlotte/ }));
    await user.click(screen.getByRole("button", { name: /Start over|Back/ }));
    await user.click(screen.getByRole("radio", { name: /Listing a home you own/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(payload().intake).toBeUndefined();
    expect(payload().side).toBe("selling");
  });
});

describe("TCPA consent (§7)", () => {
  it("renders the approved wording verbatim", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);
    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText(new RegExp(TCPA_CONSENT.slice(0, 60)))).toBeInTheDocument();
  });

  it("is never pre-checked", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);
    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    const consent = screen.getByRole("checkbox", { name: new RegExp(TCPA_CONSENT.slice(0, 40)) });
    expect(consent).not.toBeChecked();
    expect(consent).toBeRequired();
  });

  it("links the privacy policy beside it", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);
    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
  });
});

describe("submission", () => {
  it("posts the whole lead to the single handler", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);

    await user.click(screen.getByRole("radio", { name: /Buying/ }));
    await user.click(screen.getByRole("radio", { name: "New construction" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/lead", expect.anything()));
    expect(payload()).toMatchObject({
      name: "Dana Ruiz",
      email: "dana@example.com",
      phone: "704-555-0100",
      source: "/contact",
      leadType: "buyer",
      side: "buying",
      intake: { propertyType: "new-construction" },
      consent: true,
    });
  });

  it("derives the lead type from the side chosen", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "relocating" }} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(payload().leadType).toBe("relocation");
  });

  it("honours a page-level lead type override", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} leadType="guide" prefill={{ side: "buying" }} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(payload().leadType).toBe("guide");
  });

  it("sends the honeypot empty when a real person fills the form", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(payload().website).toBe("");
  });

  it("shows the confirmation with questions worth asking, never a promise", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    await screen.findByText(/Here’s what I’d be asking about/);
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });
});

describe("when submission fails", () => {
  it("surfaces the server's message and keeps the form on screen", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, error: "Too many submissions. Please try again shortly." }),
    });

    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Too many submissions");
    expect(screen.getByLabelText("Name")).toHaveValue("Dana Ruiz");
  });

  it("falls back to the phone number when the request never lands", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));

    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);
    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("(704) 200-9360");
  });

  it("lets the visitor retry after a failure", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));

    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await fillContactStep(user);

    const submit = screen.getByRole("button", { name: "Send this to Jasmine" });
    await user.click(submit);
    await screen.findByRole("alert");

    await user.click(screen.getByRole("button", { name: "Send this to Jasmine" }));
    await screen.findByText(/Here’s what I’d be asking about/);
  });
});

describe("accessibility (§10)", () => {
  it("labels every field rather than relying on placeholders", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);
    await user.click(screen.getByRole("button", { name: "Continue" }));

    for (const field of screen.getAllByRole("textbox")) {
      expect(field).toHaveAccessibleName();
      expect(field).not.toHaveAttribute("placeholder");
    }
  });

  it("groups the step 1 options in a labelled fieldset", () => {
    render(<ContactIntake {...props} />);
    const group = screen.getByRole("group", { name: "Which side of the table are you on?" });
    expect(within(group).getAllByRole("radio")).toHaveLength(5);
  });

  it("uses real radios and checkboxes, not buttons with ARIA", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} />);
    await user.click(screen.getByRole("radio", { name: /Buying/ }));

    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /South Charlotte/ })).not.toBeInTheDocument();
  });

  it("announces the step count politely", () => {
    render(<ContactIntake {...props} />);
    expect(screen.getByText("Step 1 of 3")).toHaveAttribute("aria-live", "polite");
  });

  it("offers the phone number as an alternative to the form", async () => {
    const user = userEvent.setup();
    render(<ContactIntake {...props} prefill={{ side: "buying" }} />);
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("link", { name: /Call Jasmine Garcia at/ })).toHaveAttribute(
      "href",
      "tel:+17042009360",
    );
  });
});
