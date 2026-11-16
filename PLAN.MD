# PLAN.md
# University Website Development Plan

## 1. Project Overview

### Project Name
Modern University Website

### Project Description
Develop a modern, professional, responsive, and user-friendly university website using standard web technologies.

The website will focus on presenting university information, academic services, news, announcements, events, and other important information in an organized and accessible way.

### Main Objectives
- Create a modern and professional university website.
- Improve the accessibility of university information.
- Provide intuitive navigation and user-friendly interfaces.
- Support both Light Mode and Dark Mode.
- Ensure responsive layouts across desktop, tablet, and mobile devices.
- Maintain clean, reusable, and easy-to-understand code.

---

## 2. Technology Stack

### 2.1 Allowed Technologies

The project must use ONLY the following technologies:

| Technology | Purpose |
|---|---|
| HTML5 | Website structure and content |
| CSS3 | Styling, layout, animations, and responsive design |
| Vanilla JavaScript (ES6+) | Interactions and dynamic functionality |

### 2.2 Technology Restrictions

The following technologies and frameworks are NOT allowed:

- React
- Next.js
- Vue.js
- Angular
- Svelte
- Tailwind CSS
- Bootstrap
- jQuery
- TypeScript
- Frontend UI Frameworks
- Node.js-based frontend build tools
- Vite or Webpack

### 2.3 Implementation Requirements

- Write standard HTML, CSS, and JavaScript.
- Do not use frontend frameworks.
- Do not require a compilation or build process.
- Use native browser APIs whenever possible.
- Use CSS variables for consistent design tokens.
- Use JavaScript ES Modules when necessary.
- Keep code modular and reusable.
- Ensure the website can run directly in a modern browser.

---

## 3. Project Design Direction

Follow the design specifications defined in `DESIGN.md`.

### Theme
Amethyst Purple – Bright Gold – Modern University

### Light Mode

| Token | Color |
|---|---|
| Background | #F4F2F8 |
| Primary Purple | #4D238D |
| Accent Gold | #D6A83F |
| Surface | #FFFFFF |
| Primary Text | #241B32 |

### Dark Mode

| Token | Color |
|---|---|
| Background | #100D1C |
| Primary Purple | #9364DF |
| Accent Gold | #F0C96D |
| Surface | #1C172A |
| Primary Text | #F5F1FC |

### Design Requirements
- Professional university identity.
- Minimal and modern interface.
- Consistent typography and spacing.
- Clear visual hierarchy.
- Responsive navigation.
- Subtle transitions and animations.
- Accessible color contrast.

---

## 4. Development Phases

The project will be divided into the following development phases.

### Phase 1: Project Preparation

Objectives:
- Review project requirements.
- Identify website pages and features.
- Review the design system.
- Prepare project folders and files.
- Establish naming conventions.

Tasks:
- [ ] Analyze project requirements.
- [ ] Review DESIGN.md.
- [ ] Define website structure.
- [ ] Create the project directory.
- [ ] Prepare HTML, CSS, and JavaScript files.

Deliverable:
A prepared project structure and development specification.

### Phase 2: UI/UX Design and Layout

Objectives:
Create a consistent user interface before implementing functionality.

Tasks:
- [ ] Design the overall website layout.
- [ ] Define header and navigation.
- [ ] Design the main content area.
- [ ] Design footer.
- [ ] Define reusable UI components.
- [ ] Establish responsive layouts.
- [ ] Review Light Mode and Dark Mode.
- [ ] Check visual consistency.

Deliverable:
A complete UI layout ready for frontend implementation.

### Phase 3: HTML Structure

Objectives:
Build the semantic structure of the website.

Tasks:
- [ ] Create HTML pages.
- [ ] Use semantic HTML5 elements.
- [ ] Implement navigation links.
- [ ] Organize content sections.
- [ ] Add images and alternative text.
- [ ] Create accessible forms where required.
- [ ] Check HTML structure.

Deliverable:
Complete HTML page structures.

### Phase 4: CSS Styling

Objectives:
Implement the visual design system.

Tasks:
- [ ] Create global CSS variables.
- [ ] Implement Light Mode colors.
- [ ] Implement Dark Mode colors.
- [ ] Style navigation and header.
- [ ] Style content sections.
- [ ] Style cards, buttons, and forms.
- [ ] Implement typography.
- [ ] Implement spacing and layout.
- [ ] Add hover and focus states.
- [ ] Implement responsive breakpoints.
- [ ] Add subtle animations.

Deliverable:
Fully styled responsive website.

### Phase 5: JavaScript Functionality

Objectives:
Implement website interactions using Vanilla JavaScript.

Tasks:
- [ ] Implement mobile navigation.
- [ ] Implement Light/Dark Mode toggle.
- [ ] Save theme preference using localStorage.
- [ ] Implement dropdown menus.
- [ ] Implement search functionality when required.
- [ ] Implement filtering and sorting when required.
- [ ] Implement interactive components.
- [ ] Add form validation.
- [ ] Implement pagination or load more when required.
- [ ] Handle user interaction states.

Deliverable:
Interactive website without frontend frameworks.

### Phase 6: Responsive and Cross-Browser Testing

Objectives:
Ensure the website works correctly across devices and browsers.

