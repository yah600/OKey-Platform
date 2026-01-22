# O'KEY PLATFORM - DESIGN SYSTEM
**Apple-Style Visual Design & Motion Language**

---

## K) INTERACTION & MOTION DESIGN

### Motion Design Principles (Apple-Inspired)

Based on Apple's HIG ([Motion Guidelines](https://developer.apple.com/design/human-interface-guidelines/motion)) and iOS 26 Motion Design ([iOS 26 Guide](https://medium.com/@foks.wang/ios-26-motion-design-guide-key-principles-and-practical-tips-for-transition-animations-74def2edbf7c)):

**Core Principles:**

1. **Intentional** - Every animation has a purpose
2. **Contextual** - Animations reinforce spatial relationships
3. **Physics-Based** - Use natural easing and spring animations
4. **Responsive** - Fast enough not to frustrate, slow enough to perceive
5. **Respectful** - Honor reduced motion preferences

**Key Takeaways from Research:**
- "The true power of animation lies in providing clear feedback and smooth visual transitions"
- "Helps users understand what's changing on screen, reduce confusion from sudden changes, and make the whole experience feel more natural and organized"
- "Focus on intentional animations that keep people oriented, provide clear feedback in response to their actions"
- "Avoid adding motion to interactions that occur frequently"

---

### Micro-Interactions

**Button Press:**
```css
/* Scale down slightly on press, spring back */
.button {
  transition: transform 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.button:active {
  transform: scale(0.95);
}
```

**Toggle Switch:**
```typescript
// Spring animation for toggle
const spring = {
  type: "spring",
  stiffness: 500,
  damping: 30
}

<motion.div
  animate={{ x: isOn ? 20 : 0 }}
  transition={spring}
/>
```

**Checkbox Check:**
```typescript
// Smooth checkmark animation
<motion.svg
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <motion.path d="..." />
</motion.svg>
```

**Heart Favorite:**
```typescript
// Scale and color change
<motion.div
  whileTap={{ scale: 1.2 }}
  animate={{ scale: isFavorited ? [1, 1.3, 1] : 1 }}
  transition={{ duration: 0.3 }}
>
  <Heart fill={isFavorited ? "red" : "none"} />
</motion.div>
```

**Ripple Effect:**
```typescript
// Material-like ripple for buttons
const Ripple = ({ x, y }: { x: number; y: number }) => (
  <motion.span
    className="ripple"
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 2, opacity: 0 }}
    transition={{ duration: 0.6 }}
    style={{ left: x, top: y }}
  />
)
```

---

### Feedback Patterns

**Loading States:**
```typescript
// Skeleton shimmer
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
}
```

**Success Confirmation:**
```typescript
// Checkmark animation
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: "spring", stiffness: 200 }}
>
  <CheckCircle className="text-green-500" />
</motion.div>
```

**Error Shake:**
```typescript
// Shake animation for errors
const shake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
}

<motion.div animate={hasError ? shake : {}}>
  <Input error={hasError} />
</motion.div>
```

**Progress Indicators:**
```typescript
// Circular progress (like iOS)
<motion.circle
  cx="50"
  cy="50"
  r="45"
  strokeDasharray="283"
  strokeDashoffset={283 - (283 * progress) / 100}
  transition={{ duration: 0.5, ease: "easeInOut" }}
/>
```

---

### Transition Rules

**Page Transitions:**
```typescript
// iOS-like push/pop
const pageVariants = {
  initial: { x: "100%", opacity: 0 },
  enter: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 }
}

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="enter"
  exit="exit"
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  {children}
</motion.div>
```

**Modal Transitions:**
```typescript
// Scale up from center with backdrop fade
const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

<motion.div
  className="backdrop"
  variants={backdropVariants}
  initial="hidden"
  animate="visible"
  exit="hidden"
>
  <motion.div
    className="modal"
    variants={modalVariants}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    {children}
  </motion.div>
</motion.div>
```

**Drawer/Slide-over:**
```typescript
// Slide from right
const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 }
}

<motion.div
  variants={drawerVariants}
  initial="hidden"
  animate="visible"
  exit="hidden"
  transition={{ type: "spring", bounce: 0 }}
>
  {children}
</motion.div>
```

