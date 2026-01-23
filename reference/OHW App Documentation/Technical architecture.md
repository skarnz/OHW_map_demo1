# OHW Weight‑Management App — Technical Architecture

*Version 0.1 – 29 Jun 2025*

---

## 1. Goals

* **Unified experience**: mobile‑first app for patients; browser dashboard for providers.  
* **Compliance**: HIPAA/PHI handling, SOC 2 hosting, audit logging.  
* **Scalability**: edge‑deployed web, horizontally scalable Postgres, serverless functions.  
* **Future‑proofing**: straightforward path to integrate AI services (embeddings, LLM inference) without re‑architecting.

---

## 2. High‑Level Diagram

```
                       +---------------------------+
                       |        Front‑Ends         |
                       |---------------------------|
                       |  Expo RN App  (patients)  |
                       |  Next.js 15  (providers)  |
                       +-------------+-------------+
                                     |
                                     v
 +-------------------------+-------------------------+
 |           Shared Workspace Packages               |
 |---------------------------------------------------|
 |  packages/ui    • Tamagui + NativeWind (UI)        |
 |  packages/auth  • Supabase auth hooks              |
 |  packages/utils • Domain utilities                 |
 |  packages/db    • Drizzle SQL + types              |
 +-----------+--------------+--------------+----------+
             |              |              |
             v              v              v
 +-----------+--------------+--------------+----------+
 |                  Core Services                     |
 |---------------------------------------------------|
 |  Supabase  • Postgres + RLS + Auth + Storage       |
 |            • Edge Functions (Deno)                 |
 +-----------+--------------+--------------+----------+
             |                              |
             |                              v
             |            +--------------------------------+
             |            |  Cloudflare Pages + Workers    |
             |            |  • Web hosting (Next.js)       |
             |            |  • Global CDN & TLS            |
             |            |  • AI services (Workers AI)    |
             |            +--------------------------------+
             |
             v
 +-----------------------------------------------+
 |        Expo EAS Build & OTA Updates            |
 +-----------------------------------------------+
```

*Data‑flow highlights*

* **Expo** & **Next** import UI, auth hooks, utils, and DB types directly.  
* Both front‑ends call **Supabase Auth & Storage** via the Supabase JS client.  
* **Auth & Storage** enforces Row‑Level Security rules on **Postgres**.  
* Custom logic (audit logging, AI scoring) runs in **Edge Functions** which also connect to Postgres.

---

## 3. Repository Layout (Turborepo)

```
my‑ohw/
├ apps/
│  ├ expo/          # patients (Expo SDK 50)
│  └ next/          # providers (Next.js 15 + RSC)
├ packages/
│  ├ ui/            # Tamagui primitives + NativeWind presets
│  ├ auth/          # Supabase hooks/contexts
│  ├ utils/         # business‑logic TS utils
│  └ db/            # Drizzle SQL migrations + generated types
└ turbo.json        # task graph + caching rules
```

---

## 4. Frontend Stack

| Layer | Mobile (patients) | Web (providers) |
| :---- | :---- | :---- |
| Framework | **Expo SDK 50** (React‑Native) | **Next.js 15** (React‑Server Components) |
| UI kit | *Tamagui* primitives \+ **NativeWind** Tailwind utilities | Same Tamagui primitives via `react‑native‑web`; **shadcn/ui** for desktop‑only widgets |
| Routing | Expo Router v3 | App Router (file‑system) |
| State & Data | Supabase hooks; React Query for offline cache | Supabase \+ Server Actions; React Query |
| Auth UX | Email/OAuth, Sign‑in‑with‑Apple (native) | Supabase Auth UI, Magic Link |
| OTA Updates | EAS Update | Instant deploy via Cloudflare Pages |

---

## 5. Backend / Infra

| Component | Provider | Notes |
| :---- | :---- | :---- |
| **Database** | Supabase Postgres 16 | Row‑Level Security; `pgAudit` enabled |
| **Auth** | Supabase Auth | JWT cookies for web; secure‑store on mobile |
| **File Storage** | Supabase Storage | S3‑compatible; signed URLs |
| **Edge Functions** | Supabase Edge Functions (Deno) | Custom BMI AI scoring, audit hooks |
| **Web Hosting** | **Cloudflare Pages \+ Workers** | Supports Next 15 ISR & RSC; geo‑local latency |
| **Mobile Build** | Expo EAS (iOS/Android) | Store binaries \+ OTA |
| **CDN / TLS** | Cloudflare | HIPAA BA addendum available |

---

## 6. CI/CD Pipeline

The **starter repo itself** ships with lint‑and‑test \+ Turbo cache workflows **only**. We’ve planned two additional jobs (Cloudflare deploy & EAS build) that we’ll add in our fork.

| Stage | Template provides? | Added in our fork | Details |
| :---- | :---- | :---- | :---- |
| Lint/Test | ✅ | — | ESLint, Prettier, Jest, Playwright |
| Turbo cache | ✅ | — | Intelligent rebuilds |
| **EAS mobile build** | ❌ | ✅ | `expo publish` \+ EAS Cloud build matrix |
| **Cloudflare Pages deploy** | ❌ | ✅ | `wrangler pages deploy` job |
| DB migrations | ❌ | ✅ | `pnpm db:deploy` after web deploy |

Workflow sketch (in **our** `ohw-monorepo/.github/workflows/ci.yml`):

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]
  build-mobile:
    needs: test
    if: github.ref == 'refs/heads/prod'
    uses: expo/expo-github-action@v8
  deploy-web:
    needs: test
    if: github.ref == 'refs/heads/prod'
    uses: cloudflare/pages-action@v1
```

---

## 7. Environments & Secrets. Environments & Secrets

| Env | URL | DB | Auth keys |
| :---- | :---- | :---- | :---- |
| `dev` | `http://localhost:*` | Local Supabase (Docker) | `.env` |
| `staging` | `staging.ohwhealth.com` | Supabase project \#2 | GitHub Secrets |
| `prod` | `app.ohwhealth.com` | Supabase prod | Cloudflare encrypted vars |

---

## 8. Security & Compliance

* **HIPAA safeguards**: TLS 1.2+, at‑rest AES‑256, access logging.  
* **RLS policies**: all patient tables `auth.uid() = patient_id`.  
* **Audit logging**: Postgres triggers → separate `audit_log` table streamed to Workers Durable Object.  
* **Secrets scanning**: `git‑secrets`, Renovate.  
* **SAST**: Dependabot \+ CodeQL.

---

## 9. Observability

* **Sentry**: frontend \+ edge errors.  
* **Cloudflare Analytics**: request metrics.  
* **Supabase**: slow query log, Postgres metrics.

---

## 10. Future AI Module (Phase 2)

| Need | Approach |
| :---- | :---- |
| Personalised nutrition chat | Cloudflare **Workers AI** (LLama 3) with PHI‑aware prompt guardrail |
| Image OCR of meal photos | Supabase Edge Fn ↔ Cloudflare AI Vision |
| Vector similarity for patient education KB | Supabase **pgvector** extension \+ Cloudflare Vectorize |

---

## 11. Templates, Repos & Configuration

### 11.1 Primary Starter Template

| Repo | Reason we chose it | Notes |
| :---- | :---- | :---- |
| `techwithanirudh/create-t3-turbo-supabase` | Drizzle SQL (Edge‑friendly), Expo SDK 50, Sign‑in‑with‑Apple pre‑wired | Forked into **`ohw‑monorepo`** under Aiscend Labs GitHub org |
| `git clone --depth 1 github.com/techwithanirudh/create-t3-turbo-supabase my-ohw` |  |  |

**Initial scaffolding commands**

```shell
npx supabase init         # sets up local + links env vars
npx create-t3-turbo@latest . --noGit  # already cloned
pnpm i && pnpm dev        # Turbo spins up Expo + Next
```

### 11.2 Upstream Remotes

