# jgwre-website

Creative lead generation website for Jasmine Garcia of Stone Realty Group.

Read [CLAUDE.md](CLAUDE.md) before changing anything. It is the source of truth for
scope, brand, and compliance, and §7 is not optional.

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill it in. The lead handler reads
`FUB_API_KEY`, `FUB_ASSIGNED_USER_ID`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`,
and `LEAD_FROM_EMAIL` at request time; none of them are needed to build or to run
the tests. `FUB_ASSIGNED_TO`, `FUB_SYSTEM`, and `FUB_SYSTEM_KEY` are optional and
documented in `.env.example`.

To check which account and user a Follow Up Boss key authenticates as before
putting it anywhere — the API host is `api.followupboss.com` for every account,
never the account's own login subdomain:

```bash
read -rs FUB_API_KEY && curl -sS -u "$FUB_API_KEY:" https://api.followupboss.com/v1/identity | python3 -m json.tool; unset FUB_API_KEY
```

`read -rs` keeps the key off the screen and out of shell history.

## Checks

```bash
npm run verify
```

Lint, typecheck, test, build — the same four steps CI runs on every push and pull
request. Run it before calling any task done.

| Command | What it does |
|---|---|
| `npm run test` | Full suite, once |
| `npm run test:watch` | Watch mode while working |
| `npm run test:coverage` | Coverage over `lib/` and `app/api/` |

`tests/compliance.test.tsx` is the one to know about: it renders every page and
checks the advertising rules in CLAUDE.md §7 — brokerage identification, license
numbers, verbatim TCPA consent, the results disclaimer beside any dollar figure,
and the banned language lists. A violation fails the build rather than reaching
the Broker-in-Charge. See CLAUDE.md §4 for what each suite covers.

## Deploying

Vercel, apex + www. **Do not deploy to the production domain** until the
Broker-in-Charge has approved the site in writing (CLAUDE.md §7).
