---
name: Wanderlust Conversation
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#00b17b'
  on-tertiary-container: '#003b26'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1.25rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style
The design system embodies the warmth, hospitality, and relaxed anticipation of travel combined with the micro-gamified motivation of conversational mastery. It merges the curated visual elegance of contemporary travel platforms with the encouraging, low-anxiety progression loops of modern language acquisition.

### Target Audience & Emotional Intent
- **Audience:** Independent global travelers, weekend explorers, and adult learners seeking confidence in situational overseas spoken communication (airport check-ins, café ordering, boutique hotel requests, emergency transit).
- **Tone & Mood:** Uplifting, encouraging, approachable, and sunlit. The interface must actively eliminate performance anxiety ("stage fright" when speaking a foreign tongue) through friendly spatial breathing room, welcoming organic curvatures, and clear step-by-step progress signposts.

### Design Movement
**Tactile Warm Modernism:** A hybrid aesthetic pairing bright, functional clarity with soft dimensional depth. Elements feel touchable and thumb-crafted through generous hit areas, creamy base canvas layers, crisp white floating surfaces, pill-shaped markers, and gentle warm-tinted ambient depth that replaces clinical corporate grays with holiday warmth.

## Colors
The color architecture relies on a luminous tripartite harmony: daylight sky, sun-drenched coral, and warm beach sand.

### Palette Architecture
- **Primary (`#0EA5E9` - Sky Horizon):** Represents expansive skies, international flight connections, and structural navigation headers. Used for primary step markers, lesson track accents, and audio waveform tracks.
- **Secondary / CTA (`#F97316` - Radiant Coral):** High-energy conversational action. Reserved strictly for vital interactive moments: the primary push-to-talk microphone button, "Continue/Next Step" triggers, and active speech recording rings.
- **Tertiary / Success (`#10B981` - Emerald Palm):** Indicates phrase mastery, native-like pronunciation accuracy, and completion checkmarks.
- **Warning / Needs Practice (`#F59E0B` - Sunlit Amber):** Warm, supportive coaching cues for words needing repeat practice; avoids harsh punitive reds.
- **Canvas & Background (`#FFFBEB` / `#FEF9EE` - Warm Sand):** The foundational backdrop across all screens. Replaces sterile cool white with a serene resort-like cream.
- **Surface Elevation (`#FFFFFF` - Chalk White):** Dedicated card surfaces floating over the warm sand canvas to ensure high typographic legibility.
- **Text & Hierarchy (`#0F172A`, `#1E293B`, `#334155` - Deep Ink Slate):** Provides crisp contrast across dual-language typography (Traditional Chinese glyphs and Latin alphabets).

## Typography
Typography balances geometric warmth with clear glyph parsing. Plus Jakarta Sans handles Latin numbers, phonetics, and English phrases with friendly, humanist openness.

### CJK Fallback Integration
All font stacks map sequentially: `Plus Jakarta Sans`, `'Noto Sans TC'`, `'PingFang TC'`, `'Microsoft JhengHei'`, `sans-serif`. Traditional Chinese characters inherit line-height metrics smoothly without vertical jitter or clipping. 

### Typographic Rules
- **Dual-Language Juxtaposition:** English target phrases render with `fontWeight: 700`, while the native Traditional Chinese translation directly beneath renders with `body-md` in `fontWeight: 400` with slate tint (`#334155`).
- **Phonetics & IPA Guidance:** Accompanying romanization or pronunciation guides use `label-md` uppercase with `0.03em` tracking in secondary slate (`#64748B`).
- **Numerals:** Currency conversions and score metrics use `display-lg` tabular figures for alignment clarity during rapid speech feedback.

## Layout & Spacing
The layout model prioritizes mobile ergonomics, maintaining an easy "one-thumb hot-zone" at the bottom screen quadrant for interactive conversation sessions.

### Grid & Structure
- **Mobile (Phone Viewport < 640px):** Single-column fluid container with `1.25rem` outer canvas padding (`margin`). Sticky bottom toolbar anchors conversation triggers.
- **Tablet / Split View (640px – 1024px):** 6-column fluid grid, `1.5rem` gutters. Accommodates two-pane conversational layouts (scenario dialogue scenario on the left, active practice pad on the right).
- **Desktop (1024px+):** Centered max-width shell (`768px` for focused learning mode, `1120px` for course exploration) nested in an expansive warm sand field.

