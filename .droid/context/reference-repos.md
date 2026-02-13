# Reference Repositories

External repos to reference for different parts of OHW app development.

---

## Food Scanning

### Forklife
- **URL:** https://github.com/Ynniss/forklife
- **Use For:** Food product scanning and nutrition tracking
- **Stack:** Kotlin, Jetpack Compose, Material 3, CameraX, ML Kit Barcode
- **Key Features:**
  - Real-time barcode scanning with CameraX
  - OpenFoodFacts API integration (no auth required)
  - Nutri-Score and Eco-Score display
  - Allergen alerts system (14 common allergens)
  - Scan history with Room database
  - Material You theming (3 color schemes + dark mode)
  - In-app review integration

**Relevant Patterns:**
- `BarcodeAnalyzer.kt` - ML Kit barcode processing
- `ScanScreen.kt` - CameraX with Compose wrapper, Yuka-style overlay
- `OpenFoodFactsRepository.kt` - Food API integration
- `AllergenChecker.kt` - Allergen detection logic
- `DataStoreManager.kt` - User preferences persistence

**Architecture:**
- Clean Architecture with SOLID principles
- Dagger Hilt dependency injection
- Single-activity Compose navigation
- Repository pattern for data layer

**Integration Notes:**
- Could adapt for OHW nutrition logging
- Allergen system maps to dietary restrictions
- Product info connects to meal/food tracking nodes in Journey Map

---

## Game Camera (TBD)

*Need reference repo for Phaser camera controls (pan, zoom, mobile gestures)*

---

## Asset Generation

### Nano Banana Builder
- **Source:** Claude Code skill (not a GitHub repo)
- **Use For:** Gemini image generation for sprites
- **Key Patterns:** See `.droid/context/learnings.md` for full details

---

*Last updated: 2026-02-04*
