# Upgrade Plan: Chakra UI 1.x + React 17 → Chakra UI 3.x + React 19

## Overview

This document outlines the complete upgrade path from:
- **React 17.0.2** → **React 19.0.0**
- **Chakra UI 1.5.1** → **Chakra UI 3.x**
- **React Router 5.2.0** → **React Router 6.x**
- **React Query 3.15.2** → **TanStack Query 5.x**

**Total Estimated Time: 13-20 days**

---

## Current State

### Current Dependencies
```json
{
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "@chakra-ui/react": "^1.5.1",
  "@emotion/react": "^11.1.5",
  "@emotion/styled": "^11.3.0",
  "framer-motion": "^4.1.4",
  "react-router-dom": "^5.2.0",
  "history": "^5.0.0",
  "react-query": "^3.15.2",
  "axios": "^0.21.1",
  "vite": "^2.9.18"
}
```

### Chakra UI Usage
- **ChakraProvider** with custom theme
- **Custom breakpoints** using `createBreakpoints`
- **Custom Container** component configuration
- **Color mode** used extensively (18 files)
- **Common components:** Box, Container, Flex, Text, Input, Button, etc.
- **520 Chakra component instances** across 29 files

---

## Recommended Approach: 3-Phase Staged Migration

### Why Staged?
- Too many breaking changes to do at once
- Easier to debug issues
- Can test each upgrade separately
- Lower risk of breaking production

---

## PHASE 1: React 18 + Chakra UI 2.x

**Estimated Time: 2-3 days**

### Dependencies to Update

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.13.0",
  "@emotion/styled": "^11.13.0",
  "framer-motion": "^11.11.0",
  "vite": "^5.4.0",
  "@vitejs/plugin-react": "^4.3.0"
}
```

### Code Changes Required

#### 1. Update `src/index.jsx`

**Before:**
```javascript
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <AppConfiguration />
  </React.StrictMode>,
  document.getElementById('root')
);
```

**After:**
```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppConfiguration />
  </React.StrictMode>
);
```

#### 2. Fix Chakra UI 2.x Breaking Changes

- Search for `isTruncated` prop → Replace with `noOfLines={1}`
- Review any custom `_focus` styles (may need `_focusVisible`)

#### 3. Testing Checklist

- [ ] All routes load correctly
- [ ] Color mode toggle works (light/dark)
- [ ] All forms and inputs work
- [ ] API calls and data fetching work
- [ ] No console errors or warnings
- [ ] Responsive breakpoints work correctly
- [ ] Test all 18 files using `useColorModeValue`

### Steps

1. Create branch: `git checkout -b upgrade/phase-1-react-18-chakra-2`
2. Update `package.json` dependencies
3. Run: `yarn install`
4. Update `src/index.jsx` with createRoot
5. Test thoroughly
6. Fix any issues
7. Create PR for review

---

## PHASE 2: React 19

**Estimated Time: 1-2 days**

### Dependencies to Update

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

### Breaking Changes

- `ReactDOM.render` completely removed (already fixed in Phase 1)
- `PropTypes` removed (we don't use this)
- `defaultProps` removed for function components (check if used)
- Legacy Context removed (we don't use this)
- String refs removed (check if used)

### Steps

1. Create branch: `git checkout -b upgrade/phase-2-react-19`
2. Update `package.json` dependencies
3. Run: `yarn install`
4. Run React 19 codemods (if available): Check https://docs.codemod.com/guides/migrations/react-18-19
5. Search for any `defaultProps` usage and refactor
6. Test thoroughly
7. Create PR for review

### Testing Checklist

- [ ] All functionality from Phase 1 still works
- [ ] No new console warnings
- [ ] Performance is good (React 19 should improve this)

---

## PHASE 3: Chakra UI 3.x + Router 6 + React Query 5

**Estimated Time: 5-7 days**

This phase has the most breaking changes. Consider breaking into sub-phases:

---

### Sub-Phase 3A: React Query 3 → 5

**Estimated Time: 1 day**

#### Dependencies

**Remove:**
```json
{
  "react-query": "^3.15.2",
  "history": "^5.0.0"
}
```

**Add:**
```json
{
  "@tanstack/react-query": "^5.62.0"
}
```

#### Code Changes

**Update all imports:**
```javascript
// Before
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