### Rhythm
Components follow an 8pt architectural rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 36px). Vertical flow within scenario cards enforces comfortable spacing between the native prompt, English target, and user response bubbles.

## Elevation & Depth
Elevation mimics sunlit morning terraces. Rather than neutral gray drop-shadows, this design system deploys multi-layered, amber-tinted ambient diffusion.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Flat `#FFFBEB` sand canvas. No shadow.
- **Level 1 (Scenario Cards & List Tiles):** Pure `#FFFFFF` surface resting on the canvas. 
  - `box-shadow: 0 4px 16px -2px rgba(217, 119, 6, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`
- **Level 2 (Active Dialogue Bubbles & Sticky Controls):**
  - `box-shadow: 0 10px 25px -4px rgba(217, 119, 6, 0.10), 0 4px 10px -2px rgba(15, 23, 42, 0.05)`
- **Level 3 (Interactive Mic Trigger & Modal Overlays):**
  - `box-shadow: 0 20px 35px -5px rgba(249, 115, 22, 0.28), 0 8px 16px -4px rgba(15, 23, 42, 0.08)`
  - Adds a warm, energized glow directly derived from the Coral Orange accent.

## Shapes
The shape language uses ultra-friendly, pebble-like organic radii. Sharp ninety-degree corners are entirely absent to minimize friction and psychological intimidation.

### Geometry Specifications
- **Interactive Action Buttons & Badges:** Full pill-shapes (`border-radius: 9999px`) to denote quick tap actions and lightweight categories.
- **Primary Content Cards:** `1.5rem` (`24px` / `rounded-2xl`) outer perimeter with `1rem` (`16px`) inner nested elements, maintaining clean concentricity.
- **Speech Bubbles:** Asymmetric curvature where incoming speaker bubbles have a flattened bottom-left corner (`rounded-2xl rounded-bl-sm`) and user voice bubbles feature a flattened bottom-right corner (`rounded-2xl rounded-br-sm`).

## Components

### Buttons & Action Triggers
- **Push-to-Talk Microphone (Primary Action Hero):** An oversized 76px round button rendered in Coral Orange (`#F97316`) with Level 3 elevation. During voice input, it transitions to a dynamic double-ring pulsing radar halo (`rgba(249, 115, 22, 0.25)`).
- **Secondary Navigation Buttons:** Clean Chalk White (`#FFFFFF`) with a subtle 1px border (`#E2E8F0`) and `space-md` padding, providing neutral exit routes or audio playback options.

### Chips & Badges
- **Pill Badges:** Rendered in low-saturation tinted pills with crisp saturated text (e.g., Sky Blue tint `rgba(14, 165, 233, 0.12)` with `#0284C7` text).
- **Feedback Tags:** Emerald Green badge (`#10B981` bg, white text) for "Native Fluency" score; Amber badge (`#F59E0B` bg, white text) for "Review Vowels".

### Stepper Navigation (1 Briefing > 2 Roleplay > 3 Feedback)
- Anchored at the top header with a connecting 3px track.
- **Inactive Step:** Low-contrast slate circle (`#CBD5E1`) with small label.
- **Active Step:** Primary Sky Blue badge (`#0EA5E9`) with an animated ring and bold step description.
- **Completed Step:** Emerald teal check icon (`#10B981`) validating task progression.

### Dialogue Cards & Input Practice Areas
- **Roleplay Conversation Card:** Floating pure-white card with a top contextual avatar pill (e.g., "Customs Officer", "Barista"), large target sentence, and an inline audio button for listening to pronunciation samples.
- **Phonetic Waveform Area:** Sand-accented audio container (`#FEF3C7`) with rounded vertical bars that animate during recording.

### Checkboxes, Radio Controls, & Selectors
- Selection tiles feature an oversized card form factor with an embedded circular checkmark. Upon selection, the card transitions from neutral border to a 2px Sky Blue border with an inner tint (`rgba(14, 165, 233, 0.04)`).