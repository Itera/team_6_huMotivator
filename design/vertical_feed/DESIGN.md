# Design System Documentation

## 1. Creative North Star: "The Digital Anarchy Suite"
This design system is a visual manifesto where high-octane 1980s rock aesthetic meets the rigid, sterile world of corporate productivity tools. We are moving away from the "safe" tech aesthetic of rounded corners and soft shadows. Instead, we embrace a **Retro-Future Rock** philosophy: a high-contrast, aggressive, and intentionally satirical environment. 

The system breaks the "template" look through **intentional asymmetry**, sharp **0px radii**, and a palette that vibrates against a grainy, charcoal abyss. It is designed to feel like a legendary world tour poster that has been digitized and forced to run a spreadsheet—chaotic yet meticulously controlled.

---

## 2. Colors & Surface Architecture
The palette is built on high-voltage pigments designed to "pop" against a deep, textured background.

### The Palette
- **Primary (`#ff7cf5`)**: Electric Pink. Used for high-priority calls to action and "headline" branding moments.
- **Secondary (`#c3f400`)**: Acid Yellow. Our "caution" and "utility" color, providing a sharp, high-visibility contrast.
- **Tertiary (`#c1fffe`)**: Neon Cyan. Used for futuristic accents and interactive state feedback.
- **Background (`#0e0e0e`)**: A deep, grainy charcoal that provides the "stage" for our neon elements.

### The "No-Line" Rule (Layout Sectioning)
Standard 1px borders are strictly prohibited for defining layout sections. Boundaries must be defined through:
1. **Background Shifts**: Use `surface_container_low` (#131313) against the `background` (#0e0e0e) to create structural divisions.
2. **Hard-Edge Depth**: Use a `surface_container_high` (#20201f) block to define an area of focus. 
3. **Halftone Transitions**: Use a CSS mask or background-image halftone pattern to "bleed" one section into another.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, sharp-edged plates.
- **Base Layer**: `surface_dim` (#0e0e0e).
- **Secondary Workspaces**: `surface_container` (#1a1a1a).
- **Floating Elements/Cards**: `surface_container_highest` (#262626).
- **The Glow Rule**: To move beyond flat design, use `primary` or `secondary` colors for `drop-shadow` effects (e.g., `0px 0px 20px rgba(255, 124, 245, 0.4)`). This creates a "neon tube" effect that feels premium and immersive.

---

## 3. Typography: The "Rock-Zine" Contrast
We employ a high-tension typographic pairing to drive the satirical corporate-rock vibe.

- **Display & Headlines (Epilogue)**: These should be styled as "Aggressive Editorial." Use heavy weights (700-900), tight letter-spacing (-0.05em), and all-caps for `display-lg` through `headline-sm`. This is the voice of the rock star.
- **Body & Labels (Space Grotesk)**: This is the voice of the "Futuristic Corporate Machine." It is clean, legible, and slightly technical. Use regular weights for `body-md` and `body-sm`.
- **Typographic Scale**:
    - **Display Large (3.5rem)**: Reserved for hero statements.
    - **Headline Medium (1.75rem)**: For section titles, always paired with a 4px `secondary` underline or offset glow.
    - **Label Medium (0.75rem)**: Use all-caps with wide letter-spacing (0.1em) for a "technical readout" feel.

---

## 4. Elevation & Depth
In this system, depth is a weapon. We do not use "soft" shadows to mimic natural light; we use them to mimic **stage lighting**.

- **Tonal Layering**: Elevate content by moving from `surface_container_lowest` (#000000) to `surface_bright` (#2c2c2c). 
- **The "Stage Light" Shadow**: When an element must float, use a sharp, high-offset shadow in a tinted version of `on-surface` or the element's own glow color.
- **The Ghost Border Fallback**: If a border is required for input fields or card containment, use the `outline_variant` (#484847) at **15% opacity**. The goal is a "barely-there" structural hint that doesn't break the neon-on-black immersion.
- **Glassmorphism**: For top-level navigation or modal overlays, use `surface_container` with a `backdrop-blur` of 20px and 60% opacity. This allows the neon pulses of the background to bleed through.

---

## 5. Components

### Buttons (The "Concert Ticket" Style)
- **Primary**: Sharp `0px` corners. Background is `primary` (#ff7cf5), text is `on_primary` (#580058). On hover, add a `primary_fixed_dim` neon glow.
- **Secondary**: 2px solid `secondary` (#c3f400) border. No fill. Text is `secondary`.
- **Tertiary/Ghost**: All caps `label-md`, with a `tertiary` (#c1fffe) underline that expands on hover.

### Cards & Containers
- **Forbid Dividers**: Never use horizontal lines to separate content. Use a 24px or 32px vertical gap from the spacing scale.
- **Texture**: Apply a subtle "film grain" or "halftone" SVG overlay to `surface_container` elements to give them a tactile, printed feel.

### Input Fields
- **State**: Default is a `surface_container_highest` block with a 2px bottom border of `outline`. 
- **Focus**: The bottom border transforms into a `tertiary` (#c1fffe) neon glow. 
- **Error**: Use `error` (#ff6e84) text with a "vibrating" animation effect.

### Selection Chips
- Sharp angles only. When selected, the chip should have a halftone pattern fill of `secondary_container` (#506600) to mimic a VIP backstage pass.

---

## 6. Do’s and Don’ts

### Do:
- **Use Sharp Angles**: Every corner must be `0px`. Rounding is the enemy of this system's "Rock" edge.
- **Embrace Asymmetry**: Align a headline to the far left and a CTA to the far right with significant negative space between them.
- **Use Halftone Patterns**: Apply these as subtle backgrounds to CTA sections to reinforce the "Gig Poster" heritage.

### Don't:
- **Don't use 1px Borders**: It looks "bootstrap" and cheap. Use background shifts or heavy 4px accents.
- **Don't use Pure Grey**: Always tint your neutrals. Our "black" is a deep charcoal (`#0e0e0e`) and our "white" (`#ffffff`) should be used sparingly for maximum impact.
- **Don't Center Everything**: Centered layouts feel like standard corporate templates. Lean into "unbalanced" editorial layouts that feel intentional and energetic.