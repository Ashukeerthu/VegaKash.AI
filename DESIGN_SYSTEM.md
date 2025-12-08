# VegaKash.AI Design System & Theme Guide

**Version:** 1.0  
**Last Updated:** December 2025  
**Maintained by:** VegaKash.AI Development Team

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations](#animations)
7. [Responsive Design](#responsive-design)
8. [Best Practices](#best-practices)
9. [Accessibility](#accessibility)

---

## Design Philosophy

VegaKash.AI's design system emphasizes:

✅ **Modern & Professional** - Premium gradient colors with clean layouts  
✅ **User-Centric** - Intuitive navigation, clear CTAs, smooth interactions  
✅ **Trustworthy** - Consistent branding, security-focused messaging  
✅ **Accessible** - WCAG 2.1 AA compliance, mobile-first approach  
✅ **Performance-Optimized** - Fast load times, CSS containment, minimal reflows  

---

## Color Palette

### Primary Colors

| Color | Hex | Usage | RGB |
|-------|-----|-------|-----|
| **Purple** | `#667eea` | Primary accent, buttons, links | rgb(102, 126, 234) |
| **Violet** | `#764ba2` | Gradient end, active states | rgb(118, 75, 162) |
| **Pink** | `#f093fb` | Gradient highlight, hover effects | rgb(240, 147, 251) |

### Gradient Combinations

```css
/* Primary Gradient - Used most frequently */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Extended Gradient - Hero sections */
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

/* Subtle Gradient - Card backgrounds */
background: linear-gradient(135deg, #f8f9fc 0%, #e3f2fd 100%);
```

### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#ffffff` | Backgrounds, cards |
| **Light Gray** | `#f8f9fc` | Secondary backgrounds |
| **Very Light Gray** | `#e3f2fd` | Light blue tint backgrounds |
| **Border Gray** | `#e8ecf3` | Borders, dividers |
| **Medium Gray** | `#64748b` | Secondary text |
| **Dark Gray** | `#475569` | Body text |
| **Very Dark Gray** | `#1e293b` | Headings |
| **Black** | `#2c3e50` | Dark text, heavy emphasis |

### Brand Colors

| Element | Hex | Purpose |
|---------|-----|---------|
| **Theme Color** | `#667eea` | Meta theme-color |
| **Success** | `#10b981` | Positive actions (when needed) |
| **Warning** | `#f59e0b` | Alerts (when needed) |
| **Error** | `#ef4444` | Errors (when needed) |

### Color Usage Guidelines

- **Background**: White (#ffffff) or Light Gray (#f8f9fc)
- **Text**: Dark Gray (#475569) for body, Very Dark Gray (#1e293b) for headings
- **Accents**: Purple (#667eea) for primary CTAs, Violet (#764ba2) for hover states
- **Hover/Focus**: Always add shadow: `0 4px 12px rgba(102, 126, 234, 0.3)`
- **Borders**: Use Border Gray (#e8ecf3) with 1-2px width
- **Shadows**: Use semi-transparent black with 0.08-0.15 opacity

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **H1** | 2.5rem - 3rem | 800 | 1.2 | Page titles |
| **H2** | 2rem | 700 | 1.3 | Section headers |
| **H3** | 1.4rem - 1.5rem | 600 | 1.4 | Subsection headers |
| **H4** | 1.2rem | 600 | 1.5 | Card titles |
| **Body Large** | 1.125rem | 500 | 1.8 | Featured content |
| **Body** | 1.05rem | 400 | 1.8 | Main text |
| **Body Small** | 0.95rem - 1rem | 400 | 1.7 | Secondary text |
| **Caption** | 0.85rem - 0.9rem | 500 | 1.6 | Labels, tags |

### Font Weights

```css
font-weight: 400;  /* Regular - body text */
font-weight: 500;  /* Medium - secondary headings, labels */
font-weight: 600;  /* Semibold - card titles, secondary headers */
font-weight: 700;  /* Bold - section headers */
font-weight: 800;  /* Extra Bold - page titles */
```

### Responsive Typography (Using clamp())

```css
/* Fluid typography that scales between mobile and desktop */
font-size: clamp(1.5rem, 4vw, 3rem);  /* Responsive heading */
font-size: clamp(1rem, 2vw, 1.125rem);  /* Responsive body */
font-size: clamp(0.95rem, 1.5vw, 1.05rem);  /* Responsive caption */
```

### Text Colors

```css
/* Headings */
color: #1e293b;  /* Very Dark Gray */

/* Body Text */
color: #475569;  /* Medium Gray */

/* Secondary Text */
color: #64748b;  /* Light Gray */

/* Links/CTAs */
color: #667eea;  /* Purple */

/* Links Hover */
color: #764ba2;  /* Violet */

/* White Text (on gradients) */
color: #ffffff;  /* White */
```

---

## Spacing & Layout

### Spacing Scale (CSS Variables)

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

### Padding Guidelines

| Element | Padding |
|---------|---------|
| **Large Cards** | 2.5rem / 40px |
| **Medium Cards** | 1.5rem - 2rem / 24-32px |
| **Small Cards** | 1rem - 1.25rem / 16-20px |
| **Buttons** | 0.875rem 2rem / 14px 32px |
| **Form Inputs** | 0.75rem 1rem / 12px 16px |
| **Content Sections** | 2rem 1.5rem / 32px 24px |

### Gap/Margin Guidelines

| Context | Value |
|---------|-------|
| **Between sections** | 3rem / 48px |
| **Between items in grid** | 1.5rem - 2rem / 24-32px |
| **Between paragraphs** | 1.25rem / 20px |
| **Between headings & content** | 1rem - 1.5rem / 16-24px |
| **Hero padding (top/bottom)** | 3rem - 4rem / 48-64px |

### Container Max-Widths

```css
--max-width-sm: 640px;    /* Small pages */
--max-width-md: 900px;    /* Blog posts, content */
--max-width-lg: 1200px;   /* Main content */
--max-width-xl: 1400px;   /* Full-width layouts */
```

### Grid Layouts

```css
/* 2-Column Grid (Calculators) */
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 1.5rem;

/* 3-Column Grid (Cards) */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 1.5rem;

/* 4-Column Grid (Icons/Features) */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1.5rem;

/* Mobile responsive */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

### Border Radius

```css
--radius-sm: 4px;      /* Subtle rounding */
--radius-md: 8px;      /* Standard inputs */
--radius-lg: 16px;     /* Cards */
--radius-xl: 24px;     /* Large cards */
--radius-full: 9999px; /* Fully rounded */
```

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: white;
  color: #667eea;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid #e8ecf3;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}
```

### Cards

#### Standard Card
```css
.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}
```

#### Gradient Card (Featured)
```css
.card-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.card-gradient:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}
```

### Input Fields

```css
.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e8ecf3;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #64748b;
}
```

### CTA Box (Info Section)

```css
.cta-box {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding: 2rem;
  border-left: 6px solid #667eea;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cta-box h3 {
  color: #0d47a1;
  margin-top: 0;
}

.cta-box p {
  color: #333;
  margin-bottom: 0;
}
```

### Tags/Badges

```css
.tag {
  background: #e8ecf3;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
}

.tag-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

## Animations

### Core Animations

#### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeInUp 0.6s ease-out;
}
```

#### Bounce (for icons)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.icon {
  animation: bounce 2s infinite;
}
```

#### Background Scroll (subtle pattern)
```css
@keyframes backgroundScroll {
  0% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(60px) translateY(60px); }
}

.pattern {
  animation: backgroundScroll 20s linear infinite;
}
```

### Animation Timing

| Property | Value | Usage |
|----------|-------|-------|
| **Duration - Fast** | 0.2s | Hover states, small interactions |
| **Duration - Normal** | 0.3s - 0.4s | Transitions, state changes |
| **Duration - Slow** | 0.6s - 0.8s | Page load, major animations |
| **Easing - Fast** | ease-in | Exiting/disappearing |
| **Easing - Smooth** | ease-out | Entering/appearing |
| **Easing - Natural** | ease | General transitions |
| **Easing - Deliberate** | cubic-bezier(0.4, 0, 0.2, 1) | Complex animations |

### Stagger Animation Pattern

```css
/* Multiple elements with staggered animation */
.element:nth-child(1) { animation: fadeInUp 0.6s ease-out; }
.element:nth-child(2) { animation: fadeInUp 0.6s ease-out 0.2s both; }
.element:nth-child(3) { animation: fadeInUp 0.6s ease-out 0.4s both; }
```

### Hover Effects

```css
/* Lift on Hover */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Scale on Hover */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Color Shift on Hover */
.hover-color:hover {
  color: #667eea;
  transition: color 0.3s ease;
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
Mobile:       < 576px   (default styling)
Tablet:       576px     (@media (min-width: 576px))
Small Tablet: 768px     (@media (min-width: 768px))
Desktop:      1024px    (@media (min-width: 1024px))
Large Desktop:1200px    (@media (min-width: 1200px))
```

### Breakpoint Usage

```css
/* Mobile optimized by default */
.hero { padding: 2rem 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .hero { padding: 3rem 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .hero { padding: 4rem 3rem; }
}
```

### Mobile-First Responsive Table

| Screen | Max-Width | Grid Cols | Font Size |
|--------|-----------|-----------|-----------|
| Mobile | 576px | 1 col | 0.9-0.95rem |
| Tablet | 768px | 2 cols | 0.95-1rem |
| Desktop | 1024px | 3-4 cols | 1rem-1.1rem |
| Large | 1200px+ | 4-5 cols | 1.1rem+ |

### Touch-Friendly Sizing

```css
/* Minimum touch target sizes */
.button, .link, .input {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile hover effects */
@media (hover: none) and (pointer: coarse) {
  .button:active {
    transform: scale(0.98);
  }
  
  -webkit-tap-highlight-color: transparent;
}
```

---

## Best Practices

### ✅ DO:

1. **Use consistent spacing** - Always use the spacing scale
2. **Maintain color hierarchy** - Use colors intentionally
3. **Keep animations subtle** - Enhance, don't distract (< 1 second preferred)
4. **Test on mobile** - Always verify responsive behavior
5. **Use semantic HTML** - `<header>`, `<main>`, `<section>`, `<article>`
6. **Provide clear CTAs** - Make action buttons obvious
7. **Include loading states** - Show feedback during interactions
8. **Use gradients sparingly** - They should enhance, not overpower
9. **Maintain whitespace** - Don't overcrowd layouts
10. **Test color contrast** - Ensure WCAG AA compliance (4.5:1 minimum)

### ❌ DON'T:

1. **Hardcode colors** - Always use the palette
2. **Mix multiple gradients** - Stick to our 3 standard combinations
3. **Override standard spacing** - Use CSS variables
4. **Create custom fonts** - Stick to system fonts
5. **Animate everything** - Use animations purposefully
6. **Ignore mobile view** - Design for mobile first
7. **Use heavy shadows** - Keep subtle (0.08-0.12 opacity)
8. **Create inconsistent button styles** - Use component classes
9. **Forget accessibility** - Always consider contrast, focus states
10. **Bloat CSS** - Use CSS classes, not inline styles

### CSS Organization

```css
/* 1. Reset and Variables */
:root {
  --color-primary: #667eea;
  --spacing-md: 1rem;
}

/* 2. Base Elements */
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'; }
h1, h2, h3 { font-weight: 700; }

/* 3. Layout Components */
.hero, .card, .form-input {}

/* 4. Utility Classes */
.text-center { text-align: center; }
.mt-1 { margin-top: 0.5rem; }

/* 5. Responsive Overrides */
@media (max-width: 768px) {
  /* Mobile adjustments */
}
```

---

## Accessibility

### Color Contrast

**WCAG AA Compliance (Minimum 4.5:1 for body text):**

```
✅ #667eea on white     - 5.5:1 (Passes)
✅ #764ba2 on white     - 6:1 (Passes)
✅ #475569 on white     - 7.2:1 (Passes)
✅ White on #667eea     - 5.5:1 (Passes)
```

### Focus States

```css
/* Always provide visible focus indicators */
button:focus, a:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

### Semantic HTML

```html
<!-- ✅ Good -->
<header>Navigation</header>
<main>
  <article>
    <h1>Page Title</h1>
    <section>Content</section>
  </article>
</main>
<footer>Footer</footer>

<!-- ❌ Avoid -->
<div class="header">Navigation</div>
<div class="main">
  <div class="article">
    <div class="title">Page Title</div>
  </div>
</div>
```

### Alt Text & Labels

```html
<!-- Images -->
<img src="logo.png" alt="VegaKash.AI logo" />

<!-- Form inputs -->
<label for="email">Email Address:</label>
<input id="email" type="email" />

<!-- Icon-only buttons -->
<button aria-label="Close menu">✕</button>
```

### Motion & Reduced Motion

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Examples

### Creating a New Page

```jsx
import SEO from '../components/SEO';
import '../styles/Pages.css';

export default function NewPage() {
  return (
    <>
      <SEO 
        title="Page Title"
        description="Page description"
        keywords="keyword1, keyword2"
        canonical="/new-page"
      />
      
      <main className="main-content">
        <div className="hero">
          <h1>Welcome</h1>
        </div>
        
        <div className="seo-content-section">
          <div className="content-block">
            <h2>Section Title</h2>
            <p>Content here...</p>
          </div>
        </div>
      </main>
    </>
  );
}
```

### Creating a New Component

```css
/* Component specific styles */
.my-component {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.my-component h3 {
  font-size: 1.4rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.my-component p {
  color: #475569;
  line-height: 1.8;
}

/* Responsive */
@media (max-width: 768px) {
  .my-component {
    padding: 1.5rem;
  }
}
```

---

## Theme Maintenance

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial design system documentation |

### Future Enhancements

- [ ] Dark mode theme
- [ ] Additional color palettes
- [ ] Animation component library
- [ ] Figma design file
- [ ] Component storybook
- [ ] CSS-in-JS conversion (if needed)

### Contributing

When updating the design system:

1. Update this document
2. Follow the organization structure
3. Test all changes on mobile & desktop
4. Ensure WCAG AA accessibility
5. Update component examples
6. Increment version number

---

## Quick Reference

### Most Used Colors
- Primary Purple: `#667eea`
- Accent Violet: `#764ba2`
- Text Dark: `#475569`
- Background: `#ffffff` or `#f8f9fc`

### Most Used Spacing
- Default padding: `2rem / 32px`
- Section margin: `3rem / 48px`
- Element gap: `1.5rem / 24px`

### Most Used Typography
- Headings: 700-800 weight, 1.2-1.3 line-height
- Body: 400 weight, 1.8 line-height
- Font size: 1.05rem for body, clamp() for responsive

### Most Used Border Radius
- Buttons & inputs: `8px`
- Cards: `16px`
- Large components: `24px`

---

**For questions or updates, contact: development@vegakash.ai**
