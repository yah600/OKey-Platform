# UI Polish Components Guide

This guide documents the polish components added to the O'Key Platform for loading states, empty states, and animations.

## Components

### Loading (Skeleton Screens)

**Location:** `src/components/ui/Loading.tsx`

**Variants:**
- `Loading` - Full page loading skeleton
- `CardLoading` - Single card loading skeleton
- `TableLoading` - Table rows loading skeleton

**Usage:**
```tsx
import Loading, { CardLoading, TableLoading } from '../components/ui/Loading';

function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  if (isLoading) {
    return <Loading />;
  }
  
  return <div>Content</div>;
}
```

### EmptyState

**Location:** `src/components/ui/EmptyState.tsx`

**Props:**
- `icon` (LucideIcon) - Icon to display
- `title` (string) - Main heading
- `description` (string) - Description text
- `action` (optional) - Button with label and onClick

**Usage:**
```tsx
import EmptyState from '../components/ui/EmptyState';
import { FileText } from 'lucide-react';

<EmptyState
  icon={FileText}
  title="No documents yet"
  description="Upload your first document to get started."
  action={{
    label: 'Upload Document',
    onClick: () => handleUpload(),
  }}
/>
```

## Animations

**Location:** `src/styles/globals.css`

**Available animations:**
- `animate-fadeIn` - Fade in with slight upward movement (0.3s)
- `animate-slideInRight` - Slide in from right (0.3s)
- `animate-slideInUp` - Slide up with fade (0.4s)

**Usage:**
```tsx
<div className="animate-fadeIn">
  Page content
</div>
```

## Transitions

All elements have smooth transitions by default:
- 150ms duration
- Cubic bezier easing
- Respects `prefers-reduced-motion`

**Properties affected:**
- color
- background-color
- border-color
- opacity
- transform

## Pattern: Page with Loading and Empty States

```tsx
import { useState, useEffect } from 'react';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { Icon } from 'lucide-react';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // setItems(data); // Set real data
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <h1>My Page</h1>
      
      {items.length > 0 ? (
        <div>
          {/* Render items */}
        </div>
      ) : (
        <EmptyState
          icon={Icon}
          title="No items"
          description="Add your first item to get started."
          action={{
            label: 'Add Item',
            onClick: () => handleAdd(),
          }}
        />
      )}
    </div>
  );
}
```

## Hover Effects

Add subtle hover effects to interactive elements:

```tsx
// Card hover
<Card className="hover:bg-neutral-50 transition-all cursor-pointer">

// Button-like element
<div className="hover:bg-neutral-100 transition-colors">

// Scale on hover
<div className="hover:scale-105 transition-transform">
```

## Accessibility

All animations respect `prefers-reduced-motion`:
- Animations are reduced to 0.01ms
- Ensures accessibility for users with motion sensitivity

## Best Practices

1. **Always show loading states** for async operations
2. **Always show empty states** when collections are empty
3. **Add animations** to page transitions (animate-fadeIn)
4. **Add hover effects** to clickable elements
5. **Test with reduced motion** enabled
6. **Keep animations subtle** - don't overdo it
7. **Use consistent timing** - stick to 150-400ms durations

## Example Pages

See these pages for reference implementations:
- `src/pages/owner/OwnerDocumentsPage.tsx` - Full pattern example
- Loading state, empty state, and animations all demonstrated

## Future Enhancements

- Staggered list animations
- Page transition animations (React Router)
- More skeleton variants
- Toast notifications with animations
