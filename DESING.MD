# DESIGN.md
# University Website Design System
## Theme: Amethyst Purple – Bright Gold – Modern University

---

## 1. Design Concept

The website uses a modern university design concept inspired by the identity of the University of Phayao, combining Amethyst Purple and Bright Gold to create a professional, elegant, trustworthy, and contemporary visual experience.

### Design Keywords
- Modern University
- Professional & Academic
- Minimal and Clean
- Elegant
- Accessible
- User-Friendly
- Consistent Design

### Design Principles
1. **Clarity:** Present information clearly and make navigation easy.
2. **Consistency:** Maintain consistent colors, typography, spacing, and components.
3. **Accessibility:** Ensure sufficient color contrast and readable text.
4. **Simplicity:** Avoid unnecessary decoration and visual clutter.
5. **Responsiveness:** Support desktop, tablet, and mobile devices.

---

## 2. Color Palette

The design system supports Light Mode and Dark Mode.

### 2.1 Light Mode – Amethyst Purple & Bright Gold

The Light Mode is the primary theme. It emphasizes a bright, clean, professional, and welcoming university atmosphere.

| Color Name | Hex Code | Usage |
|---|---|---|
| Background | `#F4F2F8` | Main page background |
| Primary Purple | `#4D238D` | Primary buttons, navigation, headings |
| Accent Gold | `#D6A83F` | Highlights, icons, decorative accents |
| Surface | `#FFFFFF` | Cards, panels, modal backgrounds |
| Secondary Surface | `#EAE5F2` | Secondary sections and containers |
| Primary Text | `#241B32` | Main text |
| Secondary Text | `#6F687A` | Supporting text |
| Border | `#DED8E8` | Dividers and component borders |

### 2.2 Dark Mode – Deep Amethyst & Soft Gold

The Dark Mode uses a deep purple-black background with brighter purple and gold accents to create a sophisticated and comfortable viewing experience.

| Color Name | Hex Code | Usage |
|---|---|---|
| Background | `#100D1C` | Main page background |
| Primary Purple | `#9364DF` | Primary buttons, links, active states |
| Accent Gold | `#F0C96D` | Highlights, icons, decorative accents |
| Surface | `#1C172A` | Cards and panels |
| Secondary Surface | `#272038` | Secondary sections and containers |
| Primary Text | `#F5F1FC` | Main text |
| Secondary Text | `#B8AEC9` | Supporting text |
| Border | `#393047` | Dividers and component borders |

### 2.3 Color Usage Guidelines

- Purple is the primary brand color and should be used consistently.
- Gold is an accent color and should not dominate large areas.
- Background colors should maintain a clear visual hierarchy.
- White and dark surfaces should be used to separate content sections.
- Avoid using too many saturated colors in one section.
- Ensure sufficient contrast between text and background.

Recommended color proportions:
- 60% Background and neutral surfaces
- 30% Purple and supporting colors
- 10% Gold accents

---

## 3. Typography

Use modern, readable typography suitable for both Thai and English content.

### Recommended Fonts
- Thai: Sarabun
- English: Inter

### Typography Scale

| Element | Desktop | Mobile | Weight |
|---|---:|---:|---|
| H1 | 36–48px | 28–32px | 700 |
| H2 | 28–32px | 24–28px | 700 |
| H3 | 22–24px | 20–22px | 600 |
| H4 | 18–20px | 18px | 600 |
| Body | 16px | 14–16px | 400 |
| Small Text | 14px | 12–14px | 400 |
| Caption | 12px | 12px | 400 |

### Typography Guidelines
- Use clear heading hierarchy.
- Maintain comfortable line spacing.
- Avoid excessively small text.
- Use bold typography only for important information.
- Keep paragraph widths readable.

---

## 4. Layout and Spacing

Use a consistent spacing system based on 8px increments.

| Token | Value |
|---|---:|
| XS | 4px |
| SM | 8px |
| MD | 16px |
| LG | 24px |
| XL | 32px |
| 2XL | 48px |
| 3XL | 64px |
| 4XL | 80px |

### Layout Guidelines
- Use a centered content container.
- Recommended maximum content width: 1200px.
- Maintain consistent horizontal and vertical spacing.
- Avoid overcrowding content.
- Use whitespace to improve readability.
- Ensure layouts adapt to different screen sizes.

---

## 5. UI Components

### 5.1 Navigation Bar
- Use Purple as the main brand identity.
- Display the university logo clearly.
- Provide clear navigation labels.
- Highlight the active navigation item.
- Support responsive navigation on mobile.

### 5.2 Buttons

**Primary Button**
- Background: Primary Purple
- Text: White
- Border Radius: 8px
- Hover: Slightly darker purple

**Secondary Button**
- Background: Transparent or Surface
- Text: Primary Purple
- Border: 1px solid Primary Purple

**Accent Button**
- Background: Gold
- Text: Dark Purple
- Use for important secondary actions only.

### 5.3 Cards
- Background: Surface
- Border Radius: 12px
- Border: 1px solid Border
- Padding: 24px
- Use subtle shadows when necessary.
- Maintain consistent card heights within the same row when appropriate.

### 5.4 Input Fields
- Background: Surface
- Text: Primary Text
- Border: Border
- Border Radius: 8px
- Focus: Primary Purple
- Provide clear labels and validation messages.

