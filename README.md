# Aldermere Hotel — Reservation Site

A Next.js 16 (App Router) + TypeScript conversion of the Aldermere hotel
reservation UI. Front-end only, by design — there is no backend yet, so
"reservations" complete in-memory and are not persisted anywhere (see
**Current limitations** below).

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. On first run, `npm install`/`npm run build` will
fetch the Fraunces and Inter font files from Google Fonts and self-host them
locally (via `next/font/google`) — this needs a normal internet connection
once, at build/install time only. There is no font-related request at runtime.

Other scripts:

```bash
npm run build      # production build
npm run start       # serve the production build
npm run lint         # ESLint (flat config, eslint-config-next)
npm run typecheck  # tsc --noEmit, strict mode
```

## Project structure

```
src/
  app/
    layout.tsx       # fonts, metadata, HTML shell
    page.tsx          # server component entry point
    globals.css        # Tailwind + base resets, reduced-motion support
  components/
    HotelExperience.tsx  # top-level client component, owns booking/UI state
    Header.tsx
    Hero.tsx / DateField.tsx / GuestField.tsx
    RoomsSection.tsx / RoomCard.tsx
    RoomModal.tsx / DetailStep.tsx / FormStep.tsx / ConfirmStep.tsx / Field.tsx
    Footer.tsx
  data/
    rooms.ts           # static room inventory
  lib/
    dates.ts             # date parsing/formatting/night-count helpers
    validation.ts        # form validation + input sanitization
  types/
    room.ts              # shared domain types
```

State (dates, guests, category filter, selected room, modal step, guest
details) lives in `HotelExperience`, the single client component, and flows
down as props. Everything else that can be a server component (`page.tsx`,
`Header`, `Footer`, `RoomsSection`, step components) is one, to keep the
client JS bundle small.

## Security & best-practice choices

- **Security headers** (`next.config.ts`): an explicit, deny-by-default
  Content-Security-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options:
  nosniff`, HSTS, a restrictive `Permissions-Policy`, and `poweredByHeader:
  false` so the framework isn't advertised in responses.
- **Locked-down image sources**: `next/image` is used everywhere (no raw
  `<img>`), and `images.remotePatterns` only allows `images.unsplash.com` —
  nothing else can be requested through the image optimizer.
- **Input handling**: form fields strip control characters as you type
  (`sanitizeOnChange`) and are trimmed/validated on submit
  (`validateGuestForm`) with explicit max lengths, so nothing beyond a
  normal name/email can reach state. These are still client-side checks
  only — see limitations below.
- **Strict TypeScript**: `strict`, `noUncheckedIndexedAccess`, and
  `noImplicitOverride` are all on; the app has zero `any`.
- **Accessible modal**: the reservation dialog uses `role="dialog"` +
  `aria-modal`, traps focus, restores focus to the trigger on close, and
  respects `prefers-reduced-motion`.
- **No secrets in the client**: there's nothing to leak yet, but `.gitignore`
  excludes `.env*` up front so that stays true as a backend is added.

## Current limitations (by design, for this pass)

This was scoped as a **UI-only conversion**, so a few things are worth being
explicit about before this goes anywhere near production:

- **No persistence.** "Confirming" a reservation only updates local React
  state — nothing is saved, and refreshing the page loses it. There's no
  database.
- **No real email.** The confirmation screen's "a confirmation has been sent
  to…" is copy only; no email is actually sent.
- **No payment processing.** Prices are calculated and displayed, but nothing
  charges a card.
- **Client-side validation isn't enough on its own.** If/when a backend is
  added, re-validate and re-sanitize everything server-side — never trust
  what the client sends. The current checks exist to keep the UI honest, not
  to be a security boundary.
- **No rate limiting / bot protection**, since there's no endpoint yet to
  protect.

None of this needs to change for the app to work as delivered — it's meant
as the point where a real backend (database, auth, payments, transactional
email) gets plugged in next.
