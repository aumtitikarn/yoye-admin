# Project Structure Aligned to Plan

This document mirrors the sections in `plan.md`, restating each requirement block and mapping it to the concrete files and responsibilities inside the repository.

## 1. Authentication & Authorization

- **Plan summary:**
  - Login page with Email + Password, secure session handling.
  - Registration with Full Name, Email, Password, Role selection (Admin/SuperAdmin).
- **Implementation files:**
  - `/app/auth/signin/page.tsx` — Implements the login form UI and demo redirect logic to the dashboard.
  - `/app/auth/signup/page.tsx` — Implements the registration form UI, validations, and demo redirect logic.
  - `/app/api/auth/login/route.ts` — API route stub for login (can be expanded when backend wiring resumes).
  - `/app/api/auth/register/route.ts` — API route stub for admin creation.
  - `/app/dashboard/layout.tsx` — Provides the authenticated shell; houses the profile dropdown + logout redirection.

## 2. Dashboard Overview

- **Plan summary:** Ticket & Form stats, finance summary, quick actions, and recent activity feed.
- **Implementation files:**
  - `/app/dashboard/page.tsx` — Landing overview containing the KPI cards, quick action buttons, and recent activity list.
  - `/app/dashboard/layout.tsx` — Shared sidebar/topbar shell used by all dashboard routes, ensuring consistent navigation between overview and the rest of the areas.

## 3. Event Management

- **Plan summary:** Search/filter by event type, tabular results, and create-event logic supporting ticket/form modes.
- **Implementation files:**
  - `/app/dashboard/events/page.tsx` — Page component listing events with filters.
  - `/app/dashboard/events/components/create-event-dialog.tsx` — Dialog-based creator handling common/ticket/form-specific fields, showtime + zone management, insight fields, etc.
  - `/app/dashboard/events/create/page.tsx` — Full-page creator view (mirrors dialog logic for long-form editing as requirements evolve).

## 4. Booking & Form Management

- **Plan summary:** Queue search, filters by category/status, queue table with actions.
- **Implementation files:**
  - `/app/dashboard/bookings/page.tsx` — Houses search inputs, category/status filters, and the queue table with action buttons for detail/approve/cancel flows.

## 5. Payment & Slip Verification

- **Plan summary:** Slip verification filters + table, refund management table with approval actions.
- **Implementation files:**
  - `/app/dashboard/payments/page.tsx` — Implements the slip-verification workspace (filters + results) and the refund management table described in the plan.
  - `/app/components` (shared UI such as `Table`, `Tabs`, `Button`, etc.) — reused to render the tabular verification UIs and action buttons.

## 6. Payment Summary & Ticket Delivery

- **Plan summary:** Search/filter by booking/customer/event/phone, manage bills, differentiate pickup vs shipping (VAT rules) with fulfillment-first workflow.
- **Implementation files:**
  - `/app/dashboard/tracking/page.tsx` — Payment & fulfillment dashboard with the orders table and the “จัดการบิล” dialog implementing fulfillment selection (ETicket/Pickup/Delivery), billing details, VAT-aware totals (7% on delivery service + shipping), and layout tweaks requested in the plan.

## 7. Financial Overview

- **Plan summary:** Summary cards (deposits, service fees, forfeits, refunds) and detailed tables for deposits, ticket fees, refund logs with filters/search.
- **Implementation files:**
  - `/app/dashboard/finance/page.tsx` — Finance dashboard containing mocked summary metrics plus deposit/ticket/refund tables aligned with plan specs.

## 8. Admin User Management

- **Plan summary:** Search by name/email/ID, filter by role, table showing admin info, action to view/edit using SignUp layout, editable role combobox.
- **Implementation files:**
  - `/app/dashboard/users/page.tsx` — Search + filter inputs, shadcn-based admin table, and detail dialog that reuses SignUp-style inputs with editable fields and role combobox.

## Shared Utilities & Supporting Files

- `/app/dashboard/layout.tsx` — Core shell used across dashboard sections, ensuring navigation, profile menu, and logout behavior match the plan’s authenticated experience.
- `/lib/prisma.ts` — Prisma client bootstrap for future persistence work mentioned indirectly in the plan (e.g., storing bookings, events, admins).
- `/lib/utils.ts` and `/components/ui/*` — Shared helpers and UI primitives (buttons, tables, dropdowns, dialogs) powering the interactions specified throughout the plan sections.
