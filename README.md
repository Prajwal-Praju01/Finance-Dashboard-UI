# Finance Dashboard UI

A modern, responsive SaaS-style finance dashboard built with React, TypeScript, Tailwind CSS, Zustand, and Recharts.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build locally:

```bash
npm run preview
```

## Features

- Dashboard overview cards for total balance, income, and expenses
- Time-based balance and income trend chart
- Category-based expense donut chart
- Transaction module with:
  - search
  - type filtering (income/expense)
  - category filtering
  - date range filtering (30d/90d/YTD)
  - sorting by date and amount
  - grouping by category, month, or type
- Frontend role simulation:
  - Admin: add/edit/delete transactions
  - Viewer: read-only mode
- Insights section with:
  - highest spending category
  - monthly comparison (current month vs last month)
  - average expense and savings rate
- Empty states and loading skeleton
- Dark mode toggle (persisted)
- Mock API integration with async CRUD simulation
- Local storage persistence for role, theme, and mock API data
- CSV export for filtered transactions
- JSON export for filtered transactions
- Mobile, tablet, and desktop responsive layout

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (state management)
- Recharts (visualizations)
- Framer Motion (subtle motion)
- date-fns (date math and formatting)

## Mock API Notes

- The mock API is implemented in `src/utils/mockApi.ts`.
- Transactions are read/written asynchronously with simulated latency.
- API-backed transaction data is persisted in browser local storage.
- The dashboard surfaces API loading and error states inline.

## Project Structure

```text
src/
  components/
    common/
    dashboard/
    insights/
    transactions/
  hooks/
  pages/
  store/
  types/
  utils/
```

## Design Decisions

- Centralized state in Zustand keeps business logic separate from presentation.
- Reusable primitives (`Card`, `ChartPanel`, `StatCard`, `EmptyState`) make the UI scalable.
- Derived analytics live in utility functions, not component trees, so rendering remains focused.
- Role checks are enforced in both UI and state actions to simulate permission boundaries.
- Theme mode is controlled from centralized state and applied globally via class-based dark mode.
- Styling uses Tailwind with a custom light-first SaaS visual language and responsive grid patterns.

## Notes

- Mock transactions are included out of the box.
- If all transactions are removed in Admin mode, you can restore demo data with the built-in action.
