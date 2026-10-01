---
name: Midnight Fluency
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#ffb5a0'
  on-tertiary: '#5f1500'
  tertiary-container: '#b33000'
  on-tertiary-container: '#ffd1c5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a0'
  on-tertiary-fixed: '#3b0900'
  on-tertiary-fixed-variant: '#862200'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-xl:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
  phonetic-display:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system blends the gamified momentum of contemporary habit-building apps with the serene, mindful focus of wellness spaces. Engineered specifically for Taiwanese English learners navigating nuanced spoken phonetics and tonal shifts, the aesthetic balances playful confidence with high-end digital precision.

The style pairs a rich midnight backdrop with radiant, purposeful light accents. Clean tactile surfaces, softly glowing feedback states, and deliberate biometric cues reduce speaking anxiety, converting micro-moments of hesitation into continuous, encouraging momentum. Traditional Chinese typography commands balanced presence alongside Western phonetic notations, projecting clarity, focus, and warmth throughout all interfaces.

## Colors

The palette operates in a dark visual architecture designed to alleviate ocular fatigue during late-night study sessions while allowing chromatic feedback to pop instantly.

- **Primary Brand Foundations:** Deep Indigo (`#4F46E5`) anchors the application's core identity, supported by Indigo Light (`#6366F1`) for interactive focus states and Indigo Glow (`#818CF8`) for soft radial emissions behind active controls.
- **Surface Architecture:** Depth is constructed via a calibrated charcoal-to-slate hierarchy. Core canvas base is absolute night (`#0B0F19`), rising to Surface Base (`#111827`), Card/Container (`#1F2937`), and Elevated Modals (`#374151`).
- **Phonetic & Accuracy Accents:** Positive feedback harnesses Electric Green (`#22C55E`) and Vibrant Emerald (`#10B981`) for mastered utterances and 90%+ pronunciation accuracy. Warning and review-needed states deploy Warm Amber (`#F59E0B`) and Coral Red (`#EF4444`).
- **Streak & Energy Accents:** Daily streaks, XP, and dynamic motivation loops glow with Flame Orange (`#FF5722`) and Sunburst Yellow (`#FBBF24`).
- **Typography & Structural Contrast:** Primary readability is sustained with Crisp White (`#F9FAFB`), mid-level labels with Muted Gray (`#9CA3AF`), and supporting tertiary meta-details with Subtitle Gray (`#6B7280`).

## Typography

The typographic hierarchy accommodates dual-script dynamics: Traditional Chinese (繁體中文) glyph densities alongside Latin script and International Phonetic Alphabet (IPA) standards.

Headlines leverage **Plus Jakarta Sans** for optimistic, energetic curvature that softens technical practice drills. Body copy, UI labels, and phonetics use **Inter** for optical clarity, neutral counters, and comprehensive glyph compatibility with standard IPA notation (`/æ/`, `/θ/`, `/ð/`, `/ʃ/`). 

Chinese strings must retain generous line-height buffers (+20% to +30% over standard Latin prose) to avoid visual crowding in ideographic characters. Phonetic symbols are treated with dedicated tracking and medium font weights to eliminate stroke ambiguity during pronunciation challenges.

## Layout & Spacing

Layout execution relies on a mobile-first 4-column fluid layout with an edge safety margin of `1.25rem` (`20px`) and column gutters of `1rem` (`16px`). For tablets and desktop viewports, content max-width is strictly constrained to `480px` centered to maintain thumb reachability, conversational intimacy, and focused vertical rhythm.

Vertical rhythm adheres strictly to an 8-point mathematical cadence. Micro gaps between related phonetic labels and characters use `space-xs` (`4px`) and `space-sm` (`8px`). Component interior padding standardizes on `space-md` (`16px`) for cards and `space-lg` (`24px`) for primary hero practice zones. A dedicated bottom clearance safe-area of `5.5rem` (`88px`) is permanently reserved across scrolling views to ensure interactive elements never collide with floating audio triggers or the global navigation dock.

## Elevation & Depth

Visual hierarchy abandons traditional muddy dropshadows in favor of luminescent tonal layering and luminous colored edge-glows.

