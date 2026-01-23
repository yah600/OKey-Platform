# Testing Guide

## Overview

The O'Key Platform uses **Vitest** and **React Testing Library** for comprehensive testing coverage. Our target is **80% code coverage** across statements, functions, and lines, with **75% branch coverage**.

## Test Stack

- **Vitest 4.0** - Fast unit test framework (Jest-compatible API)
- **React Testing Library 16.1** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers for DOM
- **jsdom** - DOM implementation for Node.js

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI (interactive browser interface)
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- src/pages/tenant/__tests__/TenantPayments.test.tsx

# Run tests matching pattern
npm test -- --grep="payment"
```

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
coverage: {
  statements: 80,
  branches: 75,
  functions: 80,
  lines: 80,
}
```

Tests will **fail** if coverage drops below these thresholds.

## Test File Organization

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   └── __tests__/
│   │       └── Button.test.tsx
│   ├── molecules/
│   │   ├── Rating.tsx
│   │   └── __tests__/
│   │       └── Rating.test.tsx
│   └── organisms/
│       ├── Modal.tsx
│       └── __tests__/
│           └── Modal.test.tsx
├── pages/
│   ├── tenant/
│   │   ├── TenantPayments.tsx
│   │   └── __tests__/
│   │       └── TenantPayments.test.tsx
│   └── owner/
│       ├── LeaseBuilder.tsx
│       └── __tests__/
│           └── LeaseBuilder.test.tsx
├── store/
│   ├── paymentsStore.ts
│   └── __tests__/
│       └── paymentsStore.test.ts
└── test/
    ├── setup.ts          # Test setup
    └── utils.tsx         # Test utilities
```

## Writing Tests

### 1. Component Tests

#### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with variant styles', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.firstChild).toHaveClass('bg-primary-600');
  });
});
```

#### Component with Router

```typescript
import { BrowserRouter } from 'react-router-dom';

it('navigates on button click', async () => {
  render(
    <BrowserRouter>
      <PropertyCard property={mockProperty} />
    </BrowserRouter>
  );

  await userEvent.click(screen.getByRole('button', { name: /view details/i }));
  expect(window.location.pathname).toBe('/property/123');
});
```

#### Component with Store (Mocking Zustand)

```typescript
import { vi } from 'vitest';
import { usePaymentsStore } from '@/store/paymentsStore';

vi.mock('@/store/paymentsStore', () => ({
  usePaymentsStore: vi.fn(),
}));

const mockUsePaymentsStore = usePaymentsStore as unknown as ReturnType<typeof vi.fn>;

describe('TenantPayments', () => {
  beforeEach(() => {
    mockUsePaymentsStore.mockReturnValue({
      payments: mockPayments,
      makePayment: vi.fn(),
      downloadReceipt: vi.fn(),
    });
  });

  it('displays payment history', () => {
    render(<TenantPayments />);
    expect(screen.getByText(/February 2026 Rent/i)).toBeInTheDocument();
  });
});
```

### 2. Store Tests

#### Testing Zustand Stores

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExpenseStore } from '../expenseStore';

describe('expenseStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useExpenseStore());
    act(() => {
      result.current.expenses = [];
    });
  });

  it('adds expense', () => {
    const { result } = renderHook(() => useExpenseStore());

    act(() => {
      result.current.addExpense({
        category: 'Maintenance',
        amount: 500,
        date: '2026-01-15',
        description: 'HVAC repair',
      });
    });

    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].amount).toBe(500);
  });

  it('calculates total expenses', () => {
    const { result } = renderHook(() => useExpenseStore());

    act(() => {
      result.current.addExpense({ amount: 500, category: 'Maintenance' });
      result.current.addExpense({ amount: 300, category: 'Utilities' });
    });

    const total = result.current.getTotalExpenses();
    expect(total).toBe(800);
  });
});
```

### 3. Hook Tests

#### Custom Hook Testing

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';

describe('useFocusTrap', () => {
  it('traps focus within container', () => {
    const { result } = renderHook(() => useFocusTrap(true));

    // Create mock DOM structure
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');

    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    act(() => {
      result.current.current = container;
    });

    // Test focus trap behavior
    button2.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    document.dispatchEvent(event);

    expect(document.activeElement).toBe(button1);
  });
});
```

### 4. Integration Tests

#### Multi-Step User Flow

```typescript
describe('Payment Flow Integration', () => {
  it('completes full payment process', async () => {
    render(
      <BrowserRouter>
        <TenantPayments />
      </BrowserRouter>
    );

    // Step 1: View pending payment
    expect(screen.getByText(/\$1,500.*pending/i)).toBeInTheDocument();

    // Step 2: Click pay button
    await userEvent.click(screen.getByRole('button', { name: /pay now/i }));

    // Step 3: Payment modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Step 4: Select payment method
    await userEvent.click(screen.getByLabelText(/credit card.*1234/i));

    // Step 5: Confirm payment
    await userEvent.click(screen.getByRole('button', { name: /confirm payment/i }));

    // Step 6: Success message
    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });

    // Step 7: Payment status updated
    expect(screen.getByText(/paid/i)).toBeInTheDocument();
  });
});
```

### 5. Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<PropertySearch />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('supports keyboard navigation', async () => {
  render(<FilterPanel />);

  // Tab to first filter
  await userEvent.tab();
  expect(screen.getByRole('button', { name: /price range/i })).toHaveFocus();

  // Space to open
  await userEvent.keyboard(' ');
  expect(screen.getByRole('slider')).toBeInTheDocument();

  // Escape to close
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('slider')).not.toBeInTheDocument();
});
```

## Testing Best Practices

### 1. Test User Behavior, Not Implementation

**❌ Bad - Testing implementation details**
```typescript
it('increments counter state', () => {
  const { result } = renderHook(() => useState(0));
  const [count, setCount] = result.current;
  setCount(1);
  expect(result.current[0]).toBe(1);
});
```

**✅ Good - Testing user behavior**
```typescript
it('increments counter when button clicked', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Use Accessible Queries

**Priority order (prefer top ones):**

1. `getByRole` - Most accessible (screen reader friendly)
2. `getByLabelText` - Form inputs
3. `getByPlaceholderText` - If no label
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

**❌ Bad - Using test IDs unnecessarily**
```typescript
expect(screen.getByTestId('submit-button')).toBeInTheDocument();
```

**✅ Good - Using role**
```typescript
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

### 3. Async Testing

**❌ Bad - No waiting**
```typescript
it('loads data', () => {
  render(<DataTable />);
  expect(screen.getByText('John Doe')).toBeInTheDocument(); // May fail
});
```

**✅ Good - Using waitFor**
```typescript
it('loads data', async () => {
  render(<DataTable />);
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// Or use findBy (includes waitFor)
it('loads data', async () => {
  render(<DataTable />);
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

### 4. Mock External Dependencies

```typescript
// Mock API calls
vi.mock('@/lib/api/properties', () => ({
  propertiesApi: {
    getAll: vi.fn().mockResolvedValue([mockProperty1, mockProperty2]),
  },
}));

// Mock localStorage
beforeEach(() => {
  const mockStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  };
  global.localStorage = mockStorage as any;
});

// Mock window.matchMedia (for responsive tests)
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  cleanup(); // Automatically done by React Testing Library
  vi.clearAllMocks(); // Clear all mock call history
  localStorage.clear(); // Reset localStorage
});

afterAll(() => {
  vi.restoreAllMocks(); // Restore original implementations
});
```

## Test Categories

### Unit Tests (~90 tests)
Test individual components in isolation:
- Button, Input, Select, Checkbox
- Rating, DatePicker, SearchBar
- Icon, Badge, Skeleton
- Utility functions
- Custom hooks

### Integration Tests (~40 tests)
Test component interactions:
- PropertySearch with filters
- TenantPayments with payment modal
- LeaseBuilder wizard flow
- Dashboard with charts
- Maintenance request submission

### Critical Path Tests (~20 tests)
End-to-end user flows:
1. User registers and logs in
2. Tenant makes payment
3. Tenant submits maintenance request
4. Owner creates new property
5. Owner builds lease
6. Owner screens tenant application
7. Property search and bid placement
8. Document upload and download
9. Messaging between tenant and owner
10. Bulk operations (rent reminders)

## Code Coverage Reports

### Viewing Coverage

After running `npm run test:coverage`, open:
```
coverage/index.html
```

### Coverage Breakdown

```
File                     | Statements | Branches | Functions | Lines
-------------------------|------------|----------|-----------|-------
All files                |      82.34 |    76.12 |     81.45 | 82.67
 components/atoms        |      88.12 |    82.34 |     86.23 | 88.45
 components/molecules    |      85.67 |    78.91 |     84.12 | 85.89
 components/organisms    |      79.45 |    72.34 |     78.67 | 79.78
 pages/tenant            |      81.23 |    75.45 |     80.12 | 81.56
 pages/owner             |      80.12 |    74.23 |     79.45 | 80.34
 store                   |      86.45 |    80.12 |     85.67 | 86.78
 hooks                   |      84.23 |    77.89 |     83.45 | 84.56
 lib                     |      82.12 |    75.67 |     81.23 | 82.45
```

## Debugging Tests

### Visual Debugging

```typescript
import { screen } from '@testing-library/react';

it('debugs component', () => {
  render(<MyComponent />);

  // Print entire DOM
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));

  // Log all available queries
  screen.logTestingPlaygroundURL();
});
```

### Vitest UI

```bash
npm run test:ui
```

Opens interactive browser UI to:
- View test results
- Inspect DOM snapshots
- Replay failed tests
- Debug test execution

### VS Code Debugging

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--run"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Common Testing Patterns

### Loading States

```typescript
it('shows loading skeleton', () => {
  render(<PropertyList />);
  expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
});

it('shows data after loading', async () => {
  render(<PropertyList />);
  expect(await screen.findByText('Property 1')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
```

### Error States

```typescript
it('displays error message', async () => {
  const mockError = new Error('Failed to load');
  vi.mocked(propertiesApi.getAll).mockRejectedValue(mockError);

  render(<PropertyList />);
  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
});
```

### Empty States

```typescript
it('shows empty state when no data', async () => {
  vi.mocked(propertiesApi.getAll).mockResolvedValue([]);

  render(<PropertyList />);
  expect(await screen.findByText(/no properties found/i)).toBeInTheDocument();
});
```

### Form Validation

```typescript
it('validates required fields', async () => {
  render(<PropertyForm />);

  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(/property name is required/i)).toBeInTheDocument();
  expect(await screen.findByText(/price is required/i)).toBeInTheDocument();
});

it('submits valid form', async () => {
  const onSubmit = vi.fn();
  render(<PropertyForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText(/property name/i), 'My Property');
  await userEvent.type(screen.getByLabelText(/price/i), '1500');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'My Property',
      price: 1500,
    });
  });
});
```

---

## Testing Checklist

Before submitting a PR, ensure:

- [ ] All new components have tests
- [ ] All new features have integration tests
- [ ] Coverage thresholds are met (80/75/80/80)
- [ ] No tests are skipped (`.skip` or `.only`)
- [ ] Tests are fast (<5 seconds total)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Mocks are properly cleaned up
- [ ] Accessibility is tested (keyboard nav, screen readers)
- [ ] Error states are tested
- [ ] Loading states are tested
- [ ] Empty states are tested

---

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
