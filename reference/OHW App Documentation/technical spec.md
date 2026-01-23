# OHW Weight Management App \- Technical Specification v1.0

## Executive Summary

This comprehensive technical specification outlines the complete architecture and implementation details for the OHW Weight Management App v1.0. The document serves as the primary reference for development, containing all pages, features, functionality, and database requirements needed to build the application.

### What This Document Contains:

1. **Patient Mobile App (React Native/Expo)** \- 23 distinct screens covering:  
     
   - Complete authentication and onboarding flow  
   - Daily tracking features (food, fitness, weight, measurements)  
   - Educational content delivery system  
   - Progress visualization and goal management  
   - Gamification and engagement features

   

2. **Provider Web Dashboard (Next.js)** \- 11 main pages including:  
     
   - Comprehensive patient management system  
   - Detailed patient analytics with 6 specialized views  
   - CDC-compliant reporting tools  
   - Clinical tools (ICD-10 helper, medication titration)  
   - Clinic administration features

   

3. **Database Architecture** \- 30+ Supabase/Postgres tables with:  
     
   - Complete schema definitions for all data entities  
   - Row Level Security (RLS) policies for HIPAA compliance  
   - Audit logging and data tracking systems  
   - Relationships and constraints properly defined

   

4. **Technical Infrastructure**:  
     
   - RESTful API endpoint specifications  
   - Security and HIPAA compliance requirements  
   - Data synchronization strategies  
   - File storage and media handling

   

5. **Integration Points**:  
     
   - Third-party food database API  
   - Notification systems (push, email, in-app, SMS)  
   - CDC reporting requirements  
   - Future AI/ML preparation

This specification aligns with the signed Master Services Agreement dated May 1, 2025, and the technical architecture document, utilizing the modern tech stack of React Native/Expo, Next.js 15, Supabase, and Cloudflare infrastructure.

---

## Table of Contents

