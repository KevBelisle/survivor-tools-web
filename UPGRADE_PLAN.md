# Upgrade Plan: React 18 → React 19 + Dependency Modernization

## Overview

This document outlines the complete upgrade path from:
- **React 18.2.0** → **React 19.0.0**
- **Chakra UI 2.8.2** → **Chakra UI 3.x**
- **React Router 5.3.4** → **React Router 7.x**
- **React Query 3.15.2** → **TanStack Query 5.x**

**Status:** Phase 1 Complete ✓ | Phase 2A Complete ✓ | Phase 2B Complete ✓

---

## Current State (After Phase 2B)

### Current Dependencies
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@tanstack/react-query": "^5.90.0",
  "react-router-dom": "^7.0.0",
  "react-icons": "^5.5.0",
  "react-responsive-masonry": "^2.7.1",
  "axios": "^0.21.1",
  "vite": "^6.0.1",
  "@vitejs/plugin-react": "^5.1.0"
}
```

### What Changed in Phase 2A
- ✅ **Removed deprecated packages**: framer-motion, simple-react-lightbox, use-is-in-viewport, @microsoft/applicationinsights-react-js, history
- ✅ **Upgraded to React 18/19 compatible versions**: All dependencies now support React 18 and most support React 19
- ✅ **Migrated React Query**: react-query → @tanstack/react-query v5
- ✅ **Migrated React Router**: v5 → v7 with new APIs (Routes, useNavigate, useMatch)
- ✅ **Replaced lightbox**: Direct image links with target="_blank"
- ✅ **Custom IntersectionObserver hook**: Replaced abandoned use-is-in-viewport package

---

## PHASE 1: React 18 + Chakra UI 2.x ✅ COMPLETED

**Status:** ✅ Complete

### What Was Done
- ✅ Upgraded React 17 → React 18.2.0
- ✅ Upgraded Chakra UI 1.x → 2.8.2
- ✅ Updated `src/index.jsx` to use `createRoot` API
- ✅ Upgraded Vite to 5.4.0
- ✅ Upgraded @vitejs/plugin-react to 4.3.0
- ✅ Added `"type": "module"` to package.json

---

## PHASE 2: React 19 Migration (3-Step Bridge Strategy)

**Total Estimated Time: 1-2 days**

### Why 3 Steps?

Research has revealed that **true "bridge" versions (supporting both React 18 AND 19) are rare**. Most packages either:
- Support React 18 only (older versions)
- Support React 19 only (newer versions)
- Have loose peer dependencies but may have issues

**Strategy:** Upgrade to React 18/19-compatible versions first, then upgrade React itself, then address any remaining issues.

---

### Step 2A: Prepare Dependencies (Stay on React 18) ✅ COMPLETED

**Status:** ✅ Complete
**Actual Time:** Completed in single session

#### Packages to REMOVE
```json
{
  "framer-motion": "^6.5.1",           // NOT USED - 0 imports found
  "simple-react-lightbox": "^3.6.6",   // DEPRECATED - last update 2021
  "use-is-in-viewport": "^1.0.9"       // ABANDONED - 6 years old
}
```

#### Packages to UPGRADE (React 18/19 Compatible)
```json
{
  // Core dependencies - stay on React 18 for now
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  
  // Build tools - React 18/19 compatible
  "vite": "^6.0.1",
  "@vitejs/plugin-react": "^5.1.0",
  
  // UI & Styling - React 18 only (for now)
  "@chakra-ui/react": "^2.8.2",
  "@emotion/react": "^11.14.0",         // ⚠️ Works with React 19 but has issues
  "@emotion/styled": "^11.14.1",        // ⚠️ Works with React 19 but has issues
  
  // Data fetching - migrate package name
  "@tanstack/react-query": "^5.90.0",   // ✅ Works with React 18 & 19
  // Remove: "react-query": "^3.15.2"
  
  // Routing - React 18/19 compatible
  "react-router-dom": "^7.0.0",         // ✅ Explicitly designed for React 18→19 bridge
  // Remove: "history": "^5.0.0"        // No longer needed
  
  // Icons - React 18/19 compatible
  "react-icons": "^5.5.0",              // ✅ React 19 TypeScript fixes
  
  // Telemetry - version-locked to React version
  "@microsoft/applicationinsights-react-js": "^18.3.6",  // Use v18 for React 18
  
  // Other dependencies
  "react-responsive-masonry": "^2.7.1"
}
```

#### Code Changes Required

**1. Remove Lightbox (2 files)**
- `src/shop-archives/components/ProductDetailsContainer.jsx` - Remove `<SimpleReactLightbox>` wrapper
- `src/shop-archives/components/ProductDetails.jsx` - Replace lightbox with direct image links using `target="_blank"`

**2. Migrate React Query (6 files)**
```javascript
// Before
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

