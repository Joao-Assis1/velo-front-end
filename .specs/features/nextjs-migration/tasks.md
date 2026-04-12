# Next.js Migration Tasks

## Task List

### TASK-01: Initialize Next.js Project
**Description**: Install Next.js dependencies and create base files (app/ directory, layout.tsx, page.tsx, next.config.ts)
**Where**: Root directory
**Depends on**: Nothing
**Reuses**: tailwind.config.ts (if exists), package.json
**Done when**: `npm run dev` starts a Next.js server and renders a hello world page
**Tests**: `curl http://localhost:3000` returns 200 and Next.js default page
**Gate**: pass

### TASK-02: Setup Tailwind & ShadCN
**Description**: Configure Tailwind CSS with Next.js and initialize ShadCN UI base
**Where**: Root directory, src/lib/utils.ts, src/components/ui/
**Depends on**: TASK-01
**Reuses**: Existing @tailwindcss/vite config (adapt to next.js)
**Done when**: ShadCN 'button' component can be added and rendered with proper styling
**Tests**: ShadCN button is visible and styled according to the Velo theme
**Gate**: pass

### TASK-03: Extract Types and Mock Data
**Description**: Move types and mock data from App.tsx to dedicated files
**Where**: src/types/index.ts, src/constants/mockData.ts
**Depends on**: Nothing
**Reuses**: App.tsx content
**Done when**: Types and mock data are accessible from other components via imports
**Tests**: `grep` check for existence of extracted types in new files
**Gate**: pass

### TASK-04: Migrate AppContext
**Description**: Refactor AppContext to be compatible with Next.js (client components)
**Where**: src/context/AppContext.tsx
**Depends on**: TASK-03
**Reuses**: Existing AppContext.tsx
**Done when**: AppContext provides state and actions to children in Next.js layout
**Tests**: Context values accessible in a test client component
**Gate**: pass

### TASK-05: Create Core Screens as Client Components
**Description**: Extract major screens (SplashScreen, Onboarding, RoleSelection) from App.tsx into separate files in src/components/screens/
**Where**: src/components/screens/
**Depends on**: TASK-03, TASK-04
**Reuses**: App.tsx screen components
**Done when**: Each screen is a separate, importable React component
**Tests**: Visual verification of each screen rendered in a test route
**Gate**: pass

### TASK-06: Implement Basic Next.js Routing
**Description**: Set up initial routes (/, /auth, /student/home, /instructor/dashboard) and connect them to the extracted components
**Where**: src/app/
**Depends on**: TASK-05
**Reuses**: Components from TASK-05
**Done when**: Navigating between URLs correctly renders the appropriate screens
**Tests**: Manual navigation between / and /student/home works correctly
**Gate**: pass

### TASK-07: Cleanup Vite Config
**Description**: Remove Vite-specific files and dependencies after migration is stable
**Where**: Root directory
**Depends on**: TASK-01 through TASK-06
**Reuses**: Nothing
**Done when**: vite.config.ts, index.html, main.tsx are removed and package.json only contains Next.js scripts
**Tests**: `npm run dev` works and no vite files remain
**Gate**: pass

## Dependencies Summary
- TASK-01 and TASK-03 can start immediately
- TASK-02 depends on TASK-01
- TASK-04 depends on TASK-03
- TASK-05 depends on TASK-03 and TASK-04
- TASK-06 depends on TASK-05
- TASK-07 is the final cleanup

## Estimated Effort
- TASK-01: 30 min (setup)
- TASK-02: 45 min (ShadCN/Tailwind)
- TASK-03: 30 min (Extraction)
- TASK-04: 30 min (Context)
- TASK-05: 2 hours (Screen migration - large task)
- TASK-06: 1 hour (Routing)
- TASK-07: 15 min (Cleanup)

Total: ~5.5 hours