1. [Overview](#1.-overview)  
2. [User Flow Diagrams](#2.-user-flow-diagrams)  
3. [Patient Mobile App Pages](#3.-patient-mobile-app-pages)  
4. [Provider Web Dashboard Pages](#3.-provider-web-dashboard-pages)  
5. [Database Schema](#4.-database-schema)  
6. [API Endpoints](#5.-api-endpoints)  
7. [Security & Compliance](#6.-security-&-compliance)

---

## 1\. Overview {#1.-overview}

### Tech Stack

- **Patient App**: React Native/Expo SDK 50  
- **Provider Dashboard**: Next.js 15 with React Server Components  
- **Backend**: Supabase (Postgres 16 with RLS)  
- **Shared**: Turborepo monorepo with shared packages  
- **Infrastructure**: Cloudflare Pages/Workers, Expo EAS

### User Roles

- **Patients**: Mobile app access only  
- **Providers**: Web dashboard access only

---

## 2\. User Flow Diagrams {#2.-user-flow-diagrams}

### 2.1 Complete Application Flow

[OHW App Flow.png](https://drive.google.com/file/d/1gM4Qy4jHMvI6wtNYUE8XNkLwFLf_KQdU/view?usp=sharing) \- Photo of the App Flow Chart

```
graph TB
    subgraph "Patient Mobile App Flow"
        Start([App Launch])
        
        %% Authentication Flow
        Start --> Auth{Authenticated?}
        Auth -->|No| Login[Login Screen]
        Auth -->|Yes| CheckOnboarding{Onboarding Complete?}
        
        Login --> Register[Register Screen]
        Login --> ForgotPass[Forgot Password]
        Register --> ClinicSelect[Select Clinic]
        ClinicSelect --> CreateAccount[Create Account]
        
        %% Onboarding Flow
        CreateAccount --> Onboarding1[Welcome Screen]
        CheckOnboarding -->|No| Onboarding1
        
        Onboarding1 --> Onboarding2[Demographics]
        Onboarding2 --> Onboarding3[Health History]
        Onboarding3 --> Onboarding4[Comorbidities]
        Onboarding4 --> Onboarding5[Contraindications]
        Onboarding5 --> Onboarding6[Goal Setting]
        Onboarding6 --> Onboarding7[App Tutorial]
        Onboarding7 --> Dashboard
        
        %% Main App Navigation
        CheckOnboarding -->|Yes| Dashboard[Dashboard/Home]
        
        Dashboard --> Food[Food Tracking]
        Dashboard --> Fitness[Fitness Tracking]
        Dashboard --> Measurements[Weight & Measurements]
        Dashboard --> Education[Education Hub]
        Dashboard --> Progress[Progress & Goals]
        Dashboard --> Profile[Profile & Settings]
        
        %% Food Tracking Sub-flows
        Food --> AddFood[Add Food Entry]
        Food --> FoodCamera[Capture Meal Photo]
        Food --> Favorites[Favorite Meals]
        
        %% Fitness Sub-flows
        Fitness --> AddActivity[Add Activity]
        
        %% Measurements Sub-flows
        Measurements --> AddWeight[Add Weight + Scale Photo]
        Measurements --> BeforeAfter[Before/After Photos]
        
        %% Education Sub-flows
        Education --> Module[View Module]
        Module --> Quiz[Knowledge Check]
        
        %% Profile Sub-flows
        Profile --> NotificationSettings[Notification Settings]
        Profile --> Logout[Sign Out]
        
        %% Engagement Features
        Dashboard --> WeeklyCheckin[Weekly Check-in]
        Dashboard --> PreVisit[Pre-Visit Questionnaire]
        
        %% Return paths
        AddFood --> Food
        FoodCamera --> Food
        AddActivity --> Fitness
        AddWeight --> Measurements
        Quiz --> Education
        WeeklyCheckin --> Dashboard
        PreVisit --> Dashboard
    end
    
    subgraph "Provider Web Dashboard Flow"
        ProvStart([Provider Login])
        
        %% Provider Authentication
        ProvStart --> ProvAuth{Authenticated?}
        ProvAuth -->|No| ProvLogin[Login Page]
        ProvAuth -->|Yes| ProvDashboard[Provider Dashboard]
        
        ProvLogin --> ProvForgot[Forgot Password]
        
        %% Main Provider Navigation
        ProvDashboard --> PatientList[Patient List]
        ProvDashboard --> CDCReports[CDC Reporting]
        ProvDashboard --> Tools[Clinical Tools]
        ProvDashboard --> Settings[Clinic Settings]
        
        %% Patient Management
        PatientList --> PatientDetail[Patient Detail View]
        PatientDetail --> Overview[Overview Tab]
        PatientDetail --> WeightProgress[Weight Progress Tab]
        PatientDetail --> ActivityLog[Activity Log Tab]
        PatientDetail --> FoodJournal[Food Journal Tab]
        PatientDetail --> Labs[Labs Tab]
        PatientDetail --> Notes[Notes Tab]
        
        %% Tools
        Tools --> ICD10[ICD-10 Helper]
        Tools --> Titration[Titration Calculator]
        
        %% Actions from Patient Detail
        Overview --> ExportSnapshot[Export Snapshot]
        Labs --> UploadLab[Upload Lab PDF]
        Notes --> AddNote[Add Provider Note]
        
        %% CDC Reporting
        CDCReports --> GenerateReport[Generate Excel Report]
        
        %% Settings
        Settings --> ClinicInfo[Clinic Information]
        Settings --> ProviderProfiles[Provider Profiles]
        Settings --> ProvLogout[Sign Out]
    end
    
    %% Cross-platform connections
    PatientDetail -.->|Views Patient Data| Dashboard
    WeeklyCheckin -.->|Flags sent to| PatientDetail
    PreVisit -.->|Responses visible in| PatientDetail
```

### 2.2 Flow Diagram Key Points

#### Patient Mobile App Flow:

- **Sequential Onboarding**: New users must complete all 7 onboarding steps before accessing the main app  
- **Hub-and-Spoke Navigation**: Dashboard serves as the central hub with direct access to all main features  
- **Sub-screen Returns**: All sub-screens return users to their parent screen for consistent navigation  
- **Engagement Touchpoints**: Weekly check-ins and pre-visit questionnaires are triggered from the dashboard

#### Provider Web Dashboard Flow:

- **Quick Access**: Providers land directly on the dashboard after authentication  
- **Patient-Centric Design**: Most workflows revolve around patient management and detail views  
- **Tabbed Interface**: Patient details use tabs to organize the extensive information  
- **Export Capabilities**: Multiple export points for EHR integration and reporting

#### Cross-Platform Data Flow:

- Patient-entered data (food logs, exercise, measurements) flows to the provider dashboard in real-time  
- Provider actions (notes, lab uploads) are visible to patients in relevant sections  
- Engagement responses (check-ins, questionnaires) create alerts in the provider dashboard

---

## 3\. Patient Mobile App Pages {#3.-patient-mobile-app-pages}

### 2.1 Authentication Screens

#### 2.1.1 Login Screen

**Route**: `/login`

**Features**:

- Email/Password login form  
- "Forgot Password" link  
- "Create Account" link  
- Remember me option

**Functionality**:

- Validate email format  
- Secure password input with show/hide toggle  
- Error handling for invalid credentials  
- Session management with Supabase Auth  
- Redirect to onboarding or dashboard based on profile completion

#### 2.1.2 Registration Screen

**Route**: `/register`

**Features**:

- Email/Password registration form  
- Clinic selection dropdown  
- Terms of Service checkbox  
- Privacy Policy link

**Functionality**:

- Email validation and uniqueness check  
- Password strength requirements (min 8 chars, 1 uppercase, 1 number)  
- Clinic code/invitation validation  
- Create Supabase auth user  
- Create patient profile with clinic association  
- Send verification email  
- Auto-login after registration

#### 2.1.3 Forgot Password Screen

**Route**: `/forgot-password`

**Features**:

- Email input field  
- Submit button  
- Back to login link

**Functionality**:

- Validate email exists in system  
- Send password reset email via Supabase  
- Show success/error messages  
- Rate limiting (1 request per 5 minutes)

### 2.2 Onboarding Flow

#### 2.2.1 Welcome Screen

**Route**: `/onboarding/welcome`

**Features**:

- Welcome message  
- App overview  
- "Get Started" button  
- Progress indicator (Step 1 of 7\)

**Functionality**:

- Mark onboarding started in database  
- Track screen view for analytics

#### 2.2.2 Demographics Collection

**Route**: `/onboarding/demographics`

**Features**:

- Personal information form  
  - Full name  
  - Date of birth  
  - Gender selection  
  - Phone number  
  - Address  
  - Ethnicity (CDC requirement)  
- Progress indicator (Step 2 of 7\)

**Functionality**:

- Form validation for all fields  
- Age calculation and validation (18+)  
- Phone number formatting  
- Address autocomplete (optional)  
- Save to patient profile

#### 2.2.3 Health History

**Route**: `/onboarding/health-history`

**Features**:

- Medical conditions checklist  
- Current medications list  
- Supplements list  
- Allergies input  
- Previous weight loss attempts  
- Progress indicator (Step 3 of 7\)

**Functionality**:

- Dynamic form sections  
- Add/remove medications and supplements  
- Autocomplete for common medications  
- Save to patient\_health\_history table  
- Flag high-risk conditions for provider review

#### 2.2.4 Comorbidity Assessment

**Route**: `/onboarding/comorbidities`

**Features**:

- Detailed questionnaire for insurance requirements  
- Condition-specific questions  
- Family history section  
- Progress indicator (Step 4 of 7\)

**Functionality**:

- Conditional logic based on previous answers  
- Calculate insurance eligibility scores  
- Generate ICD-10 code suggestions  
- Save to patient\_comorbidities table

#### 2.2.5 Contraindication Screening

**Route**: `/onboarding/contraindications`

**Features**:

- Medication-specific screening questions  
- Gastroparesis screening  
- Pancreatitis history  
- Thyroid cancer screening  
- Progress indicator (Step 5 of 7\)

**Functionality**:

- Flag contraindications for provider review  
- Block certain medication suggestions  
- Save screening results  
- Generate safety alerts for providers

#### 2.2.6 Goal Setting

**Route**: `/onboarding/goals`

**Features**:

- SMART goal framework  
- Weight loss target slider  
- Timeline selection  
- Lifestyle change options  
- Energy/mobility goals  
- Progress indicator (Step 6 of 7\)

**Functionality**:

- Calculate realistic weight loss rate  
- Validate goal achievability  
- Generate visual roadmap  
- Save goals with target dates  
- Calculate daily calorie targets

#### 2.2.7 App Tutorial

**Route**: `/onboarding/tutorial`

**Features**:

- Interactive walkthrough  
- Feature highlights  
- Gamification explanation  
- Notification preferences  
- Education delivery cadence (1x or 3x weekly)  
- Progress indicator (Step 7 of 7\)

**Functionality**:

- Track tutorial completion  
- Set notification preferences  
- Configure education schedule  
- Complete onboarding status  
- Redirect to main dashboard

### 2.3 Main App Screens

#### 2.3.1 Dashboard (Home)

**Route**: `/dashboard`

**Features**:

- Weight loss progress chart  
- Weekly fitness minutes  
- Today's tasks checklist  
- Points/badges display  
- Quick actions menu  
- Upcoming appointments

**Functionality**:

- Real-time data sync  
- Calculate progress percentages  
- Update task completion status  
- Show achievement animations  
- Navigate to detailed views  
- Display next appointment countdown

#### 2.3.2 Food Tracking

**Route**: `/food`

**Features**:

- Daily meal view (Breakfast, Lunch, Dinner, Snacks)  
- Add food button  
- Daily totals (calories, macros)  
- Water intake tracker  
- Photo meal log  
- Favorite meals section

**Sub-screens**:

##### 2.3.2.1 Add Food Screen

**Route**: `/food/add`

**Features**:

- Food search bar  
- Recent foods list  
- Manual entry option  
- Portion size selector  
- Meal type selector  
- Cooking oil/seasoning toggle

**Functionality**:

- Search food database (3rd party API)  
- Visual portion guides  
- Calculate nutrition automatically  
- Add to daily log  
- Update daily totals  
- Save as favorite option

##### 2.3.2.2 Food Camera Screen

**Route**: `/food/camera`

**Features**:

- In-app camera view  
- Capture button  
- Meal type selector  
- Optional notes field

**Functionality**:

- Access device camera  
- Capture and compress image  
- Upload to Supabase storage  
- Link to meal entry  
- No external photo uploads allowed

#### 2.3.3 Fitness Tracking

**Route**: `/fitness`

**Features**:

- Weekly minutes progress bar  
- Add activity button  
- Activity history list  
- Intensity breakdown chart  
- Weekly goal indicator

**Sub-screens**:

##### 2.3.3.1 Add Activity Screen

**Route**: `/fitness/add`

**Features**:

- Activity type dropdown  
- Duration input  
- Intensity selector (Light/Moderate/Vigorous)  
- Notes field

**Functionality**:

- Calculate minutes toward weekly goal  
- Validate duration limits  
- Save to activity log  
- Update weekly totals  
- Show progress animation

#### 2.3.4 Weight & Measurements

**Route**: `/measurements`

**Features**:

- Current weight display  
- Add measurement button  
- Progress chart  
- BMI indicator  
- Waist measurement tracker  
- Before/after photos

**Sub-screens**:

##### 2.3.4.1 Add Weight Screen

**Route**: `/measurements/weight/add`

**Features**:

- Weight input (lbs/kg toggle)  
- Scale photo capture (required)  
- Date/time selector

**Functionality**:

- Validate weight range  
- Require in-app photo only  
- Show feet on scale (CDC requirement)  
- Calculate BMI  
- Update progress charts

##### 2.3.4.2 Before/After Photos

**Route**: `/measurements/photos`

**Features**:

- Photo comparison view  
- Add photo button  
- Date selector  
- Privacy notice

**Functionality**:

- Allow camera capture OR upload  
- Side-by-side comparison  
- Swipe through timeline  
- Secure storage with encryption

#### 2.3.5 Education Hub

**Route**: `/education`

**Features**:

- Module list  
- Progress indicators  
- Completed modules  
- Current module  
- Knowledge check status

**Sub-screens**:

##### 2.3.5.1 Module Viewer

**Route**: `/education/module/:id`

**Features**:

- Module content display  
- Progress bar  
- Navigation controls  
- Knowledge check button

**Functionality**:

- Track reading time  
- Mark sections complete  
- Save progress  
- Award points for completion

##### 2.3.5.2 Knowledge Check

**Route**: `/education/module/:id/quiz`

**Features**:

- Multiple choice questions  
- Submit button  
- Results display  
- Retry option

**Functionality**:

- Randomize question order  
- Calculate score  
- Require 80% to pass  
- Award completion points

#### 2.3.6 Progress & Goals

**Route**: `/progress`

**Features**:

- Visual roadmap  
- Milestone markers  
- Current vs. target metrics  
- Risk reduction display  
- Achievement badges  
- Lab results viewer

**Functionality**:

- Interactive timeline  
- Tap for milestone details  
- Calculate risk reduction  
- Display lab PDFs  
- Show trend analysis

#### 2.3.7 Profile & Settings

**Route**: `/profile`

**Features**:

- Personal information  
- Notification settings  
- Privacy settings  
- Provider information  
- App preferences  
- Sign out button

**Sub-screens**:

##### 2.3.7.1 Notifications Settings

**Route**: `/profile/notifications`

**Features**:

- Push notification toggles  
- Email preferences  
- Reminder times  
- Frequency settings

**Functionality**:

- Update notification preferences  
- Schedule daily reminders  
- Configure quiet hours  
- Test notifications

### 2.4 Engagement Features

#### 2.4.1 Weekly Check-in

**Route**: `/checkin`

**Features**:

- Weekly questionnaire  
- Challenge identification  
- Goal adjustment  
- Motivation scale  
- Support requests

**Functionality**:

- Scheduled weekly prompts  
- Track responses over time  
- Flag concerns for providers  
- Adjust goals if needed

#### 2.4.2 Pre-Visit Questionnaire

**Route**: `/previsit`

**Features**:

- Medication side effects  
- Progress concerns  
- Questions for provider  
- Goal review

**Functionality**:

- Auto-trigger 24-48 hours before appointment  
- Save responses for provider  
- Generate discussion points  
- Track medication adherence

---

## 3\. Provider Web Dashboard Pages {#3.-provider-web-dashboard-pages}

### 3.1 Authentication

#### 3.1.1 Provider Login

**Route**: `/login`

**Features**:

- Email/Password form  
- Clinic selection (if multiple)  
- Remember me  
- Forgot password link

**Functionality**:

- Role-based authentication  
- Session management  
- Multi-clinic support  
- Security logging

### 3.2 Main Dashboard

#### 3.2.1 Provider Home

**Route**: `/dashboard`

**Features**:

- Patient summary cards  
- Alerts/flags section  
- Today's appointments  
- Quick stats  
- Recent activity feed

**Functionality**:

- Real-time updates  
- Filter by urgency  
- Quick patient search  
- Export daily summary

### 3.3 Patient Management

#### 3.3.1 Patient List

**Route**: `/patients`

**Features**:

- Searchable patient table  
- Sort by various criteria  
- Filter options  
- Bulk actions  
- Add patient button

**Functionality**:

- Pagination (25 per page)  
- Advanced search  
- Export to Excel  
- Quick view modal

#### 3.3.2 Patient Detail View

**Route**: `/patients/:id`

**Features**:

- Patient header info  
- Tabbed interface  
  - Overview  
  - Weight Progress  
  - Activity Log  
  - Food Journal  
  - Labs  
  - Notes  
- Action buttons  
- Export options

**Sub-tabs**:

##### 3.3.2.1 Overview Tab

**Features**:

- Key metrics summary  
- Progress charts  
- Current medications  
- Recent activity  
- Compliance scores

**Functionality**:

- 5-10 minute review design  
- Highlight changes  
- Flag concerns  
- Quick snapshot export

##### 3.3.2.2 Weight Progress Tab

**Features**:

- Detailed weight chart  
- BMI progression  
- Measurement history  
- Photo timeline  
- Goal tracking

**Functionality**:

- Interactive charts  
- Date range selector  
- Annotation tools  
- Trend analysis

##### 3.3.2.3 Activity Log Tab

**Features**:

- Exercise minutes chart  
- Activity breakdown  
- Intensity distribution  
- Weekly patterns  
- Compliance rate

**Functionality**:

- Filter by activity type  
- Compare to goals  
- Export for reporting

##### 3.3.2.4 Food Journal Tab

**Features**:

- Daily meal views  
- Photo gallery  
- Calorie trends  
- Macro breakdown  
- Pattern analysis

**Functionality**:

- Browse by date  
- View meal photos  
- Flag concerning patterns  
- Add provider notes

##### 3.3.2.5 Labs Tab

**Features**:

- Lab results list  
- PDF viewer  
- Trend charts  
- Upload interface  
- Reminder system

**Functionality**:

- View/download PDFs  
- Track key markers  
- Set follow-up reminders  
- Compare over time

##### 3.3.2.6 Notes Tab

**Features**:

- Provider notes  
- Visit summaries  
- Care plan  
- Communication log

**Functionality**:

- Rich text editor  
- Template support  
- Version history  
- Export options

### 3.4 Reporting & Tools

#### 3.4.1 CDC Reporting

**Route**: `/reports/cdc`

**Features**:

- DPP compliance metrics  
- Export interface  
- Patient selection  
- Date range picker

**Functionality**:

- Generate CDC-compliant reports  
- Bulk data export  
- Automated calculations  
- Submission tracking

#### 3.4.2 ICD-10 Helper

**Route**: `/tools/icd10`

**Features**:

- Patient condition list  
- Suggested codes  
- Prior auth helper  
- Export function

**Functionality**:

- Auto-populate from intake  
- Search ICD-10 database  
- Generate documentation  
- Track approvals

#### 3.4.3 Titration Calculator

**Route**: `/tools/titration`

**Features**:

- Patient selector  
- Current medication  
- Algorithm inputs  
- Schedule generator

**Functionality**:

- Apply titration algorithm  
- Generate schedule  
- Set reminders  
- Track adjustments

### 3.5 Clinic Management

#### 3.5.1 Settings

**Route**: `/settings`

**Features**:

- Clinic information  
- Provider profiles  
- Notification preferences  
- Integration settings

**Functionality**:

- Update clinic details  
- Manage provider access  
- Configure workflows  
- API key management

---

## 4\. Database Schema {#4.-database-schema}

### 4.1 Core Tables

```sql
-- Auth handled by Supabase Auth

-- Clinics
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  clinic_code VARCHAR(20) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Providers (linked to Supabase Auth)
CREATE TABLE providers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  clinic_id UUID REFERENCES clinics(id),
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients (linked to Supabase Auth)
CREATE TABLE patients (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  clinic_id UUID REFERENCES clinics(id),
  provider_id UUID REFERENCES providers(id),
  
  -- Demographics
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  ethnicity VARCHAR(50),
  phone VARCHAR(20),
  address TEXT,
  
  -- Status
  onboarding_completed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Preferences
  notification_preferences JSONB DEFAULT '{}',
  education_cadence VARCHAR(20) DEFAULT 'weekly', -- 'weekly' or 'thrice_weekly'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health History
CREATE TABLE patient_health_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  medical_conditions TEXT[],
  current_medications JSONB DEFAULT '[]', -- [{name, dose, frequency}]
  supplements JSONB DEFAULT '[]',
  allergies TEXT[],
  previous_weight_loss_attempts TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comorbidities
CREATE TABLE patient_comorbidities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  conditions JSONB DEFAULT '{}', -- {condition: details}
  family_history JSONB DEFAULT '{}',
  insurance_eligibility_score DECIMAL(3,2),
  suggested_icd10_codes TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contraindications
CREATE TABLE patient_contraindications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  gastroparesis BOOLEAN DEFAULT false,
  pancreatitis_history BOOLEAN DEFAULT false,
  thyroid_cancer_history BOOLEAN DEFAULT false,
  other_contraindications JSONB DEFAULT '{}',
  
  provider_reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals
CREATE TABLE patient_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  starting_weight DECIMAL(5,2) NOT NULL,
  target_weight DECIMAL(5,2) NOT NULL,
  target_date DATE NOT NULL,
  
  lifestyle_goals TEXT[],
  energy_mobility_goals TEXT[],
  
  daily_calorie_target INTEGER,
  weekly_exercise_minutes_target INTEGER DEFAULT 150,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Tracking Tables

```sql
-- Weight Measurements
CREATE TABLE weight_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  weight DECIMAL(5,2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'lbs',
  bmi DECIMAL(4,2),
  
  photo_url TEXT, -- Required CDC photo
  
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Other Measurements
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  waist_circumference DECIMAL(4,1),
  measurement_unit VARCHAR(10) DEFAULT 'inches',
  
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Photos
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  photo_url TEXT NOT NULL,
  photo_type VARCHAR(20), -- 'before', 'after', 'progress'
  
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food Entries
CREATE TABLE food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  meal_type VARCHAR(20) NOT NULL, -- breakfast, lunch, dinner, snack
  food_name VARCHAR(255) NOT NULL,
  portion_size VARCHAR(100),
  
  calories INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  
  photo_url TEXT,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorite Meals
CREATE TABLE favorite_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  name VARCHAR(255) NOT NULL,
  foods JSONB NOT NULL, -- Array of food items with portions
  total_calories INTEGER,
  total_protein_g DECIMAL(5,2),
  total_carbs_g DECIMAL(5,2),
  total_fat_g DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Water Intake
CREATE TABLE water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  amount_oz DECIMAL(4,1) NOT NULL,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise Activities
CREATE TABLE exercise_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  activity_type VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  intensity VARCHAR(20) NOT NULL, -- light, moderate, vigorous
  
  notes TEXT,
  
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 Education & Engagement Tables

```sql
-- Education Modules
CREATE TABLE education_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  
  module_order INTEGER,
  estimated_duration_minutes INTEGER,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Module Progress
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  module_id UUID REFERENCES education_modules(id),
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  quiz_score DECIMAL(3,2),
  quiz_attempts INTEGER DEFAULT 0,
  
  UNIQUE(patient_id, module_id)
);

-- Weekly Check-ins
CREATE TABLE weekly_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  week_number INTEGER NOT NULL,
  
  challenges TEXT[],
  motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
  goal_adjustment_needed BOOLEAN DEFAULT false,
  support_requested BOOLEAN DEFAULT false,
  
  provider_reviewed BOOLEAN DEFAULT false,
  
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-visit Questionnaires
CREATE TABLE previsit_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  appointment_id UUID, -- Future appointment system
  
  medication_side_effects JSONB DEFAULT '{}',
  progress_concerns TEXT,
  questions_for_provider TEXT[],
  goal_review TEXT,
  
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4 Gamification Tables

```sql
-- Points & Rewards
CREATE TABLE patient_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  action_type VARCHAR(50) NOT NULL, -- 'food_log', 'exercise_log', 'module_complete', etc.
  points_earned INTEGER NOT NULL,
  description TEXT,
  
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL, -- Define unlock criteria
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient Badges
CREATE TABLE patient_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  badge_id UUID REFERENCES badges(id),
  
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(patient_id, badge_id)
);
```

### 4.5 Clinical Tables

```sql
-- Lab Results
CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  
  lab_date DATE NOT NULL,
  pdf_url TEXT NOT NULL,
  
  -- Key markers for tracking
  glucose DECIMAL(5,2),
  hba1c DECIMAL(3,1),
  cholesterol_total INTEGER,
  
  uploaded_by UUID REFERENCES providers(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider Notes
CREATE TABLE provider_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  provider_id UUID REFERENCES providers(id),
  
  note_type VARCHAR(50), -- 'visit', 'general', 'plan'
  content TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medication Titrations
CREATE TABLE medication_titrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  provider_id UUID REFERENCES providers(id),
  
  medication_name VARCHAR(255) NOT NULL,
  current_dose VARCHAR(100),
  titration_schedule JSONB NOT NULL, -- [{date, dose}]
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.6 System Tables

```sql
-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Can be patient or provider
  
  type VARCHAR(50) NOT NULL, -- 'push', 'email', 'in_app', 'sms'
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  
  data JSONB DEFAULT '{}', -- Additional context
  
  read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log (HIPAA requirement)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  
  ip_address INET,
  user_agent TEXT,
  
  details JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Uploads
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  uploaded_by UUID NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'weight_photo', 'meal_photo', 'progress_photo', 'lab_pdf'
  
  storage_path TEXT NOT NULL,
  file_size_kb INTEGER,
  mime_type VARCHAR(100),
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.7 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_measurements ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)

-- Patient policies
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Providers can view their clinic's patients" ON patients
  FOR SELECT USING (
    clinic_id IN (
      SELECT clinic_id FROM providers WHERE id = auth.uid()
    )
  );

-- Weight measurement policies
CREATE POLICY "Patients can view own measurements" ON weight_measurements
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own measurements" ON weight_measurements
  FOR INSERT WITH CHECK (patient_id = auth.uid());

-- Provider access to patient data
CREATE POLICY "Providers can view patient measurements" ON weight_measurements
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE clinic_id IN (
        SELECT clinic_id FROM providers WHERE id = auth.uid()
      )
    )
  );

-- Similar policies for all other tables...
```

---

## 5\. API Endpoints {#5.-api-endpoints}

### 5.1 Authentication Endpoints

- `POST /auth/signup` \- Patient registration  
- `POST /auth/login` \- User login  
- `POST /auth/logout` \- User logout  
- `POST /auth/refresh` \- Refresh token  
- `POST /auth/forgot-password` \- Password reset request  
- `POST /auth/reset-password` \- Password reset confirm

### 5.2 Patient Endpoints

- `GET /api/patient/profile` \- Get patient profile  
- `PUT /api/patient/profile` \- Update patient profile  
- `POST /api/patient/onboarding` \- Save onboarding data  
- `GET /api/patient/dashboard` \- Dashboard data  
- `POST /api/patient/goals` \- Set/update goals

### 5.3 Tracking Endpoints

- `POST /api/tracking/weight` \- Log weight  
- `POST /api/tracking/food` \- Log food entry  
- `POST /api/tracking/water` \- Log water intake  
- `POST /api/tracking/exercise` \- Log exercise  
- `GET /api/tracking/summary` \- Daily/weekly summary

### 5.4 Provider Endpoints

- `GET /api/provider/patients` \- List patients  
- `GET /api/provider/patients/:id` \- Patient details  
- `POST /api/provider/notes` \- Add provider note  
- `GET /api/provider/reports/cdc` \- CDC report data  
- `POST /api/provider/labs/upload` \- Upload lab PDF

### 5.5 Education Endpoints

- `GET /api/education/modules` \- List modules  
- `GET /api/education/modules/:id` \- Module content  
- `POST /api/education/progress` \- Update progress  
- `POST /api/education/quiz` \- Submit quiz

### 5.6 Notification Endpoints

- `GET /api/notifications` \- List notifications  
- `PUT /api/notifications/:id/read` \- Mark as read  
- `POST /api/notifications/test` \- Test notification

---

## 6\. Security & Compliance {#6.-security-&-compliance}

### 6.1 HIPAA Compliance

- All PHI encrypted at rest (AES-256)  
- TLS 1.2+ for data in transit  
- Row Level Security on all patient tables  
- Comprehensive audit logging  
- Session timeout after 30 minutes of inactivity  
- Secure password requirements

### 6.2 Data Access Controls

- Patients can only access their own data  
- Providers can only access patients in their clinic  
- No cross-clinic data access  
- API rate limiting  
- Failed login attempt lockout

### 6.3 Audit Requirements

- Log all data access  
- Log all modifications  
- Track user sessions  
- Monitor failed access attempts  
- Weekly security reports

### 6.4 Backup & Recovery

- Daily automated backups  
- Point-in-time recovery  
- Geo-redundant storage  
- Monthly backup testing  
- Documented recovery procedures
