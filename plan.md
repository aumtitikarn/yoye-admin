Project Plan: Admin Management System (Ticket & Form Mode)

1. Authentication & Authorization
   Login Page:

Fields: Email, Password.

Functionality: Session management and secure login.

Registration Page:

Fields: Full Name, Email, Password, Role selection (Admin/SuperAdmin).

Functionality: Create new admin accounts.

2. Dashboard Overview
   Ticket Mode Stats: Display counts for Pending Approval, In Progress, and Total Successful Bookings.

Form Mode Stats: Display counts for New Forms and Pending Review.

Finance Summary: Display Held Deposits, Cumulative Refunds, and Outstanding Balances.

Quick Actions: Shortcut buttons for "Approve Queue," "Verify Slip," "Create Event," and "View Reports."

Recent Activity: A chronological feed of the latest system logs/actions.

3. Event Management
   Search & Filter: Search by Event Name; filter by Type (All, Ticket Mode, Form Mode).

Event Table: Display Name, Type, Status, Total Capacity, Remaining Capacity, and Actions (View/Edit/Delete).

Create Event Logic:

Common Fields: Toggle Status (On/Off), Poster Upload (JPG/PNG, < 5MB, drag-and-drop), Event Name, Remarks.

Ticket Mode Specifics:

Showtime Management: Add showtimes using a Calendar picker.

Zone Management: Per showtime, define Zone Name, Ticket Price, Service Fee, and Capacity.

Insights: Add custom fields (e.g., Reserve Price) with "Required" or "Delete" toggles.

Form Mode Specifics:

Form Date: Calendar picker.

Service Fee / List Name.

Insights: Add custom fields (e.g., Registrant Name) with "Required" or "Delete" toggles.

4. Booking & Form Management
   Search: By Customer Name or Queue ID.

Filters:

Event Category: Concert, Product Pre-order, Fan Meeting.

Status: Pending, Approved, In Progress, Completed, Cancelled.

Queue Table: Queue ID, Event Name, Customer Name, Type, Status, Created Date, Amount, Actions (Details/Approve/Cancel).

5. Payment & Slip Verification
   Slip Verification:

Filters: All, Deposit Slip, Ticket/Product Slip, Service Fee Slip.

Table: Slip ID, Queue ID, Customer, Type, System Amount, Slip Amount, Status, Date, Actions (Confirm/Reject).

Refund Management:

Table: Nickname/Booker Name, Booking ID, Bank Name, Account/PromptPay/ID Card No., Account Holder Name, Refund Amount, Status, Request Date, Actions (Approve/Reject).

6. Payment Summary & Ticket Delivery
   Search: Booking ID, Customer Name, Event Name, or Phone Number.

Filters: Payment Status and Delivery Status (Paid, Waiting for Pickup, Shipped, Completed, etc.).

Bill Management Logic:

ค่ากดบัตรรวมค่าธรรมเนียมไว้แล้ว (ไม่มีช่องแยก Service Fee).

On-site Pickup / Grab: No VAT applied.

Shipping: Apply 7% VAT only when fulfillment = Delivery, calculated from (Ticket Fee รวมค่าธรรมเนียม + Shipping Fee).

Actions: Manage Bill/Invoice details.

7. Financial Overview
   Summary Cards: Total Deposits, Amount Converted to Service Fees, Forfeited Deposits, Total Refunded.

Detailed Tables:

Deposits: Search by ID/Event; Filter by Status (Held, Used, Forfeited, Refunded).

Tickets & Fees: Log of transaction details, dates, and types.

Refund Logs: Customer name, Reason, Date, and Amount.

8. Admin User Management
   Search: Name, Email, or User ID.

Filters: Role (Admin, SuperAdmin).

Admin Table: ID, Name, Email, Permissions, Last Login, Actions (View/Edit).

All Status Lifecicle
A. Booking & Operation Lifecycle
Queue Phase:

WAITING_FOR_APPROVAL: Initial state after customer joins.

WAITING_FOR_DEPOSIT: Approved by admin, waiting for customer payment.

PENDING_DEPOSIT_VERIFICATION: Slip uploaded, waiting for admin check.

QUEUE_SUCCESS: Deposit verified; queue is secured.

WAITING_FOR_BOOKING_INFO: Waiting for customer to provide specific ticket details.

Payment Phase (Store Proxy):

TRANSFERRING_TICKET_FEE: Customer transferring ticket cost to the system.

CONFIRMED_TICKET_FEE: System received ticket funds.

WAITING_ADMIN_CONFIRMATION: Admin verifying final data before booking starts.

READY_TO_BOOK: System is prepared for the booking window.

Live Booking Phase:

BOOKING_IN_PROGRESS: Team is currently attempting to secure tickets.

PARTIALLY_BOOKED: Some tickets secured, others pending.

FULLY_BOOKED: All requested tickets secured.

BOOKING_FAILED: No tickets were secured by the team.

Customer Self-Booking (Conflict Handling):

CUSTOMER_SECURED_WAITING_VERIFY: Customer claims they got tickets; waiting for team check.

TEAM_NOT_SECURED: Team confirmed they didn't get tickets (matches customer claim).

TEAM_SECURED: Team also got tickets (duplicate booking).

PARTIAL_MIXED: Customer got some, team got some; calculating final finance.

Service Fee Phase:

WAITING_FOR_SERVICE_FEE: Waiting for customer to pay the booking/service fee.

PENDING_SERVICE_FEE_VERIFICATION: Slip uploaded for service fee.

SERVICE_FEE_PAID: Service fee settled.

B. Deposit Management Status
DEPOSIT_ACTIVE: Held in system, ready for use.

DEPOSIT_USED_AS_FEE: Converted to cover service fees.

DEPOSIT_FORFEITED: Seized due to cancellation or breach of terms.

WAITING_FOR_REFUND: Marked for return to customer.

REFUND_COMPLETED: Funds successfully transferred back.

C. Final Project Closure
COMPLETED: Transaction finished, tickets delivered, all fees paid.

CANCELLED_FORFEITED: Booking cancelled; deposit seized.

CLOSED_REFUNDED: Job closed and refund has been issued to the customer.

Implementation Notes for Agent:
Status Transitions: Ensure that the UI only allows valid transitions (e.g., cannot move from WAITING_FOR_DEPOSIT to READY_TO_BOOK without verification).

Color Coding: Use specific colors for each phase (Queue = Blue, Booking = Orange, Success = Green, Failed/Cancelled = Red).

Audit Log: Every status change must be logged in the Recent Activity section with a timestamp and the Admin ID who performed the action.