// After
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
```

**Update loading checks:**
```javascript
// Before
if (query.isLoading) { ... }

// After
if (query.isPending) { ... }
// Note: new isLoading = isPending && isFetching
```

#### Steps

1. Update `package.json`
2. Run TanStack Query codemod (if available)
3. Update all imports
4. Update all `isLoading` → `isPending`
5. Test all API calls and data fetching

---

### Sub-Phase 3B: React Router 5 → 6

**Estimated Time: 2-3 days**

#### Dependencies

**Remove:**
```json
{
  "history": "^5.0.0"  // Already removed in 3A
}
```

**Update:**
```json
{
  "react-router-dom": "^6.28.0"
}
```

#### Files Affected

11 files with router imports need updates.

#### Code Changes

**1. Update Routes in `src/index.jsx`:**

```javascript
// Before
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

<Switch>
  <Route path="/newsletter">
    <NewsletterArchives />
  </Route>
  <Route path="/kickstarter">
    <KickstarterArchives />
  </Route>
  <Redirect from="/" to="/shop" />
</Switch>

// After
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

<Routes>
  <Route path="/newsletter" element={<NewsletterArchives />} />
  <Route path="/kickstarter" element={<KickstarterArchives />} />
  <Route path="/" element={<Navigate to="/shop" replace />} />
</Routes>
```

**2. Update Navigation:**

```javascript
// Before
import { useHistory } from 'react-router-dom';
const history = useHistory();
history.push('/path');

// After
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/path');
```

**3. Update Links:**

Links (`Link` component) should continue to work, but verify.

#### Steps

1. Update `package.json`
2. Update `src/index.jsx` routing
3. Search for `useHistory` and replace with `useNavigate`
4. Search for `Switch` and replace with `Routes`
5. Search for `Redirect` and replace with `Navigate`
6. Update all `<Route>` syntax
7. Test all navigation and routing

---

### Sub-Phase 3C: Chakra UI 2.x → 3.x

**Estimated Time: 4-5 days** (MOST COMPLEX)

#### Dependencies

**Remove:**
```json
{
  "@emotion/styled": "removed",
  "framer-motion": "removed"
}
```

**Update:**
```json
{
  "@chakra-ui/react": "^3.29.0",
  "@emotion/react": "^11.13.0"
}
```

#### Major Breaking Changes

1. **Theme system completely rewritten**
2. **Many component props renamed**
3. **No framer-motion animations**
4. **No @emotion/styled**

#### Critical File: `src/index.jsx` Theme Configuration

**Before:**
```javascript
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
  sm: '724px',
  md: '1064px',
  lg: '1280px',
  xl: '1920px',
  '2xl': '2560px',
});

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  breakpoints,
  components: {
    Container: {
      baseStyle: {
        px: 0,
      },
    },
  },
});

<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>
```

**After:**
```javascript
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    breakpoints: {
      sm: { value: '724px' },
      md: { value: '1064px' },
      lg: { value: '1280px' },
      xl: { value: '1920px' },
      '2xl': { value: '2560px' },
    },
    recipes: {
      container: {
        base: {
          px: { value: '0' },
        },
      },
    },
  },
  globalCss: {
    'html': {
      colorMode: 'light',
    },
  },
});

<ChakraProvider value={system}>
  <App />
