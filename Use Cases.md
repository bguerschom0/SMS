# School Management System - Use Cases

## Table of Contents
- [User Management](#user-management)
- [Student Management](#student-management)
- [Fee Management](#fee-management)
- [Payment Management](#payment-management)
- [Expense Management](#expense-management)
- [Reporting](#reporting)
- [System Administration](#system-administration)

## User Management

### UC-UM-001: User Authentication

**Primary Actor:** All Users  
**Stakeholders:** Administrators, School Staff, Accountants  
**Preconditions:** User has valid credentials  
**Main Success Scenario:**
1. User navigates to the login page
2. User enters email/username and password
3. System validates the credentials
4. System authenticates the user
5. System redirects user to the dashboard with appropriate permissions

**Alternative Flows:**
- **Invalid Credentials:** System displays error message and prompts user to try again
- **Forgotten Password:** User clicks "Forgot Password" and follows password recovery process

**Postconditions:** User is logged in and can access authorized features

---

### UC-UM-002: User Account Management

**Primary Actor:** Administrator  
**Stakeholders:** School Staff, Accountants  
**Preconditions:** Administrator is logged in  
**Main Success Scenario:**
1. Administrator navigates to the user management section
2. Administrator adds/edits/deactivates user accounts
3. Administrator assigns appropriate roles to users
4. System saves the changes
5. System sends email notification to affected users

**Alternative Flows:**
- **Self-Registration:** New user completes registration form, administrator approves request
- **Password Reset:** Administrator initiates password reset for user

**Postconditions:** User accounts are properly managed and configured

---

### UC-UM-003: User Profile Management

**Primary Actor:** All Users  
**Stakeholders:** Users  
**Preconditions:** User is logged in  
**Main Success Scenario:**
1. User navigates to profile settings
2. User updates personal information
3. User changes password (optional)
4. System validates the changes
5. System saves the updated profile

**Alternative Flows:**
- **Invalid Information:** System displays error message, prompts correction
- **Password Complexity:** System enforces password requirements

**Postconditions:** User profile is updated with new information

---

## Student Management

### UC-SM-001: Student Registration

**Primary Actor:** Administrator/Staff  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** User has appropriate permissions  
**Main Success Scenario:**
1. User navigates to the Students section
2. User clicks "Add Student" button
3. User enters student details (personal info, guardian info, etc.)
4. System validates the information
5. System generates unique student ID
6. System saves the new student record

**Alternative Flows:**
- **Validation Error:** System highlights invalid fields and prompts correction
- **Duplicate Student ID:** System warns user and suggests alternative ID

**Postconditions:** New student is registered in the system

---

### UC-SM-002: Update Student Information

**Primary Actor:** Administrator/Staff  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Student record exists in the system  
**Main Success Scenario:**
1. User searches for and selects the student
2. User clicks "Edit" button
3. User modifies student information
4. System validates the changes
5. System saves the updated record

**Alternative Flows:**
- **Validation Error:** System highlights invalid fields and prompts correction
- **Cancel Update:** User cancels the edit, no changes saved

**Postconditions:** Student information is updated in the system

---

### UC-SM-003: Deactivate/Activate Student

**Primary Actor:** Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Student record exists in the system  
**Main Success Scenario:**
1. User searches for and selects the student
2. User clicks "Deactivate" button
3. System prompts for confirmation
4. User confirms the action
5. System marks student as inactive

**Alternative Flows:**
- **Cancel Deactivation:** User cancels the action, no changes made
- **Reactivation:** User clicks "Activate" on an inactive student record

**Postconditions:** Student status is updated in the system

---

### UC-SM-004: View Student Details

**Primary Actor:** Administrator/Staff  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Student record exists in the system  
**Main Success Scenario:**
1. User searches for and selects the student
2. System displays comprehensive student information
3. User can view personal details, fee history, payment records, etc.

**Alternative Flows:**
- **Limited Access:** Based on user role, certain information may be restricted

**Postconditions:** User has viewed student information

---

## Fee Management

### UC-FM-001: Create Fee Type

**Primary Actor:** Administrator  
**Stakeholders:** School Administration, Accountants  
**Preconditions:** User has administrative permissions  
**Main Success Scenario:**
1. Administrator navigates to Settings > Fee Types
2. Administrator clicks "Add Fee Type" button
3. Administrator enters fee type details (name, amount, frequency)
4. System validates the information
5. System saves the new fee type

**Alternative Flows:**
- **Validation Error:** System highlights invalid fields and prompts correction
- **Duplicate Fee Type:** System warns about duplicate name

**Postconditions:** New fee type is available for use in the system

---

### UC-FM-002: Schedule Individual Fee

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Student record and fee type exist in the system  
**Main Success Scenario:**
1. User navigates to student's profile
2. User selects "Fees" tab
3. User clicks "Add Fee" button
4. User selects fee type and sets due date
5. System calculates fee amount based on fee type
6. User saves the fee
7. System records the fee for the student

**Alternative Flows:**
- **Custom Amount:** User overrides the default fee amount
- **Cancel:** User cancels the action, no fee is scheduled

**Postconditions:** Fee is scheduled for the student

---

### UC-FM-003: Schedule Bulk Fees

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Students and fee types exist in the system  
**Main Success Scenario:**
1. User navigates to Fees section
2. User clicks "Schedule Fees" button
3. User selects fee type and due date
4. User selects student group (All, Class, Custom)
5. System displays summary of affected students
6. User confirms the action
7. System schedules fees for all selected students

**Alternative Flows:**
- **Custom Selection:** User manually selects specific students
- **Class-based Selection:** User selects students by class
- **Cancel:** User cancels the action, no fees are scheduled

**Postconditions:** Fees are scheduled for the selected students

---

### UC-FM-004: Update Fee Status

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Fee record exists in the system  
**Main Success Scenario:**
1. User navigates to fee details
2. User clicks "Update Status" button
3. User selects new status (paid, partial, unpaid)
4. User confirms the change
5. System updates the fee status

**Alternative Flows:**
- **Automatic Update:** System automatically updates fee status when payment is recorded
- **Cancel:** User cancels the action, status remains unchanged

**Postconditions:** Fee status is updated in the system

---

## Payment Management

### UC-PM-001: Record Individual Payment

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Student record exists in the system  
**Main Success Scenario:**
1. User navigates to Payments section
2. User clicks "New Payment" button
3. User selects student
4. User selects specific fee (optional)
5. User enters payment details (amount, method, date)
6. System generates receipt number
7. User confirms the payment
8. System records the payment and updates fee status if applicable

**Alternative Flows:**
- **No Fee Selection:** Payment recorded without linking to specific fee
- **Partial Payment:** Amount less than total fee, status updated to "partial"
- **Cancel:** User cancels the action, no payment recorded

**Postconditions:** Payment is recorded in the system; receipt is generated

---

### UC-PM-002: Process Bulk Payments

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Student records exist in the system  
**Main Success Scenario:**
1. User navigates to Payments section
2. User clicks "Process Bulk Payments" button
3. User selects multiple students
4. User selects fee type (optional)
5. User enters payment details (amount, method, date)
6. System displays summary of payments to be processed
7. User confirms the action
8. System records payments for all selected students

**Alternative Flows:**
- **Partial Selection:** User selects subset of students from list
- **Cancel:** User cancels the action, no payments recorded

**Postconditions:** Payments are recorded for all selected students; receipts are generated

---

### UC-PM-003: Generate/Print Receipt

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents  
**Preconditions:** Payment record exists in the system  
**Main Success Scenario:**
1. User navigates to payment details
2. User clicks "Download Receipt" button
3. System generates PDF receipt
4. User downloads and/or prints the receipt

**Alternative Flows:**
- **Email Receipt:** User chooses to email receipt to guardian/student
- **Bulk Receipts:** User generates multiple receipts for batch payments

**Postconditions:** Receipt is downloaded, printed, or emailed

---

### UC-PM-004: View Payment History

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** Students, Parents, School Administration  
**Preconditions:** Payment records exist in the system  
**Main Success Scenario:**
1. User navigates to Payments section
2. User applies filters (date range, student, payment method)
3. System displays filtered payment records
4. User can view details of individual payments

**Alternative Flows:**
- **Student-specific History:** User views payments from student profile
- **Export:** User exports payment history to CSV/PDF

**Postconditions:** User has viewed payment history

---

## Expense Management

### UC-EM-001: Record Expense

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** School Administration  
**Preconditions:** User has appropriate permissions  
**Main Success Scenario:**
1. User navigates to Expenses section
2. User clicks "Add Expense" button
3. User selects expense type
4. User enters expense details (amount, date, description)
5. User uploads receipt document (optional)
6. System validates the information
7. System records the expense

**Alternative Flows:**
- **Validation Error:** System highlights invalid fields and prompts correction
- **Cancel:** User cancels the action, no expense recorded

**Postconditions:** Expense is recorded in the system

---

### UC-EM-002: Create Expense Type

**Primary Actor:** Administrator  
**Stakeholders:** School Administration, Accountants  
**Preconditions:** User has administrative permissions  
**Main Success Scenario:**
1. Administrator navigates to Settings > Expense Types
2. Administrator clicks "Add Expense Type" button
3. Administrator enters expense type details (name, description)
4. System validates the information
5. System saves the new expense type

**Alternative Flows:**
- **Validation Error:** System highlights invalid fields and prompts correction
- **Duplicate Type:** System warns about duplicate name

**Postconditions:** New expense type is available for use in the system

---

### UC-EM-003: View/Filter Expenses

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** School Administration  
**Preconditions:** Expense records exist in the system  
**Main Success Scenario:**
1. User navigates to Expenses section
2. User applies filters (date range, expense type)
3. System displays filtered expense records
4. User can view details of individual expenses

**Alternative Flows:**
- **Export:** User exports expense data to CSV/PDF

**Postconditions:** User has viewed filtered expense data

---

## Reporting

### UC-RP-001: Generate Financial Report

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** School Administration  
**Preconditions:** Financial data exists in the system  
**Main Success Scenario:**
1. User navigates to Reports section
2. User selects report type (Income vs Expense, Fee Collection, etc.)
3. User sets parameters (date range, etc.)
4. System generates the report with visualizations
5. User reviews the report

**Alternative Flows:**
- **Export:** User exports report to PDF/CSV
- **Print:** User prints the report
- **No Data:** System shows appropriate message if no data meets criteria

**Postconditions:** Report is generated and viewed

---

### UC-RP-002: Generate Outstanding Fees Report

**Primary Actor:** Accountant/Administrator  
**Stakeholders:** School Administration, Teachers  
**Preconditions:** Fee records exist in the system  
**Main Success Scenario:**
1. User navigates to Reports section
2. User selects "Outstanding Fees" report
3. User applies filters (class, date, etc.)
4. System generates report of unpaid/partially paid fees
5. User reviews the report

**Alternative Flows:**
- **Take Action:** User can directly contact defaulters from report
- **Export:** User exports report for further processing

**Postconditions:** Outstanding fees report is generated and viewed

---

### UC-RP-003: View Dashboard Analytics

**Primary Actor:** All Users (based on permissions)  
**Stakeholders:** School Administration  
**Preconditions:** User is logged in; data exists in the system  
**Main Success Scenario:**
1. User navigates to Dashboard
2. System displays key metrics and visualizations
3. User interacts with dashboard widgets
4. User gains insights from the data presented

**Alternative Flows:**
- **Date Range:** User adjusts time period for dashboard data
- **Refresh:** User refreshes dashboard for real-time data

**Postconditions:** User has viewed and analyzed dashboard data

---

## System Administration

### UC-SA-001: Configure System Settings

**Primary Actor:** Administrator  
**Stakeholders:** All Users  
**Preconditions:** User has administrative permissions  
**Main Success Scenario:**
1. Administrator navigates to Settings section
2. Administrator modifies system settings (school info, academic year, etc.)
3. System validates the changes
4. System saves the updated settings

**Alternative Flows:**
- **Validation Error:** System highlights invalid settings and prompts correction
- **Cancel:** Administrator cancels changes, settings remain unchanged

**Postconditions:** System settings are updated

---

### UC-SA-002: Manage Notification Settings

**Primary Actor:** Administrator  
**Stakeholders:** All Users  
**Preconditions:** User has administrative permissions  
**Main Success Scenario:**
1. Administrator navigates to Settings > Notifications
2. Administrator configures notification options (email alerts, reminders, etc.)
3. System validates the configuration
4. System saves the notification settings

**Alternative Flows:**
- **Test Notification:** Administrator sends test notification
- **Default Settings:** Administrator resets to default configuration

**Postconditions:** Notification settings are configured

---

### UC-SA-003: Database Backup/Restore

**Primary Actor:** Administrator  
**Stakeholders:** All Users, School Administration  
**Preconditions:** User has administrative permissions  
**Main Success Scenario:**
1. Administrator navigates to System Maintenance
2. Administrator initiates database backup
3. System processes and creates backup file
4. Administrator downloads the backup file for safekeeping

**Alternative Flows:**
- **Scheduled Backup:** System automatically performs backup on schedule
- **Restore:** Administrator uploads backup file and restores system
- **Cancel:** Administrator cancels operation

**Postconditions:** System data is backed up or restored