### 5.5 Badges and Status
Use semantic colors for status indicators:
- Success: Green
- Warning: Amber
- Error: Red
- Information: Blue

Do not rely on color alone to communicate status. Include text or icons.

---

## 6. Dark Mode and Light Mode

The website must support both themes.

### Theme Requirements
- Provide a theme toggle.
- Use the same layout and component structure in both modes.
- Switch colors through CSS variables.
- Maintain readable text contrast.
- Avoid pure black backgrounds.
- Avoid excessively bright gold backgrounds in Dark Mode.
- Remember the user's theme preference when appropriate.

---

## 7. Icons and Imagery

### Icons
- Use consistent icon styles.
- Prefer Lucide Icons.
- Use simple and recognizable icons.
- Maintain consistent icon sizes.

Recommended sizes:
- Small: 16px
- Medium: 20px
- Large: 24px
- Extra Large: 32px

### Imagery
- Use high-quality university-related photographs.
- Prioritize campus, academic buildings, students, learning environments, and university activities.
- Maintain consistent image proportions.
- Use appropriate image overlays when text is placed over photographs.
- Avoid excessive gradients and decorative effects.

---

## 8. Interaction and Animation

Use subtle animations to enhance the user experience.

### Recommended Effects
- Smooth hover transitions.
- Subtle button feedback.
- Gentle card hover effects.
- Smooth dropdown transitions.
- Clear active navigation states.
- Loading indicators for asynchronous actions.

### Animation Guidelines
- Keep animations between 150–300ms for common interactions.
- Avoid excessive motion.
- Respect the user's reduced-motion preferences.
- Never allow animation to interfere with readability or usability.

---

## 9. Responsive Design

The website must support the following screen sizes:

| Device | Width |
|---|---|
| Mobile | 320–767px |
| Tablet | 768–1023px |
| Desktop | 1024–1439px |
| Large Desktop | 1440px and above |

### Responsive Requirements
- Navigation must adapt to mobile screens.
- Cards should stack vertically on smaller screens.
- Tables must remain usable on mobile.
- Images must scale proportionally.
- Buttons must have touch-friendly dimensions.
- Prevent horizontal overflow.

---

## 10. Accessibility

Follow WCAG 2.2 AA accessibility principles where applicable.

- Provide sufficient text contrast.
- Use semantic HTML elements.
- Provide accessible labels for form controls.
- Ensure keyboard navigation.
- Provide visible focus indicators.
- Add alternative text to meaningful images.
- Do not use color as the only indicator of information.
- Support reduced motion.

---

## 11. Technical Implementation

Use only the following technologies for the design and frontend implementation:

- HTML5
- CSS3
- Vanilla JavaScript

### Implementation Rules
- Do not use React, Vue, Angular, or other frontend frameworks.
- Do not use Tailwind CSS or Bootstrap.
- Do not require a build system.
- Use modular and reusable CSS.
- Separate HTML, CSS, and JavaScript files.
- Use CSS custom properties for design tokens.
- Use semantic and accessible HTML.
- Keep JavaScript lightweight and maintainable.

### Suggested Project Structure

```text
project/
├── index.html
├── assets/
│   ├── images/
│   └── icons/
├── css/
│   ├── style.css
│   ├── variables.css
│   └── responsive.css
├── js/
│   ├── main.js
│   └── theme.js
└── DESIGN.md
```

---

## 12. CSS Design Tokens

Use CSS variables to ensure consistent colors across the website.

```css
/* Light Mode */
:root {
  color-scheme: light;

  --color-bg: #F4F2F8;
  --color-primary: #4D238D;
  --color-accent: #D6A83F;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #EAE5F2;

  --color-text: #241B32;
  --color-text-secondary: #6F687A;
  --color-border: #DED8E8;
}

/* Dark Mode */
[data-theme="dark"] {
  color-scheme: dark;

  --color-bg: #100D1C;
  --color-primary: #9364DF;
  --color-accent: #F0C96D;
  --color-surface: #1C172A;
  --color-surface-secondary: #272038;

  --color-text: #F5F1FC;
  --color-text-secondary: #B8AEC9;
  --color-border: #393047;
}
```

---

## 13. Design Quality Checklist

Before completing any page, verify the following:

- [ ] Uses the Amethyst Purple and Bright Gold theme.
- [ ] Supports Light Mode and Dark Mode.
- [ ] Uses consistent typography.
- [ ] Follows the spacing system.
- [ ] Has a clear visual hierarchy.
- [ ] Uses consistent UI components.
- [ ] Supports responsive layouts.
- [ ] Has accessible text contrast.
- [ ] Includes clear hover and focus states.
- [ ] Avoids unnecessary decorative elements.
- [ ] Uses semantic HTML.
- [ ] Works with HTML, CSS, and Vanilla JavaScript only.

---

## 14. Final Design Direction

The final website should communicate the identity of a modern and professional university.

The visual experience should be:
- Elegant through the use of Amethyst Purple.
- Prestigious through Bright Gold accents.
- Clean through balanced whitespace and neutral backgrounds.
- Modern through simple layouts and subtle interactions.
- Accessible through readable typography and sufficient contrast.

**The primary objective is to create a professional university website that balances institutional identity, modern aesthetics, usability, and accessibility.**