```
origin    → github.com/aiscendlabs/ohw-monorepo (private)
upstream  → github.com/techwithanirudh/create-t3-turbo-supabase
supabase  → github.com/supabase-community/create-t3-turbo
t3        → github.com/t3-oss/create-t3-turbo
```

Weekly GitHub Action opens a PR if `upstream/main` moves ahead.

### 11.3 Branching Model

| Branch | Purpose |
| :---- | :---- |
| `main` | auto‑deployed to **staging** (Cloudflare Preview) |
| `prod` | protected; merge triggers **production** deploy \+ EAS release |
| `feature/*` | dev work; Turbo remote cache enabled |

### 11.4 Environment Configuration

| Where | Config file | Secret storage |
| :---- | :---- | :---- |
| **Expo (apps/expo)** | `app.config.ts` reads from `.env.⁠mobile` | EAS Secrets (Expo dashboard) |
| **Next (apps/next)** | `next.config.mjs` | Cloudflare Pages project vars |
| **Edge Functions** | `supabase/functions/*/index.ts` | Supabase project secrets |
| **Local dev** | `.env` at repo root (git‑ignored) | Doppler/direnv for devs |

**Key env vars**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `CLOUDFLARE_ACCOUNT_ID`, `EAS_ACCESS_TOKEN`.

### 11.5 Template Customisations

* **CI**: *not* in upstream – we’re adding:  
    
  * `wrangler‑pages-deploy.yml` → builds Next.js, deploys to Cloudflare Pages.  
  * `eas-build.yml` → kicks Expo EAS build matrix.


* **UI**: added `packages/ui` with Tamagui config \+ Tailwind tokens.  
    
* **Auth**: native Sign‑in‑with‑Apple module kept; Google OAuth enabled via Supabase dashboard.  
    
* **DB**: Prisma removed; Drizzle SQL migrations live in `packages/db/migrations`.  
    
* **Env tooling**: Doppler `.env` template and commit hooks.

 Starter‑Repo “Time‑Save” Breakdown

| Category | Already wired in the template | Estimated hours saved |
| :---- | :---- | :---- |
| **Monorepo plumbing** | Turborepo workspace, task cache, remote cache config | **8 h** |
| **Expo setup** | SDK 50, Expo Router v3, NativeWind transformer | **6 h** |
| **Next.js 15 \+ RSC** | App Router, Tailwind, ESLint, Prettier | **6 h** |
| **Auth** | Supabase JS client, session context, Sign‑in‑with‑Apple (native module) | **10 h** |
| **DB layer** | Drizzle SQL migrations, type gen, Seed scripts | **12 h** |
| **CI/CD** | GitHub Action for Turbo (lint/test/cache) | **3 h** |
| **Testing scaffold** | ❌ (to be added: Jest \+ Playwright) | **0 h** |
| **Sample screens** | RN \+ Web screens using shared `packages/ui` | **4 h** |
| **Env management** | `.env.*` loader, Supabase CLI config | **3 h** |
| **Total upfront effort avoided** ≈ 54 developer hours |  |  |

---

### 11.7 Planned Add‑Ons (**not** in the starter repo)

| Item | Why we need it | Est. effort |
| :---- | :---- | :---- |
| **Cloudflare Pages deploy workflow** (`wrangler-pages-deploy.yml`) | Continuous delivery of the provider dashboard to the edge; encryption & caching headers baked in | **3 h** |
| **Expo EAS build workflow** (`eas-build.yml`) | Automated cloud builds \+ OTA release channels for iOS/Android | **2 h** |
| **Jest \+ Playwright scaffold** | Unit \+ E2E test harness to satisfy Section 6 QA requirements | **4 h** |
| **Tamagui integration** | Compile-time styles \+ design tokens; shared primitives | **6 h** |
| **shadcn/ui install in apps/next** | Accessible desktop widgets for providers | **1 h** |
| **pgAudit & audit-log Edge Function** | HIPAA audit trail; writes to `audit_log` table | **4 h** |
| **Vectorize account bootstrap** | Future AI KB similarity search | **1 h (placeholder)** |

*Total scheduled add‑on effort:* **≈ 21 developer hours** (can be split across two sprints).

---