</ChakraProvider>
```

#### Component Prop Changes

Common prop renames (check Chakra UI 3.x docs for complete list):
- `isTruncated` → `truncated`
- `noOfLines` → `lineClamp`
- Boolean props: `is<X>` → `<x>` pattern

#### Files to Update

All 29 files with Chakra components:
- Review each component usage
- Update prop names
- Test thoroughly

#### Steps

1. Update `package.json`
2. Completely rewrite theme configuration in `src/index.jsx`
3. Update `ChakraProvider` usage
4. Update `ColorModeScript` if needed
5. Go through each of 29 component files:
   - Update prop names
   - Test component rendering
   - Check color mode works
6. Test all breakpoints
7. Test all color mode functionality (18 files)
8. Extensive visual testing of entire app

#### Testing Priority

High-risk files (use `useColorModeValue`):
- `src/components/AppHeader.jsx`
- `src/components/AppVersion.jsx`
- All shop-archives components
- All newsletter-archives components
- All kickstarter-archives components

---

### Sub-Phase 3D: Update Remaining Dependencies

**Estimated Time: 1 day**

#### Dependencies

```json
{
  "axios": "^1.8.2",  // Security update from 0.21.1
  "react-icons": "^5.3.0",
  "vite": "^6.0.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.3.0",
  "date-fns": "^4.1.0",
  "fuse.js": "^7.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.6.0",
  "@testing-library/user-event": "^14.5.0"
}
```

#### Check Compatibility

These may need investigation:
- `@microsoft/applicationinsights-react-js`: Check React 19 support
- `simple-react-lightbox`: May need React 19 compatible alternative
- `react-responsive-masonry`: Verify React 19 compatibility

#### Steps

1. Update `package.json` with all remaining updates
2. Run: `yarn install`
3. Test for compatibility issues
4. Fix any breaking changes
5. Run full test suite

---

## Alternative Approach: Stay on Chakra UI 2.x

Chakra UI 2.x supports React 19, so you could:
1. Do Phase 1 & 2 (React 18 → 19 + Chakra 2.x)
2. Stay on Chakra 2.x indefinitely (still maintained)
3. Upgrade to Chakra 3.x later when ready

**Pros:**
- Less work upfront
- Chakra 2.x is stable and maintained
- Can focus on React 19 benefits first

**Cons:**
- Eventually need to migrate to Chakra 3.x
- Missing Chakra 3.x improvements (smaller bundle, better performance)

---

## Risk Assessment

### High Risk Areas
- **Theme configuration** - Complete rewrite needed
- **Routing** - 11 files need updates
- **Color mode** - 18 files use color mode hooks
- **Custom breakpoints** - Must migrate to new format

### Medium Risk Areas
- **React Query** - Package rename and API changes
- **Third-party libraries** - May need React 19 updates

### Low Risk Areas
- **React Icons** - Should work with update
- **Axios** - Backward compatible
- **Chart.js** - Should work with update

---

## Testing Strategy

For each phase:

1. **Unit Tests**: Update and run all tests
2. **Visual Testing**: Manually check all pages
3. **Color Mode**: Test light/dark mode on all pages
4. **Responsive**: Test all breakpoints (sm, md, lg, xl, 2xl)
5. **Forms**: Test all inputs and interactions
6. **Navigation**: Test all routes and links
7. **API Calls**: Ensure data fetching works
8. **Performance**: Check for performance regressions

---

## Migration Tools & Codemods

- **React 19**: Check https://docs.codemod.com/guides/migrations/react-18-19
- **TanStack Query**: Codemod available in package
- **React Router**: No official codemod, manual migration
- **Chakra UI 3.x**: **NO CODEMODS** - manual migration required

---

## Timeline Summary

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | React 18 + Chakra 2.x | 2-3 days |
| 2 | React 19 | 1-2 days |
| 3A | React Query 5 | 1 day |
| 3B | React Router 6 | 2-3 days |
| 3C | Chakra UI 3.x | 4-5 days |
| 3D | Other dependencies | 1 day |
| - | Testing & bug fixes | 2-3 days buffer |
| **Total** | | **13-20 days** |

---

## Rollback Plan

For each phase:
1. Work on separate branch
2. Create PR for review before merging
3. Can revert merge commit if issues found
4. Keep old dependencies documented
5. Tag releases after each phase

---

## Resources

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Chakra UI v3 Migration Guide](https://www.chakra-ui.com/docs/get-started/migration)
- [React Router v6 Migration](https://reactrouter.com/en/main/upgrading/v5)
- [TanStack Query v5 Migration](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5)

---

## Notes

- This is a **major upgrade** with significant breaking changes
- Staged approach is **strongly recommended**
- Most complex part is Chakra UI 3.x theme rewrite
- Budget extra time for testing and bug fixes
- Consider whether immediate Chakra 3.x upgrade is necessary

---

*Last Updated: 2025-11-14*