// After
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
```

Files affected:
- `src/index.jsx`
- `src/kickstarter-archives/index.jsx`
- `src/newsletter-archives/index.jsx`
- `src/newsletter-archives/components/NewsletterDetails.jsx`
- `src/shop-archives/index.jsx`
- `src/shop-archives/components/ProductDetailsContainer.jsx`

**3. Migrate React Router v5 → v7 (8 files)**

**Main routing changes (`src/index.jsx`):**
```javascript
// Before
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

<Switch>
  <Route path="/newsletter">
    <NewsletterArchives />
  </Route>
  <Route path="/kickstarter">
    <KickstarterArchives />
  </Route>
  <Route path="/shop">
    <ShopArchives />
  </Route>
  <Route>
    <Redirect to="/shop" />
  </Route>
</Switch>

// After
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

<Routes>
  <Route path="/newsletter/*" element={<NewsletterArchives />} />
  <Route path="/kickstarter/*" element={<KickstarterArchives />} />
  <Route path="/shop/*" element={<ShopArchives />} />
  <Route path="/" element={<Navigate to="/shop" replace />} />
</Routes>
```

**Replace useHistory with useNavigate (`src/components/AppHeader.jsx`):**
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

**Replace useRouteMatch with useMatch (7 files):**
```javascript
// Before
import { useRouteMatch } from 'react-router-dom';
const match = useRouteMatch();
const { path, url } = match;