Tasks:
- [ ] Test desktop layouts.
- [ ] Test tablet layouts.
- [ ] Test mobile layouts.
- [ ] Test navigation.
- [ ] Test theme switching.
- [ ] Test interactive components.
- [ ] Check horizontal overflow.
- [ ] Check image scaling.
- [ ] Test Chrome, Edge, and Firefox.
- [ ] Fix layout and interaction issues.

Deliverable:
Responsive and functional website.

### Phase 7: Accessibility and Quality Assurance

Objectives:
Improve accessibility, usability, and code quality.

Tasks:
- [ ] Check text contrast.
- [ ] Check keyboard navigation.
- [ ] Check focus indicators.
- [ ] Check image alternative text.
- [ ] Check semantic HTML.
- [ ] Check JavaScript console errors.
- [ ] Remove unused CSS and JavaScript.
- [ ] Optimize image sizes.
- [ ] Verify all internal links.
- [ ] Perform final UI review.

Deliverable:
Tested and quality-checked website.

### Phase 8: Final Delivery

Objectives:
Prepare the completed website for presentation and deployment.

Tasks:
- [ ] Review all pages.
- [ ] Verify all required features.
- [ ] Verify responsive behavior.
- [ ] Organize source files.
- [ ] Update README.md.
- [ ] Document important implementation details.
- [ ] Prepare final project files.
- [ ] Present the completed website.

Deliverable:
Completed university website project.

---

## 5. Suggested Project Structure

Use a simple and organized folder structure.

```text
university-website/
│
├── index.html
├── README.md
├── PLAN.md
├── DESIGN.md
│
├── pages/
│   ├── about.html
│   ├── news.html
│   ├── news-detail.html
│   ├── services.html
│   └── contact.html
│
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── theme.js
│   ├── navigation.js
│   └── components.js
│
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

Note:
The folder structure may be adjusted according to the actual project requirements. Do not create unnecessary files or folders.

---

## 6. Coding Standards

### HTML
- Use HTML5 semantic elements.
- Use meaningful IDs and class names.
- Keep the document structure organized.
- Include appropriate metadata.
- Use accessible form labels.
- Avoid unnecessary nested elements.

### CSS
- Use CSS custom properties.
- Use Flexbox and CSS Grid for layouts.
- Avoid duplicated styles.
- Organize CSS by component or responsibility.
- Use responsive media queries.
- Avoid excessive !important declarations.
- Maintain consistent naming conventions.

### JavaScript
- Use Vanilla JavaScript only.
- Use modern ES6+ syntax.
- Prefer const and let.
- Avoid unnecessary global variables.
- Use reusable functions.
- Separate functionality into logical files.
- Use addEventListener for event handling.
- Handle errors appropriately.
- Avoid inline JavaScript in HTML.

---

## 7. Responsive Design Requirements

The website must support the following screen sizes:

| Device | Screen Width |
|---|---|
| Mobile | 320px – 767px |
| Tablet | 768px – 1023px |
| Desktop | 1024px – 1439px |
| Large Desktop | 1440px and above |

Requirements:
- Mobile-first or responsive implementation.
- Navigation adapts to screen size.
- Content remains readable.
- Images scale proportionally.
- Cards adapt to available width.
- Tables remain accessible.
- No unwanted horizontal scrolling.

---

## 8. Performance Requirements

- Minimize unnecessary JavaScript.
- Optimize images.
- Avoid excessive animations.
- Use lazy loading for suitable images.
- Minimize duplicated CSS.
- Avoid unnecessary external dependencies.
- Keep page loading efficient.
- Use native browser functionality where possible.

---

## 9. Development Rules for AI Agents

Any AI agent or coding assistant working on this project must follow these rules:

1. Read PLAN.md and DESIGN.md before making changes.
2. Use HTML5, CSS3, and Vanilla JavaScript only.
3. Never introduce frontend frameworks or CSS frameworks.
4. Do not install unnecessary packages or dependencies.
5. Do not introduce build tools.
6. Follow the established design system.
7. Maintain existing project structure unless changes are necessary.
8. Reuse existing CSS classes and components where possible.
9. Keep code readable and beginner-friendly.
10. Do not remove existing functionality without approval.
11. Do not modify unrelated files.
12. Test changes before considering a task complete.
13. Explain important changes and affected files.
14. Ask for approval before introducing new technologies or expanding project scope.

### Important Restriction

If a requested feature cannot be implemented using HTML, CSS, and Vanilla JavaScript alone, explain the limitation and propose an alternative before changing the technology stack.

---

## 10. Project Completion Checklist

The project is considered complete when:

- [ ] All required pages are implemented.
- [ ] The design follows DESIGN.md.
- [ ] Light Mode works correctly.
- [ ] Dark Mode works correctly.
- [ ] Navigation works correctly.
- [ ] Responsive layouts work across devices.
- [ ] JavaScript interactions work correctly.
- [ ] No major console errors remain.
- [ ] HTML, CSS, and JavaScript are organized.
- [ ] Accessibility requirements are addressed.
- [ ] No prohibited frontend frameworks are used.
- [ ] README.md contains setup and usage instructions.

---

## 11. Final Project Goal

Deliver a modern, professional, responsive, and accessible university website using only HTML5, CSS3, and Vanilla JavaScript.

The project must prioritize:
- User experience.
- Institutional identity.
- Clean and maintainable code.
- Responsive design.
- Accessibility.
- Consistent visual design.
- Lightweight implementation.

**The website must be built entirely with standard web technologies, without relying on frontend frameworks or build tools.**
