# OHW Weight Management App \- Master Implementation Plan v2.0

## Executive Summary

This Master Implementation Plan provides a comprehensive roadmap for developing the OHW Weight Management App, integrating all technical architecture decisions and infrastructure requirements. The plan is divided into MVP and V1 phases, with a focus on parallel development using AI coding agents and the Supabase MCP for flexible database management.

### Key Implementation Principles:

- **Infrastructure First**: Complete setup of Cloudflare, Supabase, and development environment before feature work  
- **Foundation Before Features**: Navigation shell, authentication, and core systems enable parallel development  
- **Direct Database Evolution**: AI agents use Supabase MCP for autonomous schema management  
- **Test-Driven Development**: E2E and integration tests from day one  
- **Compliance Throughout**: Delve Health integration at each infrastructure step

### Technical Stack Overview:

- **Patient App**: React Native with Expo Go (SDK 50\)  
- **Provider Dashboard**: Next.js 15 on Cloudflare Pages  
- **Backend**: Supabase with branch deployments  
- **Monorepo**: Turborepo with shared packages  
- **Infrastructure**: Cloudflare CDN/Workers, Expo EAS

---

## Table of Contents

1. [Technical Architecture Integration](#1.-technical-architecture-integration)  
2. [Infrastructure Setup Plan](#2.-infrastructure-setup-plan)  
3. [Development Approach](#3.-development-approach)  
4. [Dependency Analysis](#4.-dependency-analysis)  
5. [MVP Phase Implementation](#5.-mvp-phase-implementation)  
6. [V1 Phase Implementation](#6.-v1-phase-implementation)  
7. [Testing Strategy](#7.-testing-strategy)  
8. [Risk Management](#8.-risk-management)  
9. [Third-Party Integrations](#9.-third-party-integrations)  
10. [Medical Documentation Placeholders](#10.-medical-documentation-placeholders)

---

## 1\. Technical Architecture Integration {#1.-technical-architecture-integration}

### 1.1 Monorepo Structure Implementation

```
ohw-monorepo/
├── apps/
│   ├── expo/              # Patient mobile app (Expo SDK 50)
│   │   ├── app/           # Expo Router v3 file-based routing
│   │   ├── components/    # App-specific components
│   │   └── app.config.ts  # Expo configuration
│   └── next/              # Provider dashboard (Next.js 15)
│       ├── app/           # App Router structure
│       ├── components/    # Dashboard-specific components
│       └── next.config.js # Cloudflare Pages compatible config
├── packages/
│   ├── ui/                # Shared Tamagui components + NativeWind
│   ├── auth/              # Supabase auth hooks with platform handling
│   ├── utils/             # Business logic, calculations, formatters
│   └── supabase/          # Supabase client + type generation
├── supabase/
│   ├── migrations/        # Initial schema only
│   ├── functions/         # Edge functions (Deno)
│   └── config.toml        # Branch deployment config
└── .github/
    └── workflows/         # CI/CD pipelines
```

### 1.2 Template Customization

*(all work starts **after** we fork `techwithanirudh/create-t3-turbo-supabase` into `aiscendlabs/ohw-monorepo`)*

| Step | What we’re doing | How to do it / key files | Why it matters |  |
| :---- | :---- | :---- | :---- | :---- |
| ▢ 1 | **Fork & rename the workspace** | 1\. Fork in GitHub. 2\. \`pnpm pkg set name @aiscendlabs/ohw-monorepo\` to change the root \`package.json\` name. 3\. Update \`apps/expo/app.config.ts\` → \`slug: 'ohw-mobile'\`. | Gives every package a unique scope; Expo slug is what shows in OTA updates. |  |
| ▢ 2 | **Strip sample/demo code** | Delete marketing/demo routes: \\\`git rm \-r apps/next/app/\\\_marketing apps/expo/app/(demo | auth)`.<br>Leave` \_layout.tsx`and a blank`index.tsx\` so routing still works. | Keeps git history clean and prevents dead code from triggering CI. |
| ▢ 3 | **Add Tamagui \+ NativeWind** | `bash\npnpm add tamagui @tamagui/config nativewind react-native-svg\npnpm add -D tamagui-loader\n` • \*\*Expo\*\* → \`babel.config.js\` add plugins \`\['tamagui'\]\` & \`\['nativewind/babel'\]\`. • \*\*Expo\*\* → \`metro.config.js\` wrap with \`withTamagui()\`. • \*\*Next\*\* → wrap \`next.config.mjs\` with \`withTamagui({ config:'../packages/ui/tamagui.config.ts' })\`. • Root \`tailwind.config.ts\` — import tokens later. | Enables one design-system for web and mobile; Tamagui compiler removes runtime style cost. |  |
| ▢ 4 | **Create `packages/ui` design-system** | `bash\nmkdir -p packages/ui && touch packages/ui/{tamagui.config.ts,index.ts}\n` • In \`tamagui.config.ts\` define colour tokens that match Tailwind (\`primary\`, \`accent\`, etc.). • \`index.ts\` re-export \`tamagui\` primitives (\`export \* from 'tamagui'\`). • Add first shared component (\`Button.tsx\`). | Central place for themes & primitives; both apps `import { Button } from 'ui'`. |  |
| ▢ 5 | **Wire Supabase project \+ generate types** | `bash\nnpx supabase link --project-ref <PROJECT_ID>\ncp .env.example .env           # paste URL + ANON_KEY\nnpx supabase gen types typescript --local > packages/db/types.ts\n` | Generates compile-time types so API mismatches fail TS build. |  |
| ▢ 6 | **Configure auth providers** | Supabase dashboard → **Auth / Providers**: • add \*\*Google OAuth\*\* (paste OAuth Client IDs for iOS, Android, Web). • enable \*\*Apple\*\*; upload key & Services ID. On mobile ensure \`expo-apple-authentication\` stays in \`package.json\`. | Matches onboarding flow and App Store 4.8 rule (Apple login). |  |
| ▢ 7 | **Cloudflare Pages support** | `bash\npnpm add -D @cloudflare/next-on-pages wrangler\n` • root \`wrangler.toml\`: \`toml\\nname=\\"ohw-next\\"\\npages\_build\_output\_dir=\\"apps/next/.vercel/output\\"\\ncompatibility\_date=\\"2025-07-07\\"\\n\` • \`next.config.mjs\` → \`output:'export'\`. | Lets Next.js build artefact deploy to CF Pages behind global edge CDN. |  |
| ▢ 8 | **Wrangler deploy workflow** | Create `.github/workflows/pages.yml` that 1\. checks out code 2\. \`pnpm i && pnpm turbo run build \--filter apps/next\` 3\. runs \`npx wrangler pages deploy\` with \`CF\_API\_TOKEN\` & \`CF\_ACCOUNT\_ID\`. | Automatic preview URLs on every push to `main`. |  |
| ▢ 9 | **Expo EAS build workflow** | `.github/workflows/eas-build.yml`: • Use \`expo/expo-github-action\`. • Command: \`eas build \-p all \--non-interactive \--profile preview\`. • Store \`EAS\_ACCESS\_TOKEN\` in repo secrets. • Trigger on tag \`v0.\*\`. | Generates TestFlight / Play “Internal testing” builds on demand. |  |
| ▢ 10 | **Testing scaffold** | `bash\npnpm add -D jest ts-jest @testing-library/react @testing-library/react-native\npnpm add -D playwright @playwright/test\nnpx playwright install chromium\n` • Add \`jest.config.ts\` using \`ts-jest\`. • Add \`playwright.config.ts\` with baseURL \`http://localhost:3000\`. • Create a smoke test in each app so CI passes. | Gives immediate red/green feedback for future PRs; Playwright will also run on Pages preview once deployed. |  |
| ◇ 11 | **shadcn/ui for desktop-only widgets** | From `apps/next` root: \`npx shadcn-ui@latest init \--preset tailwind\`. Add \`DataTable\`, \`Dialog\` components as needed. | Provides accessible tables/modals without bloating the mobile bundle. |  |
| ◇ 12 | **pgAudit Edge Function \+ nightly export** | `supabase functions new audit-export` → write Deno script to copy daily rows from `audit_log` to Cloudflare R2. Add Cron Trigger \`@daily\` in Supabase. | Satisfies HIPAA long-term log-retention without hitting primary DB. |  |
| ◇ 13 | **Vectorize namespace for future AI KB** | Cloudflare dash → *AI / Vectorize* → create namespace `ohw-kb`. Store namespace ID & API key in repo secrets \`CF\_VECTORIZE\_NS\`. | Gives us vector storage for later LLM-powered features. |  |

**Outcome of Sprint 0**: the fork compiles (web \+ mobile), CI runs tests, Cloudflare preview URLs work, EAS can build TestFlight/Play artifacts, and all shared design tokens live in `packages/ui`.

**Note**: Template customization from `techwithanirudh/create-t3-turbo-supabase` includes:

- Removing unneeded dependencies  
- Configuring Tamagui \+ NativeWind  
- Setting up Supabase auth  
- Adjusting for Cloudflare deployment  
- *Specific steps to be documented separately \- those are now above*

### 1.3 Package Definitions

**packages/ui**:

- Tamagui theme configuration  
- Shared component library (Button, Card, Input, etc.)  
- NativeWind utility classes  
- Platform-specific adaptations

**packages/auth**:

- `useAuth()` hook with platform detection  
- JWT handling for web (cookies)  
- Secure storage for mobile  
- Session management utilities

**packages/utils**:

- BMI calculations  
- Date/time formatters  
- Validation functions  
- Business rule implementations

**packages/supabase**:

- Typed client initialization  
- Generated types from database  
- Common queries/mutations  
- Real-time subscription helpers (for future use)

---

## 2\. Infrastructure Setup Plan {#2.-infrastructure-setup-plan}

### 2.1 Foundation Infrastructure (MVP Phase \- First Priority)

#### Supabase Setup

```
1. Create main project on Supabase
2. Configure authentication providers:
   - Google OAuth (both mobile/web)
   - Magic Link email auth
3. Set up branch deployments:
   - Enable branching in project settings
   - Configure preview branches
4. Initial database schema:
   - Enable RLS on all tables
   - Create core tables via dashboard
5. Configure storage buckets:
   - patient-photos (private)
   - progress-photos (private)
   - lab-documents (private)
6. Connect to Delve Health for compliance
```

#### Cloudflare Setup

```
1. Create Cloudflare account and add domain
2. Set up Cloudflare Pages project:
   - Connect GitHub repository
   - Configure build settings for Next.js
   - Set up preview deployments
3. Configure environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (encrypted)
4. Enable Cloudflare Analytics
5. Set up Workers (for future edge functions)
6. Configure security headers and HIPAA requirements
7. Connect to Delve Health
```

#### Development Environment

```
1. Initialize monorepo with Turborepo
2. Configure package.json workspaces
3. Set up TypeScript paths
4. Install base dependencies
5. Configure ESLint/Prettier
6. Set up Git hooks for code quality
7. Create .env.example templates
8. Configure VS Code workspace settings
```

### 2.2 Mobile Infrastructure (MVP Phase \- Second Priority)

#### Expo EAS Setup

```
1. Install EAS CLI globally
2. Configure EAS project:
   - eas init
   - Configure app identifiers
3. Set up build profiles:
   - Development (Expo Go)
   - Preview (TestFlight/Internal)
   - Production (App Store)
4. Configure environment variables in EAS
5. Set up OTA updates configuration
6. Create app icons and splash screens
```

#### Mobile Development Setup

```
1. Configure Expo Router v3
2. Set up NativeWind for Tailwind
3. Configure Tamagui for React Native
4. Test Expo Go development flow
5. Set up development client build (for camera testing)
```

### 2.3 CI/CD Pipeline (MVP Phase \- Third Priority)

#### GitHub Actions Setup

```
# .github/workflows/ci.yml
- Lint and type checking
- Unit test execution
- Build verification
- Turbo cache configuration

# .github/workflows/deploy-web.yml  
- Cloudflare Pages deployment
- Environment-specific builds
- Preview URL comments on PRs

# .github/workflows/eas-build.yml
- Trigger EAS builds on tags
- Upload to TestFlight/Play Console
- OTA update publishing
```

### 2.4 Testing Infrastructure

```
1. Install Playwright for E2E tests
2. Configure Jest for unit tests  
3. Set up React Native Testing Library
4. Create test database branch
5. Configure test data seeders
6. Set up coverage reporting
```

---

## 3\. Development Approach {#3.-development-approach}

### 3.1 AI Agent Workflow

**Setup for Each Agent**:

1. Clone repository with git worktree  
2. Connect Supabase MCP for direct database access  
3. Access to shared packages via monorepo  
4. Independent feature branch  
5. Automated testing on commits

**Database Management via MCP**:

- Agents create tables as needed  
- Follow naming convention: `feature_tablename`  
- Add table comments for ownership  
- RLS policies created with tables  
- No migration files needed

### 3.2 Shared Component Development

**Evolution Strategy**:

1. Start with minimal implementations  
2. Enhance as features need them  
3. Platform-specific variants when required  
4. Document component APIs  
5. Storybook setup (V1 phase)

### 3.3 Environment Management

**Branch Deployment Strategy**:

- `main` branch → Preview environment  
- `staging` branch → Staging deployment  
- `production` branch → Production deployment  
- Feature branches → Temporary previews

**Environment Variables**:

```
Local: .env.local (git-ignored)
Staging: Supabase branch variables
Production: 
  - Cloudflare encrypted env vars
  - EAS Secrets for mobile
  - Supabase production project
```

---

## 4\. Dependency Analysis {#4.-dependency-analysis}

### 4.1 Visual Dependency Tree

```
graph TD
    subgraph Infrastructure [Infrastructure Layer - MVP Phase Start]
        Supabase[Supabase Setup<br/>Auth + Database + Storage]
        Cloudflare[Cloudflare Setup<br/>Pages + Workers + CDN]
        Monorepo[Monorepo Init<br/>Packages Structure]
        DevEnv[Dev Environment<br/>Tools + Config]
        EAS[Expo EAS<br/>Build + Deploy]
        CICD[CI/CD Pipeline<br/>GitHub Actions]
        Delve[Delve Health<br/>Compliance Setup]
    end
    
    subgraph Foundation [Foundation Layer - MVP Phase]
        Auth[Authentication<br/>Google OAuth + Magic Link]
        Nav[Navigation Shell<br/>All Routes + Placeholders]
        CoreDB[Core Tables<br/>RLS Policies]
        Testing[Test Framework<br/>Playwright + Jest]
        SharedUI[Base Components<br/>packages/ui]
        TestData[Test Data<br/>20 Patients]
    end
    
    subgraph MVP_Features [MVP Features - MVP Phase Core]
        subgraph Tracking [Core Tracking - Parallel]
            Food[Food Tracking<br/>Manual Entry]
            Fitness[Fitness Tracking<br/>Activity Logging]
            Weight[Weight Tracking<br/>Scale Photos]
        end
        
        subgraph Provider [Provider Features - Parallel]
            PatientList[Patient List<br/>Search + Filter]
            PatientDetail[Patient Detail<br/>All Data Views]
            LastUpdated[Update Indicators<br/>Refresh Controls]
        end
        
        subgraph Engagement [Engagement - Sequential]
            Dashboard[Patient Dashboard<br/>Progress Summary]
            WeeklyCheckin[Weekly Check-ins]
            PreVisit[Pre-Visit Forms]
            Notifications[Basic Notifications<br/>Push + Email]
        end
    end
    
    subgraph V1_Features [V1 Features - V1 Phase]
        subgraph Advanced [Advanced Features]
            FoodAPI[Food Database<br/>API Integration]
            Photos[Photo Features<br/>Meals + Progress]
            Education[CDC Modules<br/>+ Knowledge Checks]
            Gamification[Points & Badges]
        end
        
        subgraph Clinical [Clinical Tools]
            ICD10[ICD-10 Helper]
            Titration[Titration Calc]
            CDCReports[CDC Reports]
            PDFExport[PDF Snapshots]
            Labs[Lab Management]
        end
        
        subgraph Polish [Final Polish]
            Performance[Optimization]
            ProdDeploy[Production Setup]
            Documentation[User Docs]
        end
    end
    
    %% Infrastructure Dependencies
    Supabase --> Auth
    Cloudflare --> Nav
    Monorepo --> SharedUI
    DevEnv --> Testing
    Delve --> Supabase
    Delve --> Cloudflare
    
    %% Foundation to Features
    Auth --> Food
    Auth --> PatientList
    Nav --> Food
    Nav --> Fitness
    Nav --> Weight
    Nav --> PatientList
    CoreDB --> Food
    CoreDB --> Fitness
    CoreDB --> Weight
    SharedUI --> Food
    SharedUI --> Dashboard
    
    %% Feature Dependencies
    Food --> Dashboard
    Fitness --> Dashboard
    Weight --> Dashboard
    PatientList --> PatientDetail
    Dashboard --> WeeklyCheckin
    Dashboard --> PreVisit
    Auth --> Notifications
    
    %% V1 Dependencies
    Food --> FoodAPI
    Food --> Photos
    Dashboard --> Education
    Dashboard --> Gamification
    PatientDetail --> PDFExport
    PatientDetail --> ICD10
    
    %% Styling
    classDef infra fill:#ffebee,stroke:#c62828,stroke-width:3px
    classDef foundation fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
    classDef mvp fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px
    classDef v1 fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    
    class Supabase,Cloudflare,Monorepo,DevEnv,EAS,CICD,Delve infra
    class Auth,Nav,CoreDB,Testing,SharedUI,TestData foundation
    class Food,Fitness,Weight,PatientList,PatientDetail,Dashboard,WeeklyCheckin,PreVisit,Notifications,LastUpdated mvp
    class FoodAPI,Photos,Education,Gamification,ICD10,Titration,CDCReports,PDFExport,Labs,Performance,ProdDeploy,Documentation v1
```

### 4.2 Parallel Work Streams

**Stream 1 \- Infrastructure (MVP Phase Start)**

- Must complete first  
- 1-2 developers  
- Includes all Delve Health connections

**Stream 2 \- Foundation (MVP Phase)**

- Depends on Infrastructure  
- Can parallelize auth and navigation  
- Test data creation

**Stream 3 \- MVP Features (MVP Phase Core)**

- 3-4 parallel AI agents  
- Independent feature development  
- Continuous integration

**Stream 4 \- V1 Features (V1 Phase)**

- Build on MVP foundation  
- Clinical tools can be parallel  
- Polish phase at end

---

## 5\. MVP Phase Implementation {#5.-mvp-phase-implementation}

### 5.1 Infrastructure & Foundation (Weeks 1-3)

#### 5.1.1 Complete Infrastructure Setup

- [ ] Supabase project with branch deployments  
- [ ] Cloudflare Pages \+ Workers configuration  
- [ ] Monorepo structure with packages  
- [ ] EAS build configuration  
- [ ] CI/CD pipelines active  
- [ ] Delve Health compliance monitoring

#### 5.1.2 Authentication Implementation

**Technical Details**:

```ts
// packages/auth/useAuth.ts
- Platform detection (web vs mobile)
- Google OAuth flow handling
- Magic Link implementation
- Session persistence strategy
- Role-based redirects
```

**Deliverables**:

- [ ] Google OAuth configured in Supabase  
- [ ] Magic Link email templates  
- [ ] Protected route components  
- [ ] Session management with refresh  
- [ ] Logout functionality

#### 5.1.3 Navigation Shell

**Implementation**:

```ts
// apps/expo/app/_layout.tsx
- Tab navigation for main sections
- Placeholder screens for all routes
- "Coming Soon" components
- Deep linking configuration

// apps/next/app/layout.tsx  
- Sidebar navigation
- Role-based menu items
- Responsive design
- Loading states
```

**MVP Routes to Include**:

- Patient: Dashboard, Food, Fitness, Weight, Profile, Check-in, Pre-visit  
- Provider: Dashboard, Patients, Patient Detail (with tabs)

#### 5.1.4 Core Database Schema

```sql
-- Created via Supabase Dashboard with RLS
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE providers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  clinic_id UUID REFERENCES clinics(id),
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  clinic_id UUID REFERENCES clinics(id),
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Providers can view clinic patients" ON patients
  FOR SELECT USING (
    clinic_id IN (
      SELECT clinic_id FROM providers WHERE id = auth.uid()
    )
  );
```

#### 5.1.5 Testing Infrastructure

- [ ] Playwright E2E test setup  
- [ ] Jest unit test configuration  
- [ ] Test data seeder (20 patients, 3 providers)  
- [ ] GitHub Actions test runner  
- [ ] Coverage reporting

### 5.2 Core MVP Features (Weeks 3-6)

#### 5.2.1 Food Tracking

**Implementation**:

- Manual food entry form  
- Meal type selection (Breakfast/Lunch/Dinner/Snack)  
- Basic nutrition fields (calories, protein, carbs, fat)  
- Daily totals calculation (client-side)  
- Water intake tracking

**Database** (via MCP):

```sql
-- AI agent creates via Supabase MCP
CREATE TABLE food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  meal_type VARCHAR(20),
  food_name VARCHAR(255),
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  logged_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.2.2 Fitness Tracking

**Implementation**:

- Activity type dropdown  
- Duration input (minutes)  
- Intensity selector (Light/Moderate/Vigorous)  
- Weekly progress bar (150 min goal)  
- Client-side calculations

**Database** (via MCP):

```sql
CREATE TABLE exercise_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  activity_type VARCHAR(100),
  duration_minutes INTEGER,
  intensity VARCHAR(20),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.2.3 Weight Tracking

**Implementation**:

- Weight entry with lb/kg toggle  
- BMI calculation (client-side)  
- Camera integration for scale photo  
- Expo Camera API usage  
- Photo compression before upload

**Database** (via MCP):

```sql
CREATE TABLE weight_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  weight DECIMAL(5,2),
  unit VARCHAR(10) DEFAULT 'lbs',
  bmi DECIMAL(4,2),
  scale_photo_url TEXT,
  measured_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.2.4 Provider Dashboard

**Patient List**:

- Sortable table with search  
- Patient summary cards  
- Last activity indicators  
- Quick access to details

**Patient Detail View**:

- Overview tab: Key metrics summary  
- Weight tab: Progress chart  
- Activity tab: Exercise log and totals  
- Food tab: Daily entries with totals  
- Update indicators: "Last updated X minutes ago"  
- Manual refresh button

### 5.3 Engagement Features (Weeks 7-9)

#### 5.3.1 Patient Dashboard

- Weight loss progress chart  
- Weekly fitness minutes  
- Today's summary  
- Quick entry buttons  
- Streak indicators

#### 5.3.2 Weekly Check-ins

**Implementation**:

- Simple form with:  
  - Motivation level (1-10 slider)  
  - Challenges faced (checkboxes)  
  - Free text notes  
  - Goal adjustment needs  
- Provider flagging for low motivation

\[PENDING: Specific questionnaire content from clinical team\]

#### 5.3.3 Pre-Visit Questionnaires

**Implementation**:

- Triggered 24 hours before appointment  
- Basic symptom tracking  
- Questions for provider  
- Medication adherence check

\[PENDING: Questionnaire templates and clinical triggers\]

#### 5.3.4 Basic Notifications

**Setup**:

- Expo Push Notifications for mobile  
- Email via Supabase (Magic Link infrastructure)  
- In-app notification center  
- Preference management

**MVP Notifications**:

- Daily tracking reminders  
- Weekly check-in prompts  
- Pre-visit questionnaire alerts  
- Welcome messages

### 5.4 MVP Testing & Deployment (Weeks 9-10)

#### 5.4.1 Testing Phase

- [ ] Complete E2E test coverage  
- [ ] Provider dashboard testing  
- [ ] Performance testing with test data  
- [ ] Security audit with Delve Health  
- [ ] Bug fixes and polish

#### 5.4.2 Beta Deployment

- [ ] TestFlight build for iOS  
- [ ] Internal testing track for Android  
- [ ] Staging environment live  
- [ ] Provider training materials  
- [ ] Feedback collection setup

---

## 6\. V1 Phase Implementation {#6.-v1-phase-implementation}

### 6.1 Advanced Tracking Features (Weeks 10-12)

#### 6.1.1 Food Database Integration

- \[PENDING: OpenFoodFacts API integration\]  
- Search functionality  
- Barcode scanning (stretch)  
- Favorite foods system  
- Recent foods quick-add  
- Nutrition auto-population

#### 6.1.2 Photo Features

**Meal Photos**:

- In-app camera only  
- Attach to food entries  
- Gallery view in provider dashboard

**Progress Photos**:

- Upload allowed (before/after)  
- Timeline view  
- Side-by-side comparison  
- Privacy controls

#### 6.1.3 Enhanced Measurements

- Waist circumference tracking  
- Body fat percentage (optional)  
- Advanced progress visualizations  
- Trend analysis

### 6.2 Education System (Weeks 13-15)

#### 6.2.1 CDC DPP Modules

\[PENDING: CDC curriculum content and adaptation\]

**Implementation**:

- Module content management  
- Progress tracking  
- Delivery scheduling (1x or 3x weekly)  
- Completion certificates

#### 6.2.2 Knowledge Checks

- Multiple choice questions  
- 80% passing requirement  
- Retry functionality  
- Progress tracking

### 6.3 Gamification (Weeks 14-16)

#### 6.3.1 Points System

\[PENDING: Point values and psychology guidelines\]

**Implementation**:

- Points for daily logging  
- Streak bonuses  
- Goal achievement rewards  
- Leaderboard (anonymous)

#### 6.3.2 Badges & Achievements

- Milestone badges  
- Consistency awards  
- Special achievements  
- Visual celebrations

### 6.4 Clinical Tools (Weeks 16-18)

#### 6.4.1 ICD-10 Helper

\[PENDING: ICD-10 mapping logic and documentation\]

**Features**:

- Condition-based code suggestions  
- Documentation generator  
- Prior auth templates

#### 6.4.2 Titration Calculator

\[PENDING: Titration algorithms from clinical team\]

**Features**:

- Medication selection  
- Dose calculations  
- Schedule generation  
- Safety warnings

#### 6.4.3 PDF Export

**Provider Snapshots**:

- One-page patient summary  
- Key metrics and trends  
- Formatted for EHR import  
- \[PENDING: Exact data requirements\]

### 6.5 Advanced Integrations (Weeks 18-20)

#### 6.5.1 Enhanced Notifications

**SMS Integration**:

- \[PENDING: Provider selection \- likely Twilio\]  
- Appointment reminders  
- Critical alerts  
- Opt-in management

#### 6.5.2 Calendar Integration

- .ics file generation  
- Appointment scheduling  
- Task reminders  
- Provider availability

#### 6.5.3 Lab Management

- PDF upload interface  
- Secure storage  
- Result tracking  
- 6-month reminder system

### 6.6 Production Preparation (Weeks 20-24)

#### 6.6.1 Performance Optimization

- Image optimization  
- Query optimization  
- Caching strategies  
- Load testing

#### 6.6.2 Production Environment

- Production Supabase project  
- Domain configuration  
- SSL certificates  
- Monitoring setup

#### 6.6.3 Compliance & Documentation

- Final Delve Health audit  
- User documentation  
- API documentation  
- Deployment guides

#### 6.6.4 App Store Preparation

- App Store assets  
- Privacy policies  
- Terms of service  
- Review documentation

---

## 7\. Testing Strategy {#7.-testing-strategy}

### 7.1 Test Infrastructure (Foundation Phase)

**Tools & Setup**:

```json
{
  "e2e": "Playwright",
  "unit": "Jest + React Testing Library",
  "mobile": "Detox (if needed beyond Expo Go)",
  "api": "Supertest",
  "coverage": "80% minimum"
}
```

### 7.2 MVP Test Coverage

**Critical E2E Paths**:

```ts
// tests/e2e/auth.spec.ts
- Google OAuth flow
- Magic Link flow
- Role-based routing

// tests/e2e/patient-tracking.spec.ts
- Food entry and daily totals
- Exercise logging
- Weight entry with photo

// tests/e2e/provider-flow.spec.ts
- Patient list navigation
- Patient detail views
- Data refresh functionality
```

### 7.3 Test Data Management

**Synthetic Data (20 patients)**:

- Various activity levels  
- 30 days of historical data  
- Different health conditions  
- Realistic entry patterns

**Seeder Script**:

```ts
// scripts/seed-test-data.ts
- Creates test clinic
- 3 test providers
- 20 test patients
- Historical tracking data
- Runs on test branch
```

### 7.4 Continuous Testing

**GitHub Actions**:

- Run on every PR  
- Block merge on failures  
- Nightly full suite  
- Performance benchmarks

---

## 8\. Risk Management {#8.-risk-management}

### 8.1 Technical Risks

**Risk: Expo Go Limitations**

- *Impact*: Camera features might need dev client  
- *Mitigation*: Test camera early, switch to dev build if needed

**Risk: Database Schema Evolution**

- *Impact*: AI agents create conflicting schemas  
- *Mitigation*:  
  - Naming conventions documented  
  - Regular schema reviews  
  - Table ownership comments

**Risk: API Rate Limits**

- *Impact*: Food database search failures  
- *Mitigation*:  
  - Implement caching layer  
  - Fallback to manual entry  
  - Monitor usage patterns

### 8.2 Compliance Risks

**Risk: HIPAA Audit Findings**

- *Impact*: Cannot launch without compliance  
- *Mitigation*:  
  - Delve Health from day one  
  - Regular compliance checks  
  - Audit logging implemented early  
  - Security headers configured

**Risk: App Store Rejection**

- *Impact*: Launch delays  
- *Mitigation*:  
  - Follow guidelines strictly  
  - Health app requirements research  
  - Detailed review notes  
  - Beta testing feedback

### 8.3 Development Risks

**Risk: AI Agent Coordination**

- *Impact*: Integration conflicts  
- *Mitigation*:  
  - Clear feature boundaries  
  - Robust test coverage  
  - Daily integration tests  
  - MCP allows easy fixes

---

## 9\. Third-Party Integrations {#9.-third-party-integrations}

### 9.1 MVP Integrations

**Confirmed Services**:

```
Supabase:
  - Authentication (Google OAuth, Magic Link)
  - PostgreSQL database
  - File storage (photos)
  - Email service

Delve Health:
  - HIPAA compliance monitoring
  - Infrastructure scanning
  - Audit requirements
  - BAA management

Expo Services:
  - Push notifications
  - OTA updates
  - Build service
```

### 9.2 V1 Integrations

**Pending Selections**:

```
Food Database:
  Primary: OpenFoodFacts (free, open)
  Alternatives: 
    - Nutritionix (better data, costs)
    - Edamam (good API, pricing)
  [PENDING: Final selection based on testing]

SMS Provider:
  Likely: Twilio
  Alternatives:
    - AWS SNS
    - MessageBird
  [PENDING: Cost analysis and setup]

Analytics:
  - Cloudflare Analytics (included)
  - Sentry (error tracking - V1 end)
  - Custom analytics (future)
```

---

## 10\. Medical Documentation Placeholders {#10.-medical-documentation-placeholders}

### 10.1 Clinical Algorithms

**Weight Management Calculations**

- \[PENDING: BMI categorization thresholds\]  
- \[PENDING: Healthy weight loss rate calculations\]  
- \[PENDING: Calorie deficit recommendations\]

**Risk Assessment Models**

- \[PENDING: Diabetes risk calculation\]  
- \[PENDING: Cardiovascular risk factors\]  
- \[PENDING: Metabolic syndrome criteria\]

**Medication Protocols**

- \[PENDING: GLP-1 titration schedules\]  
- \[PENDING: Contraindication checking\]  
- \[PENDING: Side effect monitoring\]

### 10.2 Clinical Content

**CDC DPP Curriculum**

- \[PENDING: 24 module content adaptation\]  
- \[PENDING: Delivery schedule optimization\]  
- \[PENDING: Engagement requirements\]

**Educational Materials**

- \[PENDING: Portion size visual guides\]  
- \[PENDING: Exercise recommendations by fitness level\]  
- \[PENDING: Nutrition education modules\]

### 10.3 Provider Workflows

**5-10 Minute Review Process**

- \[PENDING: Key metrics priority order\]  
- \[PENDING: Red flag thresholds\]  
- \[PENDING: Intervention triggers\]

**Clinical Decision Support**

- \[PENDING: Alert thresholds for provider notification\]  
- \[PENDING: Compliance scoring methodology\]  
- \[PENDING: Progress assessment criteria\]

### 10.4 Compliance Requirements

**Data Collection Standards**

- \[PENDING: CDC required fields\]  
- \[PENDING: Insurance documentation needs\]  
- \[PENDING: Outcome measurement standards\]

**Reporting Specifications**

- \[PENDING: CDC report format\]  
- \[PENDING: ICD-10 documentation requirements\]  
- \[PENDING: Prior authorization templates\]

---

## Implementation Timeline Summary

### MVP Phase

- **Infrastructure Setup**: Complete all infrastructure and Delve integration  
- **Foundation Layer**: Authentication, Navigation, Core Database  
- **Core Features**: Tracking systems, Provider Dashboard  
- **Engagement Features**: Check-ins, Questionnaires, Notifications  
- **Testing & Deployment**: Beta testing and TestFlight deployment

### V1 Phase

- **Advanced Tracking**: Enhanced features, photo systems, API integrations  
- **Education System**: CDC modules and knowledge checks  
- **Gamification**: Points, badges, and achievements  
- **Clinical Tools**: ICD-10 helper, titration calculator, reporting  
- **Advanced Integrations**: SMS, calendar, lab management  
- **Production Launch**: Optimization, compliance, and app store release

### Success Metrics

- MVP: Core tracking functional, providers can review patients  
- V1: Full feature set, production ready, app store approved

---

## Next Steps

1. **Immediate Actions**:  
     
   - Fork and customize template repository  
   - Set up Supabase project with branching  
   - Configure Cloudflare Pages  
   - Initialize Delve Health monitoring  
   - Create AI agent documentation

   

2. **Technical Decisions**:  
     
   - Finalize food API selection  
   - Test camera functionality in Expo Go  
   - Design synthetic test data structure

   

3. **Clinical Documentation**:  
     
   - Schedule review sessions with clinical team  
   - Prioritize algorithm documentation needs  
   - Gather CDC curriculum materials

This implementation plan provides a comprehensive roadmap integrating all technical architecture decisions while maintaining flexibility for clinical input throughout the development process.  
