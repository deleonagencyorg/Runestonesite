# Runestone Construction — Website Design Spec

**Date:** 2026-09-21  
**Status:** Approved for planning (pending user review of this file)  
**Company:** Runestone Construction Corp.  
**Approach:** Astro SSG + Preact islands + GSAP/ScrollTrigger video scrub (cinematic process)

---

## 1. Purpose & success criteria

Build a lead-generation marketing site for a Southwest Florida general contractor. Primary conversions are **equal-weight dual CTAs**: phone call (`239-440-8666`) and project inquiry form. Success means: clear service narrative, strong local SEO/GEO signals, fast LCP despite cinematic process section, and a typed leads client ready for a future API.

**Out of scope (v1):** Spanish copy, city landing pages, real project/video assets (stock + placeholders), live leads API backend, CMS admin UI.

---

## 2. Decisions locked

| Topic | Decision |
|-------|----------|
| Conversion | Dual CTAs everywhere (Call + Form) |
| Audience | Balanced across all four services |
| Language | EN live at `/`; `/es` shell ready; ES copy phase 2 |
| MVP pages | Home, About, Services, Contact, Blog list/post, Projects list/detail |
| Islands | Preact (LeadForm; optional gallery lightbox) |
| Lead fields | Full set C (see §7) |
| GEO | Schema + copy for 9 cities; no city pages |
| Media | Stock video/images + MD placeholders; swap-ready paths |
| Host | Vercel (static Astro); `vercel-optimize` after traffic exists |
| Motion | Approach 2: GSAP + ScrollTrigger + video scrub on desktop process |

---

## 3. Architecture

### 3.1 Stack

- **Astro 5** — static site generation, Content Collections
- **Preact** — interactive islands only
- **GSAP + ScrollTrigger** — process scrub (and light hero motion if useful)
- **i18n** — routing `/` (en) and `/es` (es); library wired; EN content first
- **Vercel** — deploy static output; env `PUBLIC_LEADS_API_URL` for form POST

### 3.2 Folder layout

```
src/
  components/     # atoms → molecules → organisms
  layouts/
  pages/          # EN routes + es/ mirror
  content/
    blog/
    projects/
  styles/         # design tokens
  lib/            # seo, schema, leads client, i18n helpers
public/
  media/          # video + images (stock; replace in place)
```

### 3.3 Content sources

- **Blog:** Markdown files in `src/content/blog/*.md` (Astro Content Collection). Public URLs: `/blog/` and `/blog/[slug]`. Example file: `src/content/blog/articulo.md` → `/blog/articulo`.
- **Projects:** Markdown in `src/content/projects/*.md` with gallery + optional testimonial frontmatter. URLs: `/projects/` and `/projects/[slug]`.
- No headless CMS in v1.

### 3.4 Performance & motion guardrails

- Desktop process: pin + video `currentTime` scrub via ScrollTrigger
- Mobile: vertical timeline; **no** video scrub
- `prefers-reduced-motion`: static timeline, no scrub
- Video: muted, `playsinline`, `preload="metadata"`; poster image required
- If video fails to load: image-per-step fallback
- GSAP loaded only on routes that need it (home process), not globally if avoidable

---

## 4. Information architecture & pages

### 4.1 Routes (EN)

| Path | Content |
|------|---------|
| `/` | Hero → Process scrub → Services → Why → Projects strip → Testimonials → Final CTA |
| `/about` | Who we are, mission, vision, values (“Built on Strong Foundations”) |
| `/services` | Four equal service sections + dual CTA |
| `/projects` | Project grid from collection |
| `/projects/[slug]` | Case study: summary, gallery, optional testimonial, CTA |
| `/blog` | Post list |
| `/blog/[slug]` | Article |
| `/contact` | Full lead form + phone + emails + license `CGC1540643` |

`/es/*` mirrors the same routes with i18n keys; English strings as interim fallback until ES copy arrives.

### 4.2 Home section intent

1. **Hero** — Full-bleed construction video/atmosphere; brand-forward wordmark; one headline; one supporting line; dual CTAs. No stats strip, no cards in hero.
2. **Process** — Eight steps (consultation → delivery); cinematic scrub on desktop; vertical on mobile.
3. **Services** — Custom Residential, Multifamily, Commercial, Construction Management (equal weight).
4. **Why Runestone** — Partner narrative; closing line: “One Project. One Team. One Standard.”
5. **Projects** — 3–6 featured cards from MD.
6. **Testimonials** — Prefer quotes linked to project frontmatter.
7. **CTA** — Short path to form and/or `/contact` + phone; optional sticky call bar on mobile.

### 4.3 Process steps (canonical copy source)

01 Consultation & Project Discovery  
02 Site Evaluation & Feasibility  
03 Design & Pre-Construction  
04 Permitting & Approvals  
05 Construction  
06 Quality Control & Inspections  
07 Final Walkthrough & Completion  
08 Project Delivery  

Full descriptions live in site copy modules derived from client brief (not duplicated at length here).

---

## 5. Company content (source of truth)

- **Name:** Runestone Construction Corp.  
- **Type:** General Contractor  
- **Area:** Southwest Florida  
- **Phone:** 239-440-8666  
- **Email:** Runestoneconstructioncorp@gmail.com; Alejandro.Perez@Runestonehomes.com; Alejandro.Perez@Runestonedevelopment.com  
- **License:** Florida CGC1540643  
- **Services:** Custom Residential · Multifamily · Commercial · Construction Management  