// After
import { useMatch, useResolvedPath } from 'react-router-dom';
const match = useMatch('/:section/*');  // Adjust pattern as needed
const resolvedPath = useResolvedPath('.');
```

Files with useRouteMatch:
- `src/kickstarter-archives/index.jsx` (3 uses)
- `src/newsletter-archives/index.jsx` (3 uses)
- `src/shop-archives/index.jsx` (3 uses)
- `src/kickstarter-archives/components/UpdateSummary.jsx` (2 uses)
- `src/newsletter-archives/components/NewsletterSummary.jsx` (2 uses)
- `src/newsletter-archives/components/NewsletterDetails.jsx` (1 use)
- `src/shop-archives/components/ProductSummaryCard.jsx` (2 uses)

**4. Replace/Remove use-is-in-viewport**
- Search for usage and replace with custom IntersectionObserver hook or alternative

#### Testing Checklist
- [x] All routes load correctly
- [x] Navigation works (useNavigate)
- [x] Nested routes work correctly
- [x] Data fetching works (TanStack Query)
- [x] Image gallery shows direct links instead of lightbox
- [x] No console errors or warnings
- [x] Build completes successfully with vite v6.0.1

#### Summary of Changes
All planned changes for Step 2A have been completed:
- ✅ Removed 7 packages (framer-motion, simple-react-lightbox, use-is-in-viewport, @microsoft/applicationinsights-react-js, @microsoft/applicationinsights-web, react-query, history)
- ✅ Upgraded 7 packages to React 18/19 compatible versions
- ✅ Migrated React Query to @tanstack/react-query in 6 files
- ✅ Migrated React Router v5 → v7 in 10+ files
- ✅ Replaced lightbox with direct image links
- ✅ Implemented custom IntersectionObserver hook
- ✅ Build tested and passing

---

### Step 2B: Upgrade React to 19

**Status:** ✅ COMPLETED
**Estimated Time: 1-2 hours**
**Actual Time:** ~15 minutes

#### Packages to Update
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

**Note:** @microsoft/applicationinsights-react-js was removed in Step 2A

#### Code Changes
- Run React 19 codemod: `npx codemod@latest react/19/migration-recipe`
- Run TypeScript types codemod (if using TypeScript): `npx types-react-codemod@latest preset-19 ./src`
- Update package.json with React 19 versions
- Install dependencies with `npm install`

#### Testing Checklist
- [x] All functionality from Step 2A still works
- [x] No new console warnings
- [x] Performance is acceptable
- [x] Build completes successfully

#### Summary of Changes
- ✅ Updated React 18.2.0 → 19.0.0
- ✅ Updated React DOM 18.2.0 → 19.0.0
- ✅ Installed dependencies with --legacy-peer-deps (Chakra UI v2 requires this for React 19)
- ✅ Verified no breaking patterns in codebase (PropTypes, defaultProps, ReactDOM.render)
- ✅ Build tested and passing

---

### Step 2C: Address Chakra UI Compatibility

**Estimated Time: Variable (see options)**

#### The Problem
- **Chakra UI v2.8.2** officially supports React 18 only
- **React 19 compatibility:** May work with `--legacy-peer-deps` but has known rendering issues (e.g., popovers)
- **Chakra UI v3** supports React 19 but requires major migration

#### Options

**Option 1: Migrate to Chakra UI v3 Now (Recommended)**
- **Time:** 2-4 days
- **Effort:** High - theme rewrite, component prop changes
- **Risk:** Medium - well-documented migration path
- **See:** Phase 3 for detailed migration steps

**Option 2: Use --legacy-peer-deps Temporarily**
- **Time:** 0 hours
- **Effort:** None - just install with flag
- **Risk:** High - may encounter rendering bugs
- **Recommendation:** Only if deferring Chakra v3 migration

**Option 3: Switch to Alternative UI Library**
- **Time:** 3-5 days
- **Options:** Mantine, shadcn/ui, Material-UI
- **Risk:** High - complete UI rewrite

---

## PHASE 3: Chakra UI v3 Migration

**Estimated Time: 2-4 days**

### Dependencies to Update

```json
{
  "@chakra-ui/react": "^3.0.0"
  // Remove: "@emotion/styled" (no longer needed)
  // Remove: "framer-motion" (no longer needed, already removed)
}
```

**Note:** Chakra UI v3 no longer requires `@emotion/styled` or `framer-motion` as dependencies.

### Major Breaking Changes

1. **Theme System Completely Rewritten**
   - `extendTheme` → `createSystem`
   - Breakpoints syntax changed
   - Component customization uses "recipes" instead of "components"

2. **Component Props Renamed**
   - Boolean props: `is<X>` → `<x>` (e.g., `isTruncated` → `truncated`)
   - `noOfLines` → `lineClamp`
   - Check docs for full list

3. **Provider Changes**
   - `<ChakraProvider theme={theme}>` → `<ChakraProvider value={system}>`

### Critical File: `src/index.jsx` Theme Configuration

**Before (Chakra UI v2):**
```javascript
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  breakpoints: {
    sm: '724px',
    md: '1064px',
    lg: '1404px',
    xl: '1744px',
    '2xl': '2084px',
  },
  components: {
    Container: {
      baseStyle: {
        px: '0',
        maxWidth: {
          base: '320px',
          sm: '660px',
          md: '1000px',
          lg: '1340px',
          xl: '1680px',
          '2xl': '2020px',
        },
      },
    },
  },
}
const theme = extendTheme(config)

<ChakraProvider resetCSS={true} theme={theme}>
  {/* app */}
</ChakraProvider>
```

**After (Chakra UI v3):**
```javascript
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

const system = createSystem(defaultConfig, {
  theme: {
    breakpoints: {
      sm: '724px',
      md: '1064px',
      lg: '1404px',
      xl: '1744px',
      '2xl': '2084px',
    },
    tokens: {
      // Color mode and other tokens
    },
  },
  recipes: {
    container: {
      base: {
        px: 0,
        maxWidth: {
          base: '320px',
          sm: '660px',
          md: '1000px',
          lg: '1340px',
          xl: '1680px',
          '2xl': '2020px',
        },
      },
    },
  },
  globalCss: {
    html: {
      colorPalette: 'light',
    },
  },
})

<ChakraProvider value={system}>
  {/* app */}
