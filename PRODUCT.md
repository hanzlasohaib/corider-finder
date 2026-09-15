# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are university students in Pakistan who need to get between campus, hostel, and city landmarks. The product is campus-shaped but not locked to one school: any student with an account can offer or join.

They use it on a phone or laptop, often between classes, when a ride is leaving soon and they need to know pickup, destination, time, seats, and fare in rupees.

## Product Purpose

CoRide Finder lets students offer a ride, browse or search available rides, and join one so travel cost is split. Success is a student finding or publishing a real ride and managing it (join, leave, cancel, complete, delete) without confusion about what happens next.

## Positioning

Peer student rides with a hard two-seat offer cap and a fare per seat, not a taxi dispatch, not a city-wide driver marketplace, and not a social network. Drivers and riders are the same kind of user: a student account.

## Operating Context

Typical loop: sign up or log in, land on the dashboard, offer a ride or find one, confirm the action, then manage it under My rides. Money is PKR. Times are shown in a Pakistan locale. Auth is JWT in the browser. The FastAPI backend already enforces upcoming departure times, at most two seats, and one active ride per user.

## Capabilities and Constraints

Confirmed in the running product:

- Register, log in, protected dashboard
- Offer a ride: pickup, destination, departure time, fare, seats (1-2)
- Browse available rides and search by pickup/destination
- Join, leave, cancel, complete, delete with confirmation
- Overview stats, My rides, Profile
- After join or publish, land on My rides
- Unauthenticated visits to dashboard routes return after login via `?next=`

Confirmed constraints:

- `available_seat` is 1-2 in the API. There is no vehicle-type field. Copy may mention bikes and cars; the product cannot filter by vehicle until the API grows that field.
- One active ride at a time
- No university or phone on the public ride card payload today
- No frontend test suite
- Do not invent testimonials, universities as customers, or safety certifications

Open (this redesign may change UX, not these facts unless we add backend work):

- Whether Offer, Find, and Overview stay as separate routes or merge
- Visual identity (in progress; old mint-green dashboard is not a brand lock)

## Brand Commitments

- Name: CoRide Finder
- Voice: plain student English. Buttons say Log in and Sign up. No hype verbs.
- Mixed vehicles: bikes and cars are both in scope. Keep ride language that students already understand (offer, find, join, seats, fare).
- Pakistan-first: rupees, campus-to-city hops, not a US rideshare clone.
- Inferred from prior work (labeled): previous UI used a mint-green dashboard and car icons; that look is evidence of the old world, not a commitment to keep it.

## Evidence on Hand

- Live app: React (Vite) + Tailwind frontend, FastAPI + PostgreSQL backend
- Real flows and copy in `frontend/src` and API schemas in `backend/app`
- No customer quotes, press, or photography. Future marketing screens must not fabricate social proof.

## Product Principles

1. Show a joinable ride before explaining the brand.
2. Confirm costly actions with route, time, and fare, then put the student on My rides.
3. Keep numbers honest: seats, PKR, departure. Do not invent vehicle filters the API cannot serve.
4. Campus-agnostic: no fake university logos or locked school identity.
5. Familiar affordances on the logged-in app; expression belongs on Home.

## Accessibility & Inclusion

Existing wins to keep: skip link, real page headings, keyboard-closable account menu, focus rings, `prefers-reduced-motion` on page enter, inline form errors. Target WCAG AA contrast on the new palette. Touch targets stay usable on a phone between classes.