Mission, vision, values, about, and service blurbs: use client-provided English text verbatim (light editorial polish only for web length/SEO headings).

### 5.1 GEO cities (`areaServed`)

Naples, Fort Myers, Cape Coral, Estero, Bonita Springs, Marco Island, Punta Gorda, Port Charlotte, Immokalee — via JSON-LD and natural copy only (no `/service-areas/*` pages).

---

## 6. Design system

### 6.1 Color tokens (from logo)

| Token | Role |
|-------|------|
| `--brand-stone` | Deep red/maroon — primary accent, primary buttons, symbol |
| `--ink` | Black — headlines and body |
| `--sand` | Light golden-brown/tan — secondary labels, dividers, “CONSTRUCTION” tone |
| `--paper` | White / warm off-white — surfaces |
| `--stone-muted` | Warm gray — borders, captions |

Avoid generic AI palettes (purple gradients, cream+terracotta clichés, glow stacks).

### 6.2 Typography

- **Display/brand:** elegant serif (wordmark-adjacent)  
- **UI/body:** clean sans (not Inter/Roboto/Arial/system default stacks as the brand face)  
- Hierarchy: brand > one headline > one support line in first viewport  

### 6.3 Motion & atmosphere

- Subtle stone texture / material cues where they reinforce brand  
- Intentional scroll presence on process (desktop); restraint elsewhere  
- Respect reduced-motion  

### 6.4 Component layers

**Atoms:** Button, Link, Input, Textarea, Select, Label, Badge, Icon, Divider  

**Molecules:** Field, CtaGroup, ServiceCard, ProjectCard, TestimonialQuote, ProcessStep  

**Organisms:** Header, Footer, LeadForm, ProcessScrub, ProjectGallery, SeoHead  

Only build components consumed by MVP pages.

---

## 7. Lead form & API readiness

### 7.1 Fields

| Field | Required |
|-------|----------|
| name | yes |
| email | yes |
| phone | yes |
| company | no |
| projectType | yes (`residential` \| `multifamily` \| `commercial` \| `construction-management` \| `other`) |
| location | no |
| budgetRange | no |
| timeline | no |
| preferredContact | yes (`phone` \| `email` \| `either`) |
| message | yes |
| consent | yes (`true`) |

### 7.2 Client metadata (always sent)

- `source` — path + UTM params  
- `locale` — `en` \| `es`  

### 7.3 Transport

- Preact island `POST`s JSON to `import.meta.env.PUBLIC_LEADS_API_URL`
- Missing URL: success-path mock (no throw); visible “configured later” only in dev if needed
- States: idle | submitting | success | error
- Honeypot field for basic bot filtering
- No secrets in client; future Vercel serverless proxy is phase 2 if API needs private keys

---

## 8. Projects & blog content model

### 8.1 Project frontmatter

```yaml
title: string
slug: string
type: residential | multifamily | commercial | construction-management
location: string
year: number
cover: string          # path under public/media
gallery: string[]
summary: string
featured: boolean      # home strip
testimonial:
  quote: string
  author: string
  role: string
```

### 8.2 Blog frontmatter

```yaml
title: string
slug: string
description: string
pubDate: date
updatedDate: date?
heroImage: string?
draft: boolean?
tags: string[]
```

Body: Markdown. SEO title/description from frontmatter; Article JSON-LD on post pages.

---

## 9. SEO / GEO checklist

- Unique title + meta description per route  
- Canonical URLs; Open Graph + Twitter cards  
- `sitemap.xml`, `robots.txt`  
- JSON-LD `LocalBusiness` / contractor-appropriate type with phone, email, license mention in content, `areaServed` cities  
- Semantic landmarks, heading order, image `alt`  
- Fast static HTML; defer non-critical JS (GSAP, form island)  
- Optional lightweight `llms.txt` for GEO/AI discovery  

---

## 10. UX for leads (practices applied)

- Dual CTAs repeated at hero, after process, after services, footer  
- Form friction: **full LeadForm** on `/contact` and again in the home final CTA section (`#lead-form`); hero secondary CTA scrolls to `#lead-form` (same page) or links to `/contact` when not on home  
- Phone always `tel:` clickable; sticky call affordance on small screens  
- Clear success/error feedback; no dead ends after submit  
- Trust: license number, service area, process transparency, project proof when available  

Visual references (inspiration, not clones): NRG “build your data center” scroll storytelling; Emarat-style elegant real-estate lead calm.

---

## 11. Testing (ponytail-minimal)

- One small check that lead payload shape validates (unit or assert script)  
- Manual: home scrub desktop, timeline mobile, reduced-motion, form mock submit, blog/project MD render  
- Lighthouse pass targets: no major a11y/SEO fails on home and contact  

---

## 12. Implementation phases

1. Scaffold Astro + tokens + layouts + i18n routing shell  
2. Content collections + placeholder MD (blog + projects)  
3. Static pages + atomic components + SEO/schema  
4. LeadForm island + env contract  
5. ProcessScrub (GSAP) + mobile/reduced-motion fallbacks  
6. Polish CTAs, sticky call, stock media paths  
7. Deploy Vercel; later: ES copy, real media, live API, `vercel-optimize`  

---

## 13. Non-goals / explicit cuts

- No city microsites  
- No CMS  
- No Solid (Preact only)  
- No heavy scrub on mobile  
- No inventing project/testimonial facts — placeholders clearly marked until client assets arrive  

---

## Approval

Design dialogue sections 1–3 approved in chat. This document is the written spec for implementation planning after user file review.