</ChakraProvider>
```

### Files to Update (29 files with Chakra components)

Must review all component prop usage:
- `src/components/AppHeader.jsx`
- `src/components/AppVersion.jsx`
- All shop-archives components
- All newsletter-archives components
- All kickstarter-archives components

### Testing Checklist
- [ ] All components render correctly
- [ ] Color mode toggle works
- [ ] All breakpoints work
- [ ] All custom theme settings apply
- [ ] No console errors

---

## Package Compatibility Research Summary

### ✅ Packages with React 18/19 Bridge Support
- **@tanstack/react-query v5.x** - Works with both
- **react-router-dom v7.x** - Explicitly designed for React 18→19 migration
- **vite v5.x & v6.x** - Both work with React 18 & 19
- **@vitejs/plugin-react v5.x** - React 19 support
- **react-icons v5.5.0+** - React 19 TypeScript fixes

### ❌ No Bridge Version - Version Locked
- **Chakra UI** - v2 (React 18 only), v3 (React 19+)
- **@microsoft/applicationinsights-react-js** - Version number matches React version (v18.x for React 18, v19.x for React 19)

### ⚠️ Works But Has Known Issues
- **@emotion/react v11.14.0** - TypeScript type conflicts with React 19
- **@emotion/styled v11.14.1** - Ref handling bugs with React 19

### 🗑️ Packages to Remove
- **framer-motion** - Not used (0 imports)
- **simple-react-lightbox** - Deprecated (2021), replace with direct links
- **use-is-in-viewport** - Abandoned (6 years old)
- **history** - No longer needed with React Router v7

---

## Known Issues & Caveats

### Chakra UI v2 with React 19
- **Not officially supported**
- Known issues: Popover positioning bugs, potential rendering glitches
- Workaround: Use `--legacy-peer-deps` or `--force` during installation
- **Recommendation:** Migrate to Chakra UI v3 for full React 19 support

### Emotion Packages with React 19
- TypeScript type conflicts when using styled components
- Ref forwarding issues in some cases
- **Status:** Works but may require `@ts-ignore` in some places
- **Note:** Chakra UI v3 removes @emotion/styled dependency

### React Router v7
- Major breaking changes from v5
- `useRouteMatch` removed - use `useMatch` with explicit paths
- Nested routes require `/*` in parent route paths
- No more `component` or `render` props - use `element` only

---

## Timeline Summary

| Phase | Task | Status | Estimated Time | Actual Time |
|-------|------|--------|----------------|-------------|
| 1 | React 18 + Chakra 2.x | ✅ Complete | ~2-3 days | Completed |
| 2A | Prepare dependencies | ✅ Complete | 6-8 hours | 1 session |
| 2B | Upgrade React to 19 | ✅ Complete | 1-2 hours | ~15 minutes |
| 2C | Address Chakra UI | 🔄 Pending | 0-4 days | - |
| 3 | Chakra UI v3 (if not done in 2C) | 🔄 Pending | 2-4 days | - |
| - | Testing & bug fixes | 🔄 Ongoing | 1-2 days buffer | - |
| **Total** | | **Phase 1, 2A & 2B Done** | **~7-12 days** | **~3-4 days + 2 sessions** |

---

## Migration Tools & Codemods

### React 19
```bash
# Comprehensive migration
npx codemod@latest react/19/migration-recipe

# TypeScript types migration
npx types-react-codemod@latest preset-19 ./src
```

### TanStack Query
- Migration guide: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5
- Mostly import path changes

### React Router
- No official codemod
- Manual migration required
- Guide: https://reactrouter.com/en/main/upgrading/v5

### Chakra UI v3
- **NO CODEMODS AVAILABLE**
- Manual migration required
- Migration guide: https://www.chakra-ui.com/docs/get-started/migration

---

## Rollback Plan

For each step:
1. Work on separate branch
2. Commit frequently
3. Create PR for review before merging
4. Can revert merge commit if issues found
5. Keep old package.json as reference
6. Tag releases after each phase

---

## Resources

### Official Documentation
- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Chakra UI v3 Migration](https://www.chakra-ui.com/docs/get-started/migration)
- [React Router v7 Docs](https://reactrouter.com/)
- [TanStack Query v5 Migration](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5)

### GitHub Issues & Discussions
- [Chakra UI React 19 Support](https://github.com/chakra-ui/chakra-ui/issues/8519)
- [Emotion React 19 Issues](https://github.com/emotion-js/emotion/issues/3186)
- [Framer Motion React 19](https://github.com/framer/motion/issues/2668)

---

## Recommendations

1. ~~**Start with Step 2A**~~ - ✅ **COMPLETED** - All dependencies now React 18/19 compatible
2. ~~**Step 2B**~~ - ✅ **COMPLETED** - Upgraded to React 19
3. **Next: Step 2C** - Address Chakra UI compatibility (migrate to v3 or use --legacy-peer-deps)
4. **Test thoroughly** after each step - don't batch changes
5. **Consider Chakra UI v3 migration** as part of Phase 2C - better to do it once
6. **Budget extra time** for testing and unexpected issues
7. **Use feature branches** for each step - makes rollback easier

---

*Last Updated: 2025-11-15*
*Phase 1: Complete ✅ | Phase 2A: Complete ✅ | Phase 2B: Complete ✅*