**Accordion Expand/Collapse:**
```typescript
// Smooth height transition
<motion.div
  initial={false}
  animate={{ height: isOpen ? "auto" : 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
  style={{ overflow: "hidden" }}
>
  {children}
</motion.div>
```

---

### Motion Tokens

**Duration:**
```typescript
export const duration = {
  instant: 100,    // Immediate feedback
  fast: 200,       // Quick interactions
  normal: 300,     // Standard transitions
  slow: 500,       // Deliberate animations
  slower: 700      // Emphasis animations
}
```

**Easing:**
```typescript
export const easing = {
  // Standard CSS easings
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0.0, 1, 1)",
  easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0.0, 0.2, 1)",

  // Apple-style easings
  standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",      // General purpose
  decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",    // Entering elements
  accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",      // Exiting elements
  sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",         // Quick, precise

  // Spring (for framer-motion)
  spring: { type: "spring", stiffness: 300, damping: 30 },
  springBouncy: { type: "spring", stiffness: 400, damping: 20 },
  springGentle: { type: "spring", stiffness: 200, damping: 40 }
}
```

**Spring Presets (Physics-Based):**
```typescript
export const springs = {
  // iOS-like responsive spring
  snappy: { stiffness: 400, damping: 25, mass: 0.5 },

  // Smooth, gentle spring
  gentle: { stiffness: 200, damping: 30, mass: 1 },

  // Bouncy spring (playful)
  bouncy: { stiffness: 500, damping: 20, mass: 1 },

  // Slow, deliberate spring
  slow: { stiffness: 100, damping: 30, mass: 1.5 }
}
```

---

### Gesture Support

**Swipe Actions (Mobile):**
```typescript
import { useGesture } from '@use-gesture/react'

const bind = useGesture({
  onSwipeStart: ({ direction: [dx] }) => {
    if (dx < 0) handleDelete() // Swipe left to delete
    if (dx > 0) handleArchive() // Swipe right to archive
  }
})

<motion.div {...bind()}>
  {content}
</motion.div>
```

**Pinch to Zoom:**
```typescript
const [scale, setScale] = useState(1)

const bind = useGesture({
  onPinch: ({ offset: [d] }) => {
    setScale(1 + d / 100)
  }
})

<motion.img
  {...bind()}
  style={{ scale }}
/>
```

**Pull to Refresh:**
```typescript
const [pulling, setPulling] = useState(false)

const bind = useGesture({
  onDrag: ({ offset: [, y], down }) => {
    if (y > 80 && !down) {
      handleRefresh()
    }
    setPulling(down && y > 0)
  }
})
```

---

### Reduced Motion Support

**Respect User Preference:**
```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

// Conditional animation
<motion.div
  animate={{
    opacity: 1,
    ...(prefersReducedMotion ? {} : { y: 0, transition: { type: "spring" } })
  }}
>
  {children}
</motion.div>
```

**Hook for Reduced Motion:**
```typescript
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Usage
const shouldAnimate = !useReducedMotion()
```

**Source:** [iOS 26 Motion Design Guide](https://medium.com/@foks.wang/ios-26-motion-design-guide-key-principles-and-practical-tips-for-transition-animations-74def2edbf7c)

---

## L) VISUAL DESIGN SYSTEM

### Apple-Style Principles

Based on Apple HIG ([Official Guidelines](https://developer.apple.com/design/human-interface-guidelines/)) and Liquid Glass research ([Liquid Glass Design](https://dev.to/anistark/apples-liquid-glass-design-1ol5)):

**Three Pillars:**

1. **Clarity**
   - Text legible at all sizes
   - Icons precise and clear
   - Color and blur emphasize hierarchy
   - Negative space guides eye

2. **Deference**
   - UI doesn't compete with content
   - Subtle, translucent backgrounds
   - Content is hero, chrome recedes

3. **Depth**
   - Visual layers create hierarchy
   - Realistic motion and depth
   - Parallax and blur suggest layers
   - Shadows subtle but present

---

### Design Tokens

#### Typography

**Font Family:**
```css
:root {
  /* San Francisco-inspired (use Inter as alternative) */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
}
```

**Type Scale (Apple-inspired):**
```typescript
export const typography = {
  // Display (hero text)
  display: {
    fontSize: '4.5rem',      // 72px
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: '-0.02em'
  },

  // Headings
  h1: {
    fontSize: '3rem',        // 48px
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: '-0.01em'
  },
  h2: {
    fontSize: '2.25rem',     // 36px
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: '-0.01em'
  },
  h3: {
    fontSize: '1.875rem',    // 30px
    lineHeight: 1.3,
    fontWeight: 600
  },
  h4: {
    fontSize: '1.5rem',      // 24px
    lineHeight: 1.4,
    fontWeight: 600
  },
  h5: {
    fontSize: '1.25rem',     // 20px
    lineHeight: 1.4,
    fontWeight: 600
  },
  h6: {
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.4,
    fontWeight: 600
  },

  // Body text
  body: {
    fontSize: '1rem',        // 16px
    lineHeight: 1.5,
    fontWeight: 400
  },
  bodyLarge: {
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.6,
    fontWeight: 400
  },
  bodySmall: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.5,
    fontWeight: 400
  },

  // Captions
  caption: {
    fontSize: '0.75rem',     // 12px
    lineHeight: 1.4,
    fontWeight: 400
  },

  // Labels/buttons
  label: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.4,
    fontWeight: 500
  },
  button: {
    fontSize: '1rem',        // 16px
    lineHeight: 1,
    fontWeight: 500,
    letterSpacing: '0.01em'
  }
}
```

**Font Weights:**
```typescript
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
}
```

---

#### Spacing Scale

**Base: 4px unit (0.25rem)**
```typescript
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
}
```

**Usage:**
- Component padding: 4-6 (16-24px)
- Gap between items: 4 (16px)
- Section spacing: 8-12 (32-48px)
- Page padding: 6-8 (24-32px)

---

#### Grid System

**Columns:**
- Mobile: 4 columns
- Tablet: 8 columns
- Desktop: 12 columns

**Gutters:**
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

**Margins:**
- Mobile: 16px
- Tablet: 32px
- Desktop: 64px (or auto-centered max-width)

**Max Width:**
- Content: 1280px (centered)
- Wide content: 1536px
- Full bleed: 100%

---

#### Color System

**Liquid Glass Palette:**

Based on Apple's Liquid Glass ([Glassmorphism 2025](https://www.everydayux.net/glassmorphism-apple-liquid-glass-interface-design/)):

**Primary (Blue):**
```typescript
export const blue = {
  50: '#EBF5FF',
  100: '#E1EFFE',
  200: '#C3DDFD',
  300: '#A4CAFE',
  400: '#76A9FA',
  500: '#3B82F6',  // Primary
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
  950: '#172554'
}
```

**Neutral (Gray with slight blue tint):**
```typescript
export const neutral = {
  0: '#FFFFFF',
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617'
}
```

**Semantic Colors:**
```typescript
export const semantic = {
  success: {
    light: '#DCFCE7',
    DEFAULT: '#22C55E',
    dark: '#166534'
  },
  warning: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#92400E'
  },
  error: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#991B1B'
  },
  info: {
    light: '#DBEAFE',
    DEFAULT: '#3B82F6',
    dark: '#1E40AF'
  }
}
```

**Glassmorphism Variables:**
```css
:root {
  /* Translucent backgrounds */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  /* Blur amounts */
  --blur-sm: 8px;
  --blur-md: 16px;
  --blur-lg: 24px;
  --blur-xl: 40px;

  /* Vibrancy (for light/dark auto-adjust) */
  --vibrancy-light: rgba(255, 255, 255, 0.7);
  --vibrancy-dark: rgba(0, 0, 0, 0.6);
}

/* Dark mode adjustments */
.dark {
  --glass-bg: rgba(0, 0, 0, 0.5);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

**Source:** [Liquid Glass: Apple's Stunning Design Language](https://artversion.com/blog/through-the-looking-ui-diving-into-liquid-glass/)

---

#### Elevation (Shadows & Depth)

**Shadow Scale (subtle, Apple-like):**
```typescript
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inner shadow (for inset elements)
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // Glass shadow (for translucent cards)
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
}
```

**Layering (z-index):**
```typescript
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  commandPalette: 1090
}
```

---

#### Border Radius

**Apple-style rounded corners:**
```typescript
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px - small elements
  DEFAULT: '0.5rem', // 8px - buttons, inputs
  md: '0.75rem',    // 12px - cards
  lg: '1rem',       // 16px - larger cards
  xl: '1.25rem',    // 20px - prominent cards
  '2xl': '1.5rem',  // 24px - hero cards
  full: '9999px'    // Pills, avatars
}
```

---

### Theming Rules

**Light Theme (Default):**
```css
:root {
  --background: #FFFFFF;
  --foreground: #0F172A;
  --primary: #3B82F6;
  --secondary: #64748B;
  --accent: #8B5CF6;
  --muted: #F1F5F9;
  --border: #E2E8F0;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

**Dark Theme:**
```css
.dark {
  --background: #0F172A;
  --foreground: #F8FAFC;
  --primary: #3B82F6;
  --secondary: #94A3B8;
  --accent: #A78BFA;
  --muted: #1E293B;
  --border: #334155;
  --glass-bg: rgba(15, 23, 42, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

**Auto Theme (System Preference):**
```typescript
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return { theme, setTheme }
}
```

---

### Accessibility-Safe Color Pairs

**WCAG 2.1 Level AA Compliance (4.5:1 minimum for normal text):**

**Safe Combinations:**
- White text on blue-600+ (4.52:1) ✅
- White text on neutral-700+ (4.52:1) ✅
- Neutral-900 text on white (16.05:1) ✅
- Neutral-900 text on neutral-50 (14.68:1) ✅
- Blue-700 text on neutral-50 (7.09:1) ✅

**Testing:**
- Use Contrast Checker tool during design
- Automated testing with Axe DevTools
- Manual verification with WCAG Color Contrast Analyzer

**Source:** [WCAG 2.1 Accessibility Best Practices](https://www.allaccessible.org/blog/react-accessibility-best-practices-guide)

---

## M) ACCESSIBILITY

### WCAG 2.1 Level AA Targets

**Four Principles (POUR):**

1. **Perceivable**
   - Text alternatives for images (alt text)
   - Captions for video
   - Adaptable layouts (no info lost when resizing)
   - Color contrast 4.5:1 minimum

2. **Operable**
   - Keyboard accessible
   - Enough time to interact
   - No seizure-inducing content
   - Navigation aids

3. **Understandable**
   - Readable text (language specified)
   - Predictable behavior
   - Input assistance (labels, errors, suggestions)

4. **Robust**
   - Compatible with assistive technologies
   - Valid HTML
   - ARIA when needed

**Source:** [WCAG 2.1 Keyboard Accessibility](https://www.uxpin.com/studio/blog/wcag-211-keyboard-accessibility-explained/)

---

### Keyboard Navigation

**Tab Order:**
- Logical tab order (top to bottom, left to right)
- Skip to main content link
- Visible focus indicators
- No keyboard traps

**Keyboard Shortcuts:**
```typescript
export const keyboardShortcuts = {
  // Global
  'Cmd/Ctrl + K': 'Open command palette',
  'Esc': 'Close modal/drawer',
  '/': 'Focus search',

  // Navigation
  'Tab': 'Move focus forward',
  'Shift + Tab': 'Move focus backward',
  'Enter': 'Activate button/link',
  'Space': 'Toggle checkbox, activate button',

  // Lists/Tables
  'Arrow Up/Down': 'Navigate items',
  'Home/End': 'First/Last item',
  'Cmd/Ctrl + A': 'Select all',

  // Forms
  'Esc': 'Cancel form',
  'Enter': 'Submit form (if in input)',
}
```

**Implementation:**
```typescript
// Focus management
const firstInputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  // Auto-focus first input when modal opens
  if (isOpen) {
    firstInputRef.current?.focus()
  }
}, [isOpen])

// Trap focus in modal
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose()
  }
  // Trap Tab key...
}
```

**Source:** [React Accessibility Keyboard Navigation](https://legacy.reactjs.org/docs/accessibility.html)

---

### Focus Management

**Focus Indicators:**
```css
/* Visible focus ring (Apple-style) */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default outline */
*:focus {
  outline: none;
}

/* Custom focus styles per component */
.button:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

**Focus Trap in Modals:**
```typescript
import { useFocusTrap } from '@react-aria/focus'

function Modal({ isOpen, onClose, children }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, { isDisabled: !isOpen })

  return isOpen ? (
    <div ref={ref} role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null
}
```

**Return Focus After Modal:**
```typescript
const previousFocusRef = useRef<HTMLElement | null>(null)

const openModal = () => {
  previousFocusRef.current = document.activeElement as HTMLElement
  setIsOpen(true)
}

const closeModal = () => {
  setIsOpen(false)
  previousFocusRef.current?.focus()
}
```

---

### ARIA Patterns

**Common ARIA Attributes:**

```typescript
// Buttons
<button
  aria-label="Close modal"  // For icon-only buttons
  aria-pressed={isPressed}   // For toggle buttons
  aria-expanded={isExpanded} // For expandable buttons
  aria-disabled={isDisabled} // For disabled state
>

// Links
<a
  href="/properties"
  aria-current="page"  // For current page in nav
>

// Form fields
<input
  aria-label="Search properties"
  aria-invalid={hasError}
  aria-describedby="error-message"
  aria-required={true}
/>
<span id="error-message" role="alert">
  {errorMessage}
</span>

// Dialogs
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description...</p>
</div>

// Tabs
<div role="tablist">
  <button
    role="tab"
    aria-selected={isSelected}
    aria-controls="panel-1"
    id="tab-1"
  >
    Tab 1
  </button>
</div>
<div
  role="tabpanel"
  aria-labelledby="tab-1"
  id="panel-1"
>
  Panel content
</div>

// Live regions (for dynamic updates)
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

**Source:** [ARIA Patterns Best Practices](https://www.rtcamp.com/handbook/react-best-practices/accessibility/)

---

### Screen Reader Support

**Semantic HTML:**
```html
<!-- ❌ BAD: Divs for everything -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>

<!-- ✅ GOOD: Semantic elements -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
```

**Landmarks:**
```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

**Hidden Content:**
```typescript
// Visually hidden but screen-reader accessible
const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0'
}

<span style={srOnly}>Skip to main content</span>
```

**Announce Dynamic Changes:**
```typescript
// Use aria-live for notifications
<div aria-live="assertive" aria-atomic="true">
  {error && <p role="alert">{error}</p>}
</div>

<div aria-live="polite" aria-atomic="true">
  {successMessage && <p>{successMessage}</p>}
</div>
```

---

### Contrast Rules

**Minimum Ratios (WCAG AA):**
- Normal text (< 24px): 4.5:1
- Large text (≥ 24px or ≥ 19px bold): 3:1
- UI components and graphics: 3:1

**Enhanced Ratios (WCAG AAA):**
- Normal text: 7:1
- Large text: 4.5:1

**Testing:**
```typescript
// Example contrast values
const contrastRatios = {
  'neutral-900 on white': 16.05,  // ✅ AAA
  'neutral-700 on white': 8.59,   // ✅ AAA
  'neutral-600 on white': 5.74,   // ✅ AA
  'neutral-500 on white': 3.84,   // ❌ Fails AA for normal text
  'blue-600 on white': 4.52,      // ✅ AA
  'white on blue-600': 4.52,      // ✅ AA
}
```

**Tools:**
- Chrome DevTools (Lighthouse)
- Axe DevTools extension
- WebAIM Contrast Checker
- Stark (Figma plugin)

---

### Reduced Motion

**Respect User Preference:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**React Hook:**
```typescript
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Usage
const shouldAnimate = !useReducedMotion()
```

**Source:** [WCAG 2.1 Standards in Modern Apps](https://dev.to/joshuawasike/accessibility-beyond-basics-implementing-wcag-21-standards-in-modern-web-apps-75b)

---

**Continue to TECHNICAL_SPECS.md for sections N-Q...**
