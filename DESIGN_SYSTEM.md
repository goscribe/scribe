# Scribe Design System

A Linear-inspired clean and minimal design system for building beautiful, consistent interfaces.

## Table of Contents

- [Philosophy](#philosophy)
- [Colors](#colors)
- [Typography](#typography)
- [Spacing](#spacing)
- [Components](#components)
- [Shadows](#shadows)
- [Borders](#borders)
- [Transitions & Animations](#transitions--animations)
- [Dark Mode](#dark-mode)
- [Usage Guidelines](#usage-guidelines)

---

## Philosophy

The Scribe design system is inspired by Linear's clean, minimal aesthetic. Key principles:

- **Clean & Minimal**: Subtle borders, soft shadows, generous whitespace
- **Consistent**: Unified color palette and spacing scale
- **Accessible**: High contrast ratios and clear visual hierarchy
- **Modern**: Smooth transitions and thoughtful micro-interactions

---

## Colors

### Primary Palette

The primary color is a muted purple/blue that serves as the main accent throughout the application.

```css
--primary: 250 70% 60%;           /* Main accent color */
--primary-foreground: 0 0% 100%;  /* Text on primary */
--primary-glow: 250 60% 65%;      /* Glow effect for gradients */
```

**Usage:**
- Primary actions (buttons, links)
- Focus states
- Accent borders
- Progress indicators

### Base Colors

```css
--background: 0 0% 100%;           /* Page background */
--foreground: 240 10% 3.9%;       /* Primary text */
--card: 0 0% 100%;                /* Card background */
--card-foreground: 240 10% 3.9%;  /* Text on cards */
```

### Muted Colors

Used for secondary text, borders, and subtle backgrounds.

```css
--muted: 240 4.8% 95.9%;          /* Subtle background */
--muted-foreground: 240 3.8% 46.1%; /* Secondary text */
```

**Opacity Variants:**
- `text-muted-foreground/80` - Slightly more prominent secondary text
- `text-muted-foreground/70` - Standard secondary text
- `text-muted-foreground/60` - Subtle hints and metadata
- `bg-muted/30` - Light background tint
- `bg-muted/40` - Medium background tint
- `bg-muted/50` - Stronger background tint

### Status Colors

```css
--destructive: 0 72% 51%;         /* Error/danger states */
--destructive-foreground: 0 0% 100%;
```

### Borders & Inputs

```css
--border: 220 13% 91%;            /* Standard borders */
--input: 220 13% 91%;             /* Input borders */
--ring: 250 70% 60% / 0.2;       /* Focus ring */
```

**Border Opacity Variants:**
- `border-border/50` - Subtle dividers
- `border-border/30` - Very subtle separators
- `border-primary/20` - Accent borders
- `border-primary/30` - Stronger accent borders

### Tailwind Usage

```tsx
// Backgrounds
className="bg-background"
className="bg-card"
className="bg-muted/30"
className="bg-primary"

// Text
className="text-foreground"
className="text-muted-foreground"
className="text-muted-foreground/70"
className="text-primary"

// Borders
className="border-border"
className="border-border/50"
className="border-primary/20"
```

---

## Typography

### Font Stack

Uses system font stack with font feature settings for better rendering:

```css
font-family: system-ui, -apple-system, sans-serif;
font-feature-settings: "rlig" 1, "calt" 1;
```

### Type Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Display | `text-4xl` | `font-bold` | Large headings, hero text |
| H1 | `text-4xl` | `font-bold` | Page titles |
| H2 | `text-2xl` | `font-bold` | Section headers |
| H3 | `text-lg` | `font-bold` | Subsection headers |
| Body | `text-sm` | `font-medium` | Standard text |
| Small | `text-xs` | `font-medium` | Metadata, labels |
| Tiny | `text-[10px]` | `font-medium` | Very small metadata |

### Text Utilities

```tsx
// Display text (large headings)
className="text-display" // text-4xl font-bold leading-tight

// Decorative labels
className="text-label-decorative" // text-xs font-semibold text-muted-foreground tracking-wider uppercase

// Standard text
className="text-sm font-medium"
className="text-xs text-muted-foreground/70"
```

### Line Height

- Headings: `leading-tight`
- Body: Default (1.5)
- Small text: Default

---

## Spacing

### Spacing Scale

Uses Tailwind's default spacing scale (4px base unit).

### Common Patterns

```tsx
// Section spacing
className="space-y-8"   // Large sections
className="space-y-6"   // Medium sections
className="space-y-4"   // Small sections

// Padding
className="p-16"        // Generous (cards, modals)
className="p-8"         // Comfortable (sections)
className="p-6"         // Standard (cards)
className="p-4"         // Compact (tight spaces)
className="p-3"         // Very compact

// Component spacing
className="px-6 py-4"   // Table cells
className="px-6 py-3"   // Table headers
className="px-4 py-2"   // Buttons (default)
```

### Utility Classes

```css
.section-spacing      /* space-y-8 */
.section-spacing-sm   /* space-y-6 */
.section-spacing-xs   /* space-y-4 */
.padding-generous     /* p-16 */
.padding-comfortable  /* p-8 */
.padding-compact      /* p-4 */
```

---

## Components

### Buttons

#### Variants

```tsx
// Primary (default)
<Button variant="default">Primary Action</Button>

// Secondary
<Button variant="secondary">Secondary Action</Button>

// Outline
<Button variant="outline">Outline Button</Button>

// Ghost (minimal)
<Button variant="ghost">Ghost Button</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Link style
<Button variant="link">Link Button</Button>
```

#### Sizes

```tsx
<Button size="sm">Small</Button>      // h-8, px-3, text-xs
<Button size="default">Default</Button> // h-9, px-4, text-sm
<Button size="lg">Large</Button>      // h-10, px-8
<Button size="icon">Icon</Button>     // h-9 w-9
```

#### Custom Styling

```tsx
// Common customizations
<Button className="h-7 text-xs px-3">Compact</Button>
<Button className="h-8 px-3 hover:bg-muted/60">Custom hover</Button>
```

### Cards

#### Standard Card

```tsx
<Card className="border border-border shadow-sm">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

#### Card with Hover

```tsx
<Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
  <CardContent className="p-5">
    {/* Content */}
  </CardContent>
</Card>
```

#### Card Variants

```tsx
// Subtle border
className="border border-border/50"

// With shadow
className="border border-border shadow-sm"

// Hover effect
className="border border-border shadow-sm hover:shadow-md transition-shadow"

// Primary accent border
className="border-2 border-primary/20"
```

### Tables

#### Table Structure

```tsx
<Card className="border border-border shadow-sm overflow-hidden">
  <div className="overflow-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border/50">
          <th className="text-left text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-6 py-4 bg-muted/30">
            Header
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors duration-200">
          <td className="px-6 py-4">
            Content
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</Card>
```

#### Row States

```tsx
// Default row
className="border-b border-border/30 hover:bg-muted/40 transition-colors duration-200"

// Selected row
className="bg-primary/10 border-l-2 border-l-primary"

// Last row (no border)
className="last:border-0"
```

### Badges

```tsx
<Badge variant="outline" className="text-xs">
  Label
</Badge>

// With custom colors
<Badge 
  variant="outline" 
  className="text-xs bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30"
>
  Success
</Badge>
```

### Inputs

```tsx
<Input 
  className="h-9 border-border focus-visible:ring-1"
  placeholder="Placeholder"
/>
```

**Input Styling:**
- Default: `border-2 border-border`
- Focus: `ring-1 ring-primary/20 border-primary/30`
- Height: `h-9` (standard), `h-8` (compact)

### Empty States

```tsx
<EmptyState
  icon={Icon}
  title="No items"
  description="Get started by creating your first item"
  action={{
    label: "Create Item",
    onClick: handleCreate
  }}
/>
```

---

## Shadows

### Shadow Scale

```css
--shadow-soft: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-medium: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-large: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
```

### Usage

```tsx
// Standard card shadow
className="shadow-sm"

// Hover state
className="shadow-sm hover:shadow-md"

// Utility classes
className="shadow-soft"
className="shadow-medium"
className="shadow-large"
className="shadow-clean"      // Custom card shadow
className="shadow-clean-lg"   // Larger card shadow
```

### Card Shadow Pattern

```tsx
// Default
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);

// Hover
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
```

---

## Borders

### Border Styles

```tsx
// Standard border
className="border border-border"

// Subtle border
className="border border-border/50"

// Very subtle
className="border border-border/30"

// Primary accent
className="border-2 border-primary/20"
className="border-2 border-primary/30"

// Left accent (for selected states)
className="border-l-2 border-l-primary"
```

### Border Radius

```css
--radius: 0.5rem;  /* 8px */
```

```tsx
className="rounded-lg"   // Standard (8px)
className="rounded-md"   // Medium (6px)
className="rounded-xl"   // Large (12px)
className="rounded-full" // Full circle
```

### Utility Classes

```css
.border-clean          /* border-2 border-primary/20 */
.border-clean-gray     /* border-2 border-gray-300 */
.border-clean-strong   /* border-2 border-primary/30 */
```

---

## Transitions & Animations

### Transition Timing

```css
--transition-smooth: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-flip: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions

```tsx
// Standard transition
className="transition-colors duration-200"

// Smooth transition
className="transition-all duration-200 ease-out"

// Card hover
className="transition-shadow duration-200"

// Interactive elements
className="interactive-clean" // transition-all duration-200 ease-out
```

### Animation Patterns

```tsx
// Hover effects
className="hover:bg-muted/40 transition-colors duration-200"
className="hover:shadow-md transition-shadow duration-200"

// Button transitions
className="transition-colors" // Built into Button component
```

---

## Dark Mode

### Color Overrides

Dark mode maintains the same primary color but adjusts backgrounds and borders:

```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 7%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --border: 240 3.7% 15.9%;
}
```

### Dark Mode Considerations

- Primary color remains consistent
- Borders become more subtle
- Shadows are more pronounced
- Text contrast is maintained

### Usage

Dark mode is handled automatically via Tailwind's `dark:` prefix:

```tsx
className="bg-background dark:bg-card"
className="text-foreground dark:text-muted-foreground"
```

---

## Usage Guidelines

### Do's ✅

- Use consistent spacing scale (multiples of 4px)
- Apply subtle borders (`border-border/50` for dividers)
- Use `shadow-sm` for cards, `hover:shadow-md` for interactivity
- Maintain consistent text hierarchy
- Use opacity variants for subtle effects
- Apply transitions to interactive elements

### Don'ts ❌

- Don't use hard borders (`border-2` without opacity)
- Don't use heavy shadows (avoid `shadow-lg` or `shadow-xl`)
- Don't mix different spacing patterns
- Don't use bright colors for backgrounds
- Don't skip transitions on hover states
- Don't use custom colors outside the palette

### Component Patterns

#### Card Pattern

```tsx
<Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

#### Table Row Pattern

```tsx
<tr 
  className={cn(
    "border-b border-border/30 last:border-0 transition-colors duration-200",
    isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/40"
  )}
>
  {/* Cells */}
</tr>
```

#### Button Group Pattern

```tsx
<div className="flex items-center gap-2">
  <Button variant="default" size="sm">Primary</Button>
  <Button variant="outline" size="sm">Secondary</Button>
  <Button variant="ghost" size="sm">Tertiary</Button>
</div>
```

### Accessibility

- Maintain contrast ratios (WCAG AA minimum)
- Use semantic HTML elements
- Provide focus states (`focus-visible:ring-1`)
- Include ARIA labels where needed
- Ensure keyboard navigation works

---

## Quick Reference

### Common Class Combinations

```tsx
// Card
"border border-border shadow-sm hover:shadow-md transition-shadow"

// Table header
"text-left text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-6 py-4 bg-muted/30"

// Table cell
"px-6 py-4"

// Table row
"border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors duration-200"

// Selected row
"bg-primary/10 border-l-2 border-l-primary"

// Button (small)
"h-8 px-3 text-xs"

// Text (secondary)
"text-sm text-muted-foreground/70"

// Text (metadata)
"text-xs text-muted-foreground/60"
```

---

## Resources

- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Linear Design Inspiration](https://linear.app)

---

**Last Updated:** 2024
**Version:** 1.0.0

