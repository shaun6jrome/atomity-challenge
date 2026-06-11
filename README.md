# Atomity Cost Explorer

An animated interpretation of **Option A** from the Atomity frontend
engineering challenge. The experience turns the reference chart into a
progressive cost investigation: users can move from cluster to namespace to
pod while the chart and cost table remain synchronized.

## Why Option A

The cluster chart offered the strongest opportunity to combine product
thinking with interaction design. Instead of treating the bars as a static
visualization, this version makes every bar a doorway into the next level of
infrastructure detail.

## Experience

- Scroll-triggered entrance for the complete explorer
- Animated cost bars with staggered, eased growth
- Cluster → namespace → pod drill-down
- Matching CPU, RAM, storage, network, GPU, efficiency, and total metrics
- Loading, error, retry, and success states
- Keyboard-accessible chart controls
- Responsive overflow behavior for dense data on mobile
- Reduced-motion support

## Data And Caching

The explorer fetches product data from
[DummyJSON](https://dummyjson.com/products), then transforms the response into
a deterministic cloud-resource hierarchy. Product categories become clusters,
brands become namespaces, and products become pods. Numeric API fields are
used to derive the displayed cost dimensions.

TanStack Query caches the transformed hierarchy for 10 minutes, retains it for
30 minutes, disables unnecessary window-focus refetches, and retries a failed
request once. Returning to the section or navigating through the hierarchy
does not create redundant network requests.

## Animation Approach

Framer Motion handles the section reveal, chart transitions, staggered bars,
hover feedback, and drill-down crossfades. Motion uses restrained easing and
short durations so the data remains readable. `useReducedMotion` and the
`prefers-reduced-motion` media query simplify or remove movement when requested
by the operating system.

## Tokens And Styling

Color, surface, border, glow, shadow, and typography values are defined through CSS custom 
properties in src/app/globals.css and referenced throughout the application via semantic CSS variables.

Tailwind CSS is used for composition, while modern CSS provides:

- Native CSS nesting
- Container queries
- `:has()` parent-aware styling
- `color-mix()` accents
- Logical properties
- `clamp()` fluid sizing

No prebuilt UI component library or template is used.

Structure

src/
  app/
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
  components/
    CostTable.tsx
    Hero.tsx
    ResourceChart.tsx
    ResourceDiscovery.tsx
  hooks/
    useCloudResources.ts
  libs/
    api.ts

## Libraries

- **Next.js + React + TypeScript** for the application
- **Framer Motion** for interaction and scroll animation
- **TanStack Query** for request state and caching
- **Tailwind CSS** for layout and component styling

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is already in
use, Next.js automatically selects the next available port.

Validation commands:

```bash
npm run lint
npm run build
```

## Deployment

The project is ready for Vercel deployment with the default Next.js settings.
Connect this repository in Vercel and deploy the `main` branch.

## Submission Checklist

- GitHub repository: available
- Live demo URL: still needs to be created in Vercel, Netlify, or Cloudflare Pages
- README coverage: complete

## Tradeoffs

- The public API is intentionally mapped into cloud-cost language because it
  does not expose real infrastructure telemetry.
- Dense cost tables use horizontal scrolling at narrow widths so labels and
  numeric comparisons stay legible instead of collapsing into cards.
- The challenge focuses on one polished feature rather than expanding into a
  complete dashboard.

## With More Time

- Persist the selected hierarchy in the URL for shareable investigations
- Add light-mode controls using the existing token foundation
- Add component tests for hierarchy navigation and API failure recovery
- Replace the transformed public dataset with real cloud billing telemetry
