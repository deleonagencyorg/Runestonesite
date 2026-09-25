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
| Typography | Cinzel (display) + Outfit (sans); reglas §6.2 |

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

Perfil del logo: **capitales romanas modernas** (RUNESTONE: sans de alto contraste, geometría limpia) + **label arquitectónico** (CONSTRUCTION: sans en mayúsculas, tracking amplio, color `--sand`). El sitio replica ese dúo: display inscriptional para títulos de marca; sans geométrica contemporánea para UI y lectura.

#### Families (Google Fonts, self-host en Astro)

| Token | Familia | Rol |
|-------|---------|-----|
| `--font-display` | **Cinzel** (wght 400–700) | Marca, H1–H3, pull quotes, números de proceso |
| `--font-sans` | **Outfit** (wght 300–600) | Body, nav, forms, botones, H4+, captions |
| `--font-mono` | system ui-monospace (opcional) | Solo código/debug; no en marketing |

**Por qué:** Cinzel evoca el corte lapidario/elegante del wordmark sin copiar el glifo R. Outfit aporta modernidad y legibilidad (no Inter/Roboto/Arial).

Fallback stacks:
```css
--font-display: "Cinzel", "Times New Roman", serif;
--font-sans: "Outfit", "Helvetica Neue", sans-serif;
```
(Cinzel es inscriptional con remates mínimos; visualmente alinea al logo mejor que una serif editorial tipo Playfair.)

#### Escala fluida (mobile → desktop)

| Token | Size | Line-height | Letter-spacing | Weight | Familia |
|-------|------|-------------|----------------|--------|---------|
| `--text-display` | `clamp(2.5rem, 6vw, 4.5rem)` | 1.05 | `0.04em` | 600 | display |
| `--text-h1` | `clamp(2rem, 4.5vw, 3.25rem)` | 1.1 | `0.03em` | 600 | display |
| `--text-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | 1.15 | `0.02em` | 600 | display |
| `--text-h3` | `clamp(1.35rem, 2vw, 1.75rem)` | 1.2 | `0.02em` | 500–600 | display |
| `--text-h4` | `1.125rem`–`1.25rem` | 1.3 | `0.01em` | 500 | sans |
| `--text-lead` | `clamp(1.125rem, 1.5vw, 1.35rem)` | 1.5 | `0` | 300–400 | sans |
| `--text-body` | `1rem` (16px) | 1.65 | `0` | 400 | sans |
| `--text-small` | `0.875rem` | 1.5 | `0.01em` | 400 | sans |
| `--text-caption` | `0.75rem` | 1.4 | `0.02em` | 400 | sans |
| `--text-eyebrow` | `0.75rem`–`0.8125rem` | 1.2 | `0.28em` | 500 | sans |
| `--text-button` | `0.8125rem`–`0.875rem` | 1 | `0.14em` | 500–600 | sans |
| `--text-nav` | `0.8125rem` | 1 | `0.12em` | 500 | sans |
| `--text-step-num` | `clamp(3rem, 8vw, 6rem)` | 1 | `0.02em` | 400 | display |

Max width de medida: body/lead **`65ch`**; títulos pueden ir más anchos en hero.

#### Reglas de uso (obligatorias)

**Eyebrow / overline** (`--text-eyebrow`)
- Siempre `text-transform: uppercase`; color `--sand`
- Tracking amplio (como “CONSTRUCTION” del logo)
- Una sola línea corta (“Our Process”, “Southwest Florida”)
- Nunca sustituye a un H1; va **encima** del título de sección

**H1 — página / hero** (`--text-h1` o `--text-display` solo en home hero)
- Familia display; color `--ink` (o `--paper` sobre video)
- Máx. **2 líneas** en desktop; **3** en mobile
- Una sola H1 por página (SEO)
- Hero: brand/logo puede ser imagen; el H1 es el mensaje, no la palabra “Runestone” repetida si el logo ya está

**H2 — sección** (`--text-h2`)
- Una H2 por bloque de sección; tono afirmativo (“Built on Strong Foundations”)
- Si hay eyebrow, la H2 no lleva tracking extremo (el eyebrow ya aporta el gesto logo)

**H3 — subsección / card title** (`--text-h3`)
- Display; nombres de servicio, pasos del proceso, títulos de proyecto en cards
- En process steps: número grande (`--text-step-num`, `--brand-stone` o `--sand`) + H3 del nombre del paso

**H4 — anidado / form groups** (`--text-h4`)
- Sans (no display): más UI que marca
- Usar en formularios, footers densos, listas de valores (Integrity, Quality…)

**Lead / subtítulo** (`--text-lead`)
- Inmediatamente bajo H1/H2; **1–2 frases** máximo
- Weight 300–400; color `--ink` a ~85% o `--stone-muted` oscuro
- No mayúsculas; no tracking amplio

**Párrafo / body** (`--text-body`)
- Outfit 400; color `--ink`
- Espaciado entre párrafos ~`1em`; sin justificado (izquierda)
- En About/Mission: bloques cortos; evitar muros > ~120 palabras seguidas sin subhead

**Small / meta** (`--text-small`)
- Fechas de blog, ubicación de proyecto, “License CGC…”
- Color `--stone-muted`

**Caption** (`--text-caption`)
- Pie de foto / crédito de galería; nunca competir con H3

**Botones y nav** (`--text-button` / `--text-nav`)
- Uppercase + tracking moderado (menos que eyebrow)
- Primario: fondo `--brand-stone`, texto `--paper`
- Secundario/outline: borde `--ink` o `--sand`, texto `--ink`
- Nav: no bold extremo; estado activo con `--brand-stone` o underline sand

**Testimonial quote**
- Cita: display o lead ampliado (`--text-lead`–`--text-h3`); itálica opcional solo en la cita
- Atribución: `--text-small` + nombre en weight 500; rol en `--sand` o muted

#### Prohibiciones tipográficas

- No Inter, Roboto, Open Sans, Arial, system-ui como cara de marca
- No más de **dos familias** de marketing (display + sans)
- No all-caps en párrafos ni en H1 largos (> ~40 caracteres → title case / sentence case)
- No letter-spacing negativo en display
- No mezclar pesos al azar: display usa 500–600; body 300–400; UI 500–600

#### Mapa componente → token

| Superficie | Token tipográfico |
|------------|-------------------|
| Logo wordmark (img) | — (asset); no recrear con CSS salvo fallback texto Cinzel |
| Hero headline | `--text-display` / `--text-h1` |
| Hero support | `--text-lead` |
| Section label | `--text-eyebrow` |
| Section title | `--text-h2` |
| Service / project card title | `--text-h3` |
| Card summary | `--text-small` o `--text-body` |
| Blog post title (list) | `--text-h3` |
| Blog post title (article) | `--text-h1` |
| Article body | `--text-body` (+ H2/H3 display en MD) |
| Form labels | `--text-small`, weight 500 |
| Footer legal | `--text-caption` |

Implementación: tokens en `src/styles/tokens.css`; tipografía aplicada vía clases utilitarias mínimas (`.t-display`, `.t-h1`… `.t-eyebrow`) o atributos en átomos (`Heading`, `Text`) — sin framework CSS pesado.

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
