# OHW Design Tokens (Extracted from Figma)

## Source
Figma File: `DDIpRwZyK7uCHtl2RBXs6Y` (OHW Patient UI)

---

## Colors

### Backgrounds
```css
--bg-primary: #f7f7f7;
--bg-white: #ffffff;
--bg-card: #ffffff;
```

### Text
```css
--text-primary: #0a0a0a;
--text-secondary: #8c8c8c;
--text-muted: #bfbfbf;
```

### Accent Colors
```css
--accent-blue: #0a84ff;
--accent-red: #d21737;
--accent-yellow: #d2bd17;
--accent-gold: #ffb200;
--accent-teal: #00b3a7;  /* Rank badge */
```

### UI Elements
```css
--border-light: rgba(10, 10, 10, 0.07);
--progress-track: #f4f4f4;
```

---

## Typography

### Font Family
```css
font-family: 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Weights
```css
--font-bold: 700;      /* SF Pro Bold */
--font-semibold: 600;  /* SF Pro Semibold */
--font-medium: 500;    /* SF Pro Medium */
--font-regular: 400;   /* SF Pro Regular */
```

### Font Sizes
```css
--text-3xl: 30px;   /* Large numbers (1,280 kcal) */
--text-2xl: 26px;   /* Screen titles (Tue, Feb 14) */
--text-xl: 18px;    /* Section headers (Daily Plan) */
--text-lg: 16px;    /* Body text */
--text-base: 14px;  /* Captions, labels */
--text-sm: 13px;    /* Tab labels */
--text-xs: 10px;    /* Chart labels */
```

### Letter Spacing
```css
--tracking-tight: -0.6px;   /* Large text */
--tracking-normal: -0.48px; /* Body */
--tracking-wide: -0.42px;   /* Captions */
```

---

## Spacing

### Screen Layout
```css
--screen-padding-x: 20px;
--section-gap: 20px;
--card-gap: 12px;
```

### Card Internals
```css
--card-padding: 20px;
--card-padding-sm: 16px;
--content-gap: 16px;
--content-gap-sm: 8px;
```

---

## Borders & Radius

### Border Radius
```css
--radius-card: 30px;
--radius-card-sm: 25px;
--radius-button: 100px;  /* Pill buttons */
--radius-progress: 100px;
--radius-avatar: 100px;
--radius-screen: 45px;   /* iPhone corners */
```

### Shadows
```css
--shadow-card: 
  0px 24px 7px 0px rgba(122, 49, 0, 0),
  0px 15px 6px 0px rgba(122, 49, 0, 0.01),
  0px 9px 5px 0px rgba(122, 49, 0, 0.03),
  0px 4px 4px 0px rgba(122, 49, 0, 0.04),
  0px 1px 2px 0px rgba(122, 49, 0, 0.05);
```

---

## Components

### Bottom Navigation
- Height: 100px (with gradient fade)
- 5 tabs, equal width
- Icon size: 28x28px
- Label size: 13px
- Active color: `#0a0a0a`
- Inactive color: `#8c8c8c`
- Gap between tabs: 22px

### Cards
- Background: white
- Border radius: 30px
- Padding: 20px
- Shadow: see above
- Overflow: clip

### Progress Bars
- Track: `#f4f4f4`
- Height: 6px
- Border radius: 100px
- Fill colors vary by type (blue, red, yellow)

### Circular Progress
- Stroke width: ~8px
- Size: 160px (large), 60px (small)
- Track: light grey with gradient
- Fill: orange gradient

### Buttons
- Primary: `#0a0a0a` background, white text
- Pill shape: `rounded-[100px]`
- Icon buttons: 40x40px circle

---

## Tailwind Classes (Ready to Use)

### Card
```html
<div class="bg-white rounded-[30px] p-[20px] shadow-[0px_24px_7px_0px_rgba(122,49,0,0),0px_15px_6px_0px_rgba(122,49,0,0.01),0px_9px_5px_0px_rgba(122,49,0,0.03),0px_4px_4px_0px_rgba(122,49,0,0.04),0px_1px_2px_0px_rgba(122,49,0,0.05)] overflow-clip">
```

### Section Title
```html
<p class="font-['SF_Pro:Bold',sans-serif] text-[18px] text-[#0a0a0a] tracking-[-0.36px] leading-none">
```

### Body Text
```html
<p class="font-['SF_Pro:Medium',sans-serif] text-[16px] text-[#0a0a0a] tracking-[-0.48px] leading-none">
```

### Caption
```html
<p class="font-['SF_Pro:Medium',sans-serif] text-[14px] text-[#8c8c8c] tracking-[-0.42px] leading-[1.1]">
```

---

## Bottom Navigation Reference

Journey Map will replace "Progress" tab and move to CENTER position:

```
Current:  Home | Log Meal | Fitness | Education | Progress
New:      Home | Log Meal | Journey | Education | Profile (?)
```

Or alternative:
```
Current:  Home | Log Meal | Fitness | Education | Progress  
New:      Home | Log Meal | 🗺️ Map | Fitness | Education
```

Progress page content will be accessible via button INSIDE Journey Map.
