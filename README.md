# Oakline Technical Services: website

All pages are built: **Home**, **Services**, **Builds**, **Site Care**, **About**, and **Contact / Fit Check**, plus draft **Privacy** and **Terms** pages. It's plain HTML, CSS, and JavaScript, with no frameworks, packages, or build step.

## Opening it

Double-click `index.html`. It works straight from the folder and offline, because the fonts ship with the site.

To preview it the way it will behave when hosted, you can serve the folder instead:

```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Structure

```
index.html            Home page
css/main.css          Shared: design tokens, fonts, header, footer, buttons, section layout
css/home.css          Home page sections only
services.html         Services page
css/services.css      Services page, plus shared interior-page pieces used by Builds and Site Care
builds.html           Builds page (white-label for agencies, or direct for businesses)
css/builds.css        Builds page sections only
site-care.html        Managed Site Care page
css/site-care.css     Site Care page sections only
about.html            About: founder, working principles, process, comparison
css/about.css         About page sections only
contact.html          Contact / Fit Check wizard
css/contact.css       Fit Check styles
js/fit-check.js       Fit Check wizard (branching, validation, sending)
privacy.html          Privacy notice (DRAFT, needs legal review)
terms.html            Website terms (DRAFT, needs legal review)
css/legal.css         Privacy and Terms styles
404.html              Page-not-found page (uses root paths, so it only looks right when hosted)
robots.txt            Lets search engines crawl the site and points to the sitemap
sitemap.xml           The six main pages (Privacy and Terms join it after legal review)
js/main.js            Shared: mobile menu, header scroll state, footer year (plus reveal and FAQ helpers for later pages)
assets/fonts/         Inter, Inter Tight, JetBrains Mono (variable woff2, SIL Open Font License)
assets/img/           favicon.svg, og-image.png (1200x630 social preview)
```

Every future page reuses `main.css` and `main.js`, and adds its own small CSS file if it needs one.

## Changing the look

All colors, type sizes, spacing and radii are custom properties at the top of `css/main.css` (`:root { ... }`).

- `--oak` is the single accent color, used for focus rings, confirmation checks, and Oakline's "answer" in comparisons.
- `--signal` is used only for "Urgent".

## Connecting the Fit Check

1. Create a free form at [formspree.io](https://formspree.io) and copy its form ID, for example `abcdwxyz`.
2. In `contact.html`, replace `YOUR_FORM_ID` in the form's `action` with that ID.
3. Optional: to show a "Pick a call time" button after someone submits, put a Cal.com or Calendly link in the form's `data-booking-url` attribute.

Until step 2 is done, the wizard tells visitors the form isn't connected and points them to the email address. It never pretends to send.

Buttons across the site pass `?need=urgent`, `?need=backstop`, `?need=review`, `?need=build`, `?need=care` or `?need=hours`, so the wizard opens with the right answer selected. Without JavaScript, the page shows every question as one plain form, and it still submits.

## Audience

Agencies are the lead audience, so the home headline stays agency-led and matches the outreach. The site also welcomes **businesses with one important site** and **teams running many sites**:

- the home label and the "Not an agency?" line;
- "your sites, or your clients' sites" wording;
- the Fit Check's "Which describes you best?" step;
- the Builds page's "Two ways to work".

Agency-only benefits, such as staying client-facing and white-label, are written as benefits *for agencies*, not assumed of every reader. Builds require a finished design from the client or their designer, because Oakline doesn't design from scratch.

## Copy rules

These follow `oakline-copy-strategy.md`:

- **Keep words agencies use themselves:** retainer, white-label, client-facing, staging, QA, handoff, NDA, portfolio, plus the product names.
- **Use "scope" sparingly:** about 12 uses, only where it's precise. Use "project", not "engagement". Use "backstop" only in the headline, the footer tagline and the product name.
- **No business-plan or operator wording:** no capacity models, eligibility, approved hosting, intake records or go/no-go.
- **Say what the buyer gets, not how we run things internally.**

## What the home page holds

The page is kept short on purpose. It has four parts:

1. **Hero with the "What do you need handled?" panel.**
2. **Services**, as a compact list linking to Services, Builds and Site Care, plus a "Not an agency?" line.
3. **Credibility**, as a founder-led statement plus a *sample* closeout report. It's clearly labelled as an illustrative example.
4. **Closing Fit Check call to action.**

The detail lives on the other pages:

- The coverage list, the comparison with alternatives, and the FAQ go to **Services**.
- The six-step process goes to **About**.
- "Good fit / not a fit" goes to the **Fit Check**.

The founder is shown by first name only (**Uriel**). The copy is founder-led but not a one-person shop: Uriel appears as founder, while the work is described as "we" and "senior engineering" (a standard, not a headcount) so the site still fits as the team grows. The years of experience (10+) and the bio are still placeholders to confirm. To edit them, or add a photo, search for `FOUNDER` in `index.html` and `about.html`.

## Deliberately not on this page

- **Prices.** These live on Services, shown as "Starting at". There are no hour counts, upper limits or discounts.
- **Senior Hours.** This is the one exception to "starting at": a flat $200/hour, bought in whole hours (1-hour minimum) and paid upfront. It's sold as a fixed unit, not a timesheet, so there are no partial hours or after-the-fact invoices. Anything bigger than a few hours moves to a sprint or Backstop. It appears on Services (`#hours`), in the footer, in the Fit Check, and as the route for out-of-scope work on Site Care and Builds. It deliberately stays off the home page and the main menu.
- **Formation jurisdiction, contractor model, internal hour capacities, and SEO ranking promises.** These are excluded per the business plan's public-messaging guardrails.
- **Testimonials, logos, or case studies.** Nothing fabricated. Proof can be added once it's real.

## Before going live

- Point the canonical URL and the `og:image` URLs at the live domain. They're already set to `https://oaklinetech.net/`.
- Connect the Fit Check (see above) and send yourself a test submission.
- Have `privacy.html` and `terms.html` reviewed, then remove their draft notice and `noindex` tag.
- Confirm the founder's years of experience and bio, and add a photo (search for `FOUNDER`).
- Host it on any static host (Netlify, Cloudflare Pages, GitHub Pages and similar). Upload the folder as is; most hosts use `404.html` automatically.
- After legal review, add `privacy.html` and `terms.html` to `sitemap.xml`.

## Checks already done

- All pages pass HTML validation. Every internal link and anchor resolves.
- An axe-core accessibility scan at desktop and phone widths found 0 issues. This covers the open mobile menu, open FAQs, and Fit Check steps with an error showing.
- Navigation, footer, titles, canonical URLs, and share text are consistent across pages, and prices match everywhere they appear.