- **Level 0 (Canvas Base):** Flat `#0B0F19` void, no shadow or border.
- **Level 1 (Structural Cards & Modules):** Surface `#1F2937` with an inner hairline highlight: `1px solid rgba(255, 255, 255, 0.06)`. This imparts crisp structural definition against dark layers without visual clutter.
- **Level 2 (Active/Floating Elements):** Elevated `#374151` with diffused directional back-lighting. When a card is active or correctly answered, it radiates a calibrated accent shadow: `0 8px 24px -4px rgba(79, 70, 229, 0.35)` or `0 8px 24px -4px rgba(34, 197, 94, 0.35)`.
- **Level 3 (Overlays & Dialogs):** `#1F2937` with `90%` opacity applied over a `backdrop-blur(16px)` layer, framed by `1px solid rgba(255, 255, 255, 0.12)`.

## Shapes

The design system employs an ultra-friendly, organic corner strategy (`roundedness: 3`).

Interactive controls, phonetic token chips, and voice input anchors embody fluid pill shapes (`border-radius: 9999px`). Container panels, quiz dialogue frames, and practice cards feature generous radiuses of `1.5rem` to `2rem` (`rounded-lg` and `rounded-xl`). This tactile curvature counters the technical precision of speech visualization, rendering the interface inviting, accessible, and low-friction for daily micro-learning sessions.

## Components

### Floating Mic Trigger (Core Voice Anchor)
- **Geometry:** `72px` circular floating action trigger fixed at the thumb-accessible bottom center.
- **States:** Idle presents a rich gradient from `#4F46E5` to `#6366F1` with an inner white icon. Active recording emits an animated, double-layered concentric pulse wave using `#818CF8` at `30%` and `15%` opacity. Successful capture flashes `#22C55E` accompanied by soft haptic feedback.

### Audio Waveform Visualizer
- **Visuals:** Minimum 24 dynamic vertical bars with pill tips, dynamic height ranging from `4px` to `48px`.
- **Coloring:** Inactive bars render in `#374151`. Real-time audio stream transforms bars into vibrant gradients of `#818CF8` scaling dynamically to `#22C55E` at peak clarity volume thresholds.

### Response Chips & Phoneme Selectors
- **Geometry:** Full pill contour, minimum tap target `44px` height, horizontal padding `space-md` (`16px`).
- **Resting:** Background `#1F2937`, border `1px solid rgba(255, 255, 255, 0.08)`, text `#F9FAFB`.
- **Selected/Pressed:** Smooth transition to `#4F46E5`, text `#FFFFFF`, accompanied by an ambient indigo aura (`0 4px 16px rgba(79, 70, 229, 0.4)`).
- **Phoneme Badges:** Distinct mini-pills displaying IPA notations (`/ɪ/`, `/iː/`) set in `phonetic-display` with subtle tinted backgrounds (`rgba(99, 102, 241, 0.15)`).

### Interactive Practice Cards
- **Geometry:** `rounded-xl` (`24px`), background `#1F2937`, interior padding `space-lg`.
- **States:** Correct selection triggers a `2px` stroke transition to `#22C55E` with an Emerald highlight; incorrect responses transition smoothly to `#EF4444` with a restrained horizontal shake sequence.

### Glowing Progress Rings & Streak Counters
- **Progress Indicator:** SVG circular meter using a track background of `#374151` and active progress stroke of `#22C55E` or `#4F46E5`, capped with rounded endpoints and a radial glow filter at the head.
- **Streak Pill:** Compact pill badge with Flame Orange background tint (`rgba(255, 87, 34, 0.15)`), dynamic Flame icon, and Sunburst Yellow (`#FBBF24`) numerical text.

### Bottom Navigation Bar
- **Architecture:** Frosted floating dock anchored `16px` above the screen edge, styled with `#111827` at `85%` opacity, `backdrop-blur(20px)`, and a subtle hairline border (`1px solid rgba(255, 255, 255, 0.08)`).
- **Iconography:** Inactive items rely on `#6B7280`; active tab triggers an illuminated transition to `#818CF8` with an under-slung `4px` glowing dot indicator.