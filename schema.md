# Database Schema Overview

This document summarizes the Prisma schema implemented in `prisma/schema.prisma`, mapping each project-plan section to the relevant models, enums, and relationships.

## Global Enums

- **AdminRole** — `ADMIN`, `SUPER_ADMIN`

## 1. Authentication & Authorization

- **User** — admin accounts with role, profile info, and relationships to sessions, bookings, and activity logs.
- **Account / Session / VerificationToken** — standard auth tables for OAuth/session flows.

## 2. Dashboard Overview (Activity Feed)

- **ActivityLog** — captures user actions (entity, action, metadata) to power recent activity feeds.

## 3. Event Management

- **Event** — core metadata (type, category, status, service-fee settings) plus relations to showtimes, tickets, insights, bookings.
- **EventShowtime** — per-show schedule with capacity and venue.
- **TicketZone** — pricing/service-fee/capacity per showtime.
- **EventCustomField** — configurable fields for ticket/form modes (insights, required flags, options JSON).
- **EventInsight** — high-level insights/metrics definitions for events.

## 4. Booking & Form Management

- **Customer** — attendee/booker profile (full name, nickname, contacts).
- **Booking** — queue entity storing status, assigned admin, financial breakdown, relations to slips/billing/fulfillment/deposits.
- **BookingStatusLog** — timeline of status changes + admin references.
- **FormSubmission** — JSON payload for form-mode answers, tied 1:1 with bookings.

## 5. Payment & Slip Verification

- **PaymentSlip** — uploaded slips with system vs slip amounts, reviewer, and verdict.
- **RefundRequest** — refund records referencing bookings and slips, with bank details and approval status.

## 6. Payment Summary & Ticket Delivery

- **BillingRecord** — normalized bill/invoice data (subtotals, VAT, totals, payment status).
- **Fulfillment** — per-booking fulfillment workflow capturing logistics, VAT-on-delivery charges, tracking info, and pickup/delivery metadata.

## 7. Financial Overview

- **DepositTransaction** — ledger table for held/used/forfeited/refunded deposits, optionally linked to bookings or events.
- **RefundRequest** — reused from section 5 for refund logs/amounts.

## 8. Admin User Management

- **User** (see section 1) — includes `lastLogin`, contact fields, role enums for filtering, and relationships enabling detail/edit flows.

This schema aligns with the “Project Plan: Admin Management System (Ticket & Form Mode)” requirements and provides all necessary relations for Next.js UI features across authentication, dashboard analytics, event creation, booking queues, payments, fulfillment, finance reporting, and admin management.
