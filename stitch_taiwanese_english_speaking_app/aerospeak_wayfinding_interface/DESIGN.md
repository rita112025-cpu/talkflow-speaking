---
name: AeroSpeak Wayfinding Interface
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
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#785a00'
  on-secondary: '#ffffff'
  secondary-container: '#fdc425'
  on-secondary-container: '#6d5200'
  tertiary: '#00311f'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a31'
  on-tertiary-container: '#27c38a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#ffdf9a'
  secondary-fixed-dim: '#f7be1d'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-code-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.06em
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
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

This design system translates the high-clarity, high-assurance aesthetic of international transit hubs into an intuitive, spoken-English scenario training platform. The target audience includes ESL professionals, international travelers, and flight attendants who must communicate clearly under time-sensitive, high-cognitive-load conditions (gate changes, passport control, customs inspections, and baggage claims).

The visual language marries Swiss wayfinding precision with the tactile, high-utility typography of Flight Information Display Systems (FIDS). The interface evokes precision, composure, and directional authority. Surfaces mimic crisp boarding passes, matte departure monitors, and gate stanchions—eliminating visual clutter while providing clear structural signposts.

## Colors

The palette directly references the functional signaling of world-class transit terminals:

- **Primary Terminal Blue (`#1E3A8A`)**: Represents authoritative wayfinding signage, overhead gate trusses, and navigational headers. Serves as the primary surface for scenario prompts and mission-critical context.
- **Flight Board Amber (`#EAB308` / `#FACC15`)**: Directly sampled from electro-mechanical flipboards and LED gate boards. Used exclusively for actionable targets, real-time speech activity warnings, active audio indicators, and key flight alerts.
- **Runway Clearance Emerald (`#10B981`)**: Denotes positive pronunciation scores, on-time gate arrivals, accepted visa responses, and speech comprehension success states.
- **Runway Red Alert (`#EF4444`)**: Reserved for critical speech mispronunciations, missed departures, and boarding denial triggers.
- **Ground & Tarmac Slate (`#F8FAFC` to `#FFFFFF`)**: The pristine backdrop reminiscent of polished terrazzo floors and matte gate desk surfaces. Neutral borders use `#E2E8F0` and `#CBD5E1` to mimic crisp paper ticket edges and perforated boarding pass notches.
- **Deep Navy Ink (`#0F172A`)**: The primary text color, delivering maximum contrast against slate surfaces.

## Typography

The type scale combines **Plus Jakarta Sans** for natural, legible human interactions with **JetBrains Mono** for flight identifiers, alphanumeric gate codes, seat tags, and speech confidence readouts.

- **Human-Centric Dialogue**: All dialogue prompts, agent speech lines, and instructional grammar hints are rendered in Plus Jakarta Sans to foster natural conversational cadence.
- **Flight & Telemetry Data**: Gate codes (`GATE B24`), Flight IDs (`CX-882`), UTC timestamps, and acoustic decoding percentages are strictly assigned to JetBrains Mono with generous uppercase tracking (`0.04em`–`0.08em`) to mirror backlit departure monitors.

## Layout & Spacing

This mobile-first portrait layout operates on an authoritative 4-column grid (gutter: `1rem`, horizontal canvas margin: `1.25rem`), keeping content strictly within safe thumb-reach zones.

- **Header / Wayfinding Band**: The top zone houses high-contrast terminal navigation and scenario progress indicators (e.g., `CHECK-IN > SECURITY > IMMIGRATION`).
- **Interactive Stacking Zone**: The primary viewport middle section is allocated to dynamic boarding pass scenario tickets, dialogue cards, and speaker frequency visualizations.
- **Control Baseplate**: The bottom `160px` of the mobile canvas is anchored by the persistent push-to-talk mic array, accessible comfortably with one thumb.
- **Spacing Rhythm**: Spacing scales on a rigid 4px/8px module. Micro-elements like tag badges stay tight (`space-xs` to `space-sm`), while stacked scenario modules leverage `space-md` (`1rem`) to keep the visual rhythm disciplined and legible.

## Elevation & Depth

Visual hierarchy uses crisp, mechanical layering rather than soft, diffuse drop shadows.

- **Boarding Pass Cutouts & Ghost Borders**: Cards utilize a hairline outline (`1px solid #CBD5E1`) paired with subtle top-to-bottom tactile separation (`0 2px 4px -1px rgba(15, 23, 42, 0.06)`).
- **Physical Perforations**: Ticket cards feature a perforated dashed divider (`border-top: 2px dashed #CBD5E1`) flanked by negative semi-circular cutouts on the left and right card edges to evoke physical boarding stubs.
- **Backlit Terminal Overlays**: Active sound monitors and ambient airport speaker panels use dark slate backgrounds (`#0F172A`) with high-contrast amber foreground text, creating the visual impression of glowing digital flight displays.
- **Interactive Lift**: Pressed buttons and the Push-to-Talk module descend along the vertical axis (0 translation with an inset border highlight) to simulate physical toggle switches found on ground control equipment.

## Shapes

The interface embraces crisp, industrial form factors (`roundedness: 1`, baseline radius: `4px` with `8px` for outer card perimeters). 

- **Cards & Scenario Panes**: Bound by a precise `8px` (`rounded-lg`) corner radius, maintaining an architectural, paper-stub profile.
- **Badges & Flight Tags**: Use a tight `4px` corner radius or clean rectangular profiles with chamfered borders.
- **Interactive Audio Controls**: The lone exception to the low-roundedness rule is the Push-to-Talk activation trigger, which uses a full circular geometry (`rounded-full`) to clearly signal touch interaction and immediate tactile affordance.

## Components

### Flight Ticket & Boarding Pass Cards
- **Structure**: A two-tier card layout. The upper segment presents flight scenario metadata (e.g., `FLIGHT: BA-178`, `SEAT: 14A`, `STATUS: BOARDING GATE 22`) in JetBrains Mono. The lower stub holds conversation prompts and target vocabularies.
- **Divider**: A horizontal dashed border (`2px dashed #94A3B8`) with circular punch-outs (radius: `8px`) positioned on the card’s outer edge at the seam.
- **Barcode & Accents**: A decorative vector or CSS barcode motif sits alongside a high-contrast airline destination code (`LHR -> JFK`).

### Push-to-Talk (PTT) Mic Module
- **Primary Control**: A central `76px × 76px` circular button finished in Deep Navy (`#1E3A8A`) with an amber mic icon.
- **Active State**: When held, a dual-ring radar ripple animates outward using Amber (`#FACC15` at 30% opacity) accompanied by an acoustic waveform.
- **Feedback Indicator**: Direct state text (`TRANSMITTING...` / `RELEASE TO CONFIRM`) displayed in `label-code-sm` immediately above the mic button.

### Airport Announcement Audio Bars
- **Style**: Mimics overhead PA speaker displays. A dark slate container (`#0F172A`) encasing dynamic animated sound bars.
- **Paging Chime Cue**: Features a speaker icon paired with a visual chime notification: `ALL PASSENGERS FOR FLIGHT AC-882 PLEASE PROCEED...` styled in high-visibility Amber (`#FACC15`).

### Status Badges & Gate Chips
- **Chips**: Compact rectangular badges with `4px` corners.
- **Color Coding**:
  - `ON TIME / CLEARED`: Green surface (`#ECFDF5`), dark emerald text (`#047857`), green border (`#A7F3D0`).
  - `DELAYED / ATTENTION`: Amber surface (`#FEFCE8`), dark amber text (`#A16207`), amber border (`#FEF08A`).
  - `GATE CLOSED / MISSED`: Red surface (`#FEF2F2`), red text (`#B91C1C`), red border (`#FECACA`).

### Dialogue Input & Speech Recognition Fields
- **Response Fields**: Crisp white inputs framed by `1.5px` border in `#CBD5E1`.
- **Active Listening Field**: Border transitions to solid Deep Navy (`#1E3A8A`) with a pulsing amber caret, transcribing recognized English phonemes in real time with high visual contrast.