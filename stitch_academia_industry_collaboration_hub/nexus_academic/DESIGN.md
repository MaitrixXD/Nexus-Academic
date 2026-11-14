---
name: Nexus Academic
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#516070'
  on-secondary: '#ffffff'
  secondary-container: '#d5e4f8'
  on-secondary-container: '#576676'
  tertiary: '#2c4bb9'
  on-tertiary: '#ffffff'
  tertiary-container: '#4865d4'
  on-tertiary-container: '#eff0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d5e4f8'
  secondary-fixed-dim: '#b9c8db'
  on-secondary-fixed: '#0e1d2b'
  on-secondary-fixed-variant: '#3a4858'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c4ff'
  on-tertiary-fixed: '#001453'
  on-tertiary-fixed-variant: '#173bab'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for an **Academia-Industry Collaboration Portal**, bridging the gap between rigorous research and commercial innovation. The brand personality is **scholarly yet agile**, combining the trustworthiness of academic institutions with the efficiency of modern enterprise.

The visual style leans into **Modern Corporate Minimalism** with **Illustrative accents**. It prioritizes extreme clarity, purposeful whitespace, and a high-trust aesthetic. By utilizing flat illustrations with clean lines, the UI remains approachable while maintaining a high level of professional gravitas. The emotional response should be one of confidence, organized potential, and seamless connectivity.

## Colors

The palette is anchored by **Scholar Blue** (#2563EB), a primary color that signifies intelligence and reliability. It is used exclusively for primary actions and essential brand accents to ensure a clear "path to completion" for users.

- **Primary**: #2563EB (Mid-blue) for high-emphasis buttons and active states.
- **Background**: #FFFFFF (Pure White) to maintain an expansive, clean feel.
- **Surface/Accents**: #DBEAFE (Light Blue) for subtle containment, borders, and secondary buttons.
- **Neutral**: #F8FAFC (Slate Tint) for backgrounds that require a slight distinction from the pure white base.
- **Text**: Use a deep navy-slate (#1E293B) for primary body text to ensure high legibility without the harshness of pure black.

## Typography

This design system utilizes **Inter** across all levels to leverage its exceptional legibility and systematic feel. 

- **Headlines**: Use heavy weights (700-800) for hero sections and page titles to establish a strong information hierarchy.
- **Body Text**: Maintain a 1.5 to 1.6 line-height ratio to ensure academic abstracts and technical descriptions are easy to parse.
- **Labels**: Small caps are discouraged; instead, use sentence case with medium or semi-bold weights for data labels and UI controls.
- **Hierarchy**: On mobile, large display type should scale aggressively to prevent horizontal overflow and maintain vertical rhythm.

## Layout & Spacing

The design system employs a **Fluid-Fixed Hybrid Grid**. The central content area is constrained to a maximum width of 1280px for optimal readability of long-form academic text, while the background and decorative elements remain fluid.

- **Grid**: A 12-column layout for desktop with 24px gutters.
- **Spacing Rhythm**: An 8px linear scale (8, 16, 24, 32, 40, 48...).
- **Margins**: Use generous 64px horizontal margins on desktop to create a "gallery" feel for the content, focusing the user's attention on the central portal interactions. On mobile, margins reduce to 16px to maximize screen real estate.

## Elevation & Depth

Visual hierarchy is primarily achieved through **Tonal Layering** rather than heavy shadows. This maintains the "clean and illustrative" requirement.

- **Level 0 (Base)**: Pure White background.
- **Level 1 (Cards)**: White surface with a 1px border in #DBEAFE and an extremely subtle, wide-spread shadow (Alpha 5%, Blur 10px).
- **Level 2 (Dropdowns/Modals)**: White surface with a more defined shadow (Alpha 10%, Blur 20px) to indicate temporary overlay.
- **Interactions**: On hover, cards may shift from a light blue border to a primary blue border (#2563EB) to indicate interactivity without changing elevation.

## Shapes

The shape language is **Softly Structured**. It avoids the informality of full pills but moves away from the harshness of sharp corners.

- **Standard Elements**: Buttons and input fields use a 0.5rem (8px) radius.
- **Containers**: Large cards and content sections use a 1rem (16px) radius to feel modern and welcoming.
- **Illustrations**: Elements within flat illustrations should follow similar rounded corner logic to ensure visual cohesion between UI and art.

## Components

### Buttons
- **Primary**: #2563EB background, white text, 8px radius. High contrast.
- **Secondary**: #DBEAFE background, #2563EB text. Used for "Save Draft" or "View Profile".
- **Ghost**: No background, #2563EB text. Used for low-priority navigation.

### Cards
Cards are the primary container for research projects and partner profiles. They feature:
- 16px rounded corners.
- 1px solid border in #DBEAFE.
- 32px internal padding for a "spacious" academic feel.
- A subtle hover state that darkens the border slightly.

### Input Fields
- White background with a #CBD5E1 border.
- On focus, the border changes to #2563EB with a 2px outer glow in #DBEAFE.

### Chips/Tags
Small, 4px rounded labels used for "Research Areas" (e.g., AI, Biotech). Use #F1F5F9 backgrounds with #475569 text for a neutral, categorized look.

### Navigation
A top-anchored bar with a 1px bottom stroke. Navigation links use `label-md` typography with an active state indicated by a 2px primary blue bottom-border.