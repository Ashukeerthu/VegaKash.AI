# React Router Lazy Loading Pattern - Quick Reference

## Issue
Lazy-loaded components with React Router were not triggering proper client-side navigation. Pages required full reload to navigate.

## Root Cause
```jsx
// ❌ WRONG - Lazy component rendered without Suspense wrapper
{routes.map((route) => (
  <Route 
    path={route.path} 
    element={<route.element />}  // route.element is lazy()
  />
))}
```

When a lazy component is rendered without Suspense, React Router may not properly detect route changes.

## Solution
```jsx
// ✅ CORRECT - Lazy component wrapped in Suspense
{routes.map((route) => (
  <Route 
    path={route.path} 
    element={
      <Suspense fallback={<LoadingSpinner />}>
        <route.element />  // Lazy component properly wrapped
      </Suspense>
    } 
  />
))}
```

## Why This Works
1. **Suspense Boundary**: Creates a proper React boundary for lazy component
2. **Route Detection**: React Router can properly detect when route should change
3. **Loading State**: Shows fallback UI while component code is loading
4. **Error Handling**: Suspense can catch errors during code splitting

## Key Points
- Apply Suspense to EVERY lazy component in routes
- Put Suspense INSIDE the Route element, not outside
- Use consistent LoadingSpinner for all lazy routes
- Suspense is NOT needed for eager (non-lazy) imports

## Code Example (Complete)
```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy imports
const Home = lazy(() => import('./pages/Home'));
const Calculator = lazy(() => import('./pages/Calculator'));

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          } 
        />
        <Route 
          path="/calculator/:type" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Calculator />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}
```

## Testing
```javascript
// Test that navigation works without page reload
1. Open app at /page1
2. Click link to /page2
3. URL changes to /page2 in address bar
4. Content updates without full page reload
5. If using lazy loading, LoadingSpinner appears briefly
```

## Common Mistakes
❌ Suspense outside Routes
❌ Lazy without Suspense
❌ Fallback UI in wrong location
❌ Static components wrapped in unnecessary Suspense

## Performance Note
- Lazy loading reduces initial bundle size
- Each lazy component loads only when needed
- Suspense fallback should be lightweight
- Code splitting works transparently to user

## References
- React docs: https://react.dev/reference/react/lazy
- React Router: https://reactrouter.com/en/main/guides/lazy-loading
