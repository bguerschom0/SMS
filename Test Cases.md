# School Management System - Test Cases

## Table of Contents
- [Authentication Testing](#authentication-testing)
- [Student Module Testing](#student-module-testing)
- [Fee Module Testing](#fee-module-testing)
- [Payment Module Testing](#payment-module-testing)
- [Expense Module Testing](#expense-module-testing)
- [Reporting Module Testing](#reporting-module-testing)
- [Settings Module Testing](#settings-module-testing)
- [Integration Testing](#integration-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Usability Testing](#usability-testing)
- [Compatibility Testing](#compatibility-testing)

## Authentication Testing

### TC-AUTH-001: User Login (Positive)
**Description:** Verify that a user can successfully log in with valid credentials  
**Preconditions:** User account exists in the system  
**Test Steps:**
1. Navigate to login page
2. Enter valid email/username
3. Enter valid password
4. Click "Sign In" button

**Expected Result:** User is authenticated and redirected to the Dashboard  
**Status:** Not Tested  
**Priority:** High

### TC-AUTH-002: User Login (Negative)
**Description:** Verify that a user cannot log in with invalid credentials  
**Preconditions:** User account exists in the system  
**Test Steps:**
1. Navigate to login page
2. Enter valid email/username
3. Enter invalid password
4. Click "Sign In" button

**Expected Result:** Error message displayed; user remains on login page  
**Status:** Not Tested  
**Priority:** High

### TC-AUTH-003: Password Reset
**Description:** Verify that a user can reset their password  
**Preconditions:** User account exists in the system  
**Test Steps:**
1. Navigate to login page
2. Click "Forgot Password" link
3. Enter registered email
4. Click "Reset Password" button
5. Open email and click reset link
6. Enter new password
7. Confirm new password
8. Click "Save" button

**Expected Result:** Password is changed; user can log in with new password  
**Status:** Not Tested  
**Priority:** Medium

### TC-AUTH-004: Session Timeout
**Description:** Verify that user session expires after the configured timeout period  
**Preconditions:** User is logged in  
**Test Steps:**
1. Leave the system idle for the configured timeout period
2. Attempt to perform an action

**Expected Result:** User is redirected to login page  
**Status:** Not Tested  
**Priority:** Medium

### TC-AUTH-005: Role-Based Access Control
**Description:** Verify that users can only access functionality based on their role  
**Preconditions:** User accounts with different roles exist  
**Test Steps:**
1. Log in as user with limited permissions
2. Attempt to access restricted pages/functions

**Expected Result:** Access denied; appropriate error message displayed  
**Status:** Not Tested  
**Priority:** High

## Student Module Testing

### TC-STU-001: Add New Student
**Description:** Verify that a new student can be added to the system  
**Preconditions:** User has permission to add students  
**Test Steps:**
1. Navigate to Students page
2. Click "Add Student" button
3. Fill in all required fields
4. Click "Save Student" button

**Expected Result:** Student is added; success message displayed; student appears in the list  
**Status:** Not Tested  
**Priority:** High

### TC-STU-002: Edit Student Information
**Description:** Verify that student information can be updated  
**Preconditions:** At least one student exists in the system  
**Test Steps:**
1. Navigate to Students page
2. Select a student to edit
3. Click "Edit Student" button
4. Modify student information
5. Click "Update Student" button

**Expected Result:** Student information is updated; success message displayed  
**Status:** Not Tested  
**Priority:** High

### TC-STU-003: Deactivate Student
**Description:** Verify that a student can be deactivated  
**Preconditions:** At least one active student exists in the system  
**Test Steps:**
1. Navigate to student's profile
2. Click "Deactivate" button
3. Confirm the action

**Expected Result:** Student status changes to inactive; success message displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-STU-004: Search for Students
**Description:** Verify that students can be searched using different criteria  
**Preconditions:** Multiple students exist in the system  
**Test Steps:**
1. Navigate to Students page
2. Enter search term in search field
3. Apply additional filters if needed

**Expected Result:** Only students matching the search criteria are displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-STU-005: View Student Profile
**Description:** Verify that a student's complete profile can be viewed  
**Preconditions:** At least one student exists in the system  
**Test Steps:**
1. Navigate to Students page
2. Click on a student's name

**Expected Result:** Student's profile page displayed with all information  
**Status:** Not Tested  
**Priority:** Medium

## Fee Module Testing

### TC-FEE-001: Schedule Fee for Individual Student
**Description:** Verify that a fee can be scheduled for an individual student  
**Preconditions:** At least one student and fee type exist in the system  
**Test Steps:**
1. Navigate to student's profile
2. Click "Fees" tab
3. Click "Add Fee" button
4. Select fee type and enter details
5. Click "Save" button

**Expected Result:** Fee is scheduled and appears in student's fee list  
**Status:** Not Tested  
**Priority:** High

### TC-FEE-002: Schedule Fee for Multiple Students
**Description:** Verify that a fee can be scheduled for multiple students at once  
**Preconditions:** Multiple students and at least one fee type exist in the system  
**Test Steps:**
1. Navigate to Fees page
2. Click "Schedule Fees" button
3. Select fee type and enter details
4. Select student group or individual students
5. Click "Schedule Fees" button

**Expected Result:** Fee is scheduled for all selected students; success message displayed  
**Status:** Not Tested  
**Priority:** High

### TC-FEE-003: Update Fee Status
**Description:** Verify that a fee's status can be updated  
**Preconditions:** At least one fee exists in the system  
**Test Steps:**
1. Navigate to fee details
2. Click "Update Status" button
3. Select new status
4. Click "Save Changes" button

**Expected Result:** Fee status is updated; success message displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-FEE-004: View Outstanding Fees
**Description:** Verify that outstanding fees can be viewed and filtered  
**Preconditions:** Fees with different statuses exist in the system  
**Test Steps:**
1. Navigate to Fees page
2. Apply filter for unpaid fees

**Expected Result:** Only unpaid fees are displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-FEE-005: Delete Fee
**Description:** Verify that a fee can be deleted  
**Preconditions:** At least one fee exists in the system  
**Test Steps:**
1. Navigate to fee details
2. Click "Delete" button
3. Confirm the action

**Expected Result:** Fee is deleted and no longer appears in the list  
**Status:** Not Tested  
**Priority:** Low

## Payment Module Testing

### TC-PAY-001: Record Individual Payment
**Description:** Verify that a payment can be recorded for a student  
**Preconditions:** At least one student with scheduled fees exists  
**Test Steps:**
1. Navigate to Payments page
2. Click "New Payment" button
3. Select student and fee (optional)
4. Enter payment details
5. Click "Record Payment" button

**Expected Result:** Payment is recorded; receipt is generated; success message displayed  
**Status:** Not Tested  
**Priority:** High

### TC-PAY-002: Process Bulk Payments
**Description:** Verify that payments can be processed for multiple students at once  
**Preconditions:** Multiple students exist in the system  
**Test Steps:**
1. Navigate to Payments page
2. Click "Process Bulk Payments" button
3. Select students
4. Enter payment details
5. Click "Process Payments" button

**Expected Result:** Payments are recorded for all selected students; receipts are generated  
**Status:** Not Tested  
**Priority:** High

### TC-PAY-003: Download Payment Receipt
**Description:** Verify that a payment receipt can be downloaded as PDF  
**Preconditions:** At least one payment exists in the system  
**Test Steps:**
1. Navigate to payment details
2. Click "Download Receipt" button

**Expected Result:** PDF receipt is downloaded  
**Status:** Not Tested  
**Priority:** Medium

### TC-PAY-004: Email Payment Receipt
**Description:** Verify that a payment receipt can be emailed  
**Preconditions:** At least one payment exists in the system  
**Test Steps:**
1. Navigate to payment details
2. Click "Email Receipt" button
3. Enter email address
4. Click "Send Receipt" button

**Expected Result:** Receipt is emailed to the specified address; success message displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-PAY-005: Filter Payments
**Description:** Verify that payments can be filtered based on different criteria  
**Preconditions:** Multiple payments with different attributes exist  
**Test Steps:**
1. Navigate to Payments page
2. Apply various filters (date range, payment method, status)

**Expected Result:** Only payments matching the filter criteria are displayed  
**Status:** Not Tested  
**Priority:** Medium

## Expense Module Testing

### TC-EXP-001: Record Expense
**Description:** Verify that an expense can be recorded  
**Preconditions:** User has permission to manage expenses  
**Test Steps:**
1. Navigate to Expenses page
2. Click "Add Expense" button
3. Enter expense details
4. Click "Record Expense" button

**Expected Result:** Expense is recorded; success message displayed  
**Status:** Not Tested  
**Priority:** High

### TC-EXP-002: Edit Expense
**Description:** Verify that an expense can be edited  
**Preconditions:** At least one expense exists in the system  
**Test Steps:**
1. Navigate to expense details
2. Click "Edit" button
3. Modify expense details
4. Click "Update Expense" button

**Expected Result:** Expense is updated; success message displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-EXP-003: Delete Expense
**Description:** Verify that an expense can be deleted  
**Preconditions:** At least one expense exists in the system  
**Test Steps:**
1. Navigate to expense details
2. Click "Delete" button
3. Confirm the action

**Expected Result:** Expense is deleted and no longer appears in the list  
**Status:** Not Tested  
**Priority:** Medium

### TC-EXP-004: Filter Expenses
**Description:** Verify that expenses can be filtered based on different criteria  
**Preconditions:** Multiple expenses with different attributes exist  
**Test Steps:**
1. Navigate to Expenses page
2. Apply various filters (date range, expense type)

**Expected Result:** Only expenses matching the filter criteria are displayed  
**Status:** Not Tested  
**Priority:** Medium

## Reporting Module Testing

### TC-REP-001: Generate Income vs Expense Report
**Description:** Verify that an income vs expense report can be generated  
**Preconditions:** Payment and expense data exists in the system  
**Test Steps:**
1. Navigate to Reports page
2. Select "Income vs Expense" report
3. Set date range
4. View the report

**Expected Result:** Report is generated with accurate data and visualizations  
**Status:** Not Tested  
**Priority:** High

### TC-REP-002: Generate Outstanding Fees Report
**Description:** Verify that an outstanding fees report can be generated  
**Preconditions:** Unpaid fees exist in the system  
**Test Steps:**
1. Navigate to Reports page
2. Select "Outstanding Fees" report
3. View the report

**Expected Result:** Report displays all unpaid fees with accurate amounts  
**Status:** Not Tested  
**Priority:** High

### TC-REP-003: Export Report to PDF
**Description:** Verify that reports can be exported to PDF  
**Preconditions:** Report data exists  
**Test Steps:**
1. Generate a report
2. Click "Export PDF" button

**Expected Result:** Report is exported as a properly formatted PDF file  
**Status:** Not Tested  
**Priority:** Medium

### TC-REP-004: Export Report to CSV
**Description:** Verify that reports can be exported to CSV  
**Preconditions:** Report data exists  
**Test Steps:**
1. Generate a report
2. Click "Export CSV" button

**Expected Result:** Report is exported as a CSV file with all data  
**Status:** Not Tested  
**Priority:** Medium

## Settings Module Testing

### TC-SET-001: Update General Settings
**Description:** Verify that general settings can be updated  
**Preconditions:** User has administrative permissions  
**Test Steps:**
1. Navigate to Settings page
2. Select "General" tab
3. Modify settings
4. Click "Save Settings" button

**Expected Result:** Settings are updated; success message displayed  
**Status:** Not Tested  
**Priority:** Medium

### TC-SET-002: Add Fee Type
**Description:** Verify that a new fee type can be added  
**Preconditions:** User has administrative permissions  
**Test Steps:**
1. Navigate to Settings page
2. Select "Fee Types" tab
3. Click "Add Fee Type" button
4. Enter fee type details
5. Click "Add" button

**Expected Result:** Fee type is added and appears in the list  
**Status:** Not Tested  
**Priority:** High

### TC-SET-003: Add Expense Type
**Description:** Verify that a new expense type can be added  
**Preconditions:** User has administrative permissions  
**Test Steps:**
1. Navigate to Settings page
2. Select "Expense Types" tab
3. Click "Add Expense Type" button
4. Enter expense type details
5. Click "Add" button

**Expected Result:** Expense type is added and appears in the list  
**Status:** Not Tested  
**Priority:** High

### TC-SET-004: Configure Notification Settings
**Description:** Verify that notification settings can be configured  
**Preconditions:** User has administrative permissions  
**Test Steps:**
1. Navigate to Settings page
2. Select "Notifications" tab
3. Configure notification options
4. Click "Save Settings" button

**Expected Result:** Notification settings are updated; success message displayed  
**Status:** Not Tested  
**Priority:** Medium

## Integration Testing

### TC-INT-001: Payment and Fee Integration
**Description:** Verify that recording a payment updates the associated fee status  
**Preconditions:** Student with unpaid fee exists  
**Test Steps:**
1. Navigate to Payments page
2. Record a new payment for a student with an unpaid fee
3. Select the specific fee
4. Complete the payment

**Expected Result:** Payment is recorded and fee status is automatically updated to "paid"  
**Status:** Not Tested  
**Priority:** High

### TC-INT-002: Dashboard Data Accuracy
**Description:** Verify that dashboard displays accurate summaries from all modules  
**Preconditions:** Data exists in students, fees, payments, and expenses modules  
**Test Steps:**
1. Navigate to Dashboard
2. Compare displayed metrics with actual data from each module

**Expected Result:** Dashboard metrics match the actual data in the system  
**Status:** Not Tested  
**Priority:** High

### TC-INT-003: Report Data Accuracy
**Description:** Verify that reports accurately reflect data from all modules  
**Preconditions:** Data exists in relevant modules  
**Test Steps:**
1. Generate various reports
2. Compare report data with actual data in the system

**Expected Result:** Report data matches the actual data in the system  
**Status:** Not Tested  
**Priority:** High

## Performance Testing

### TC-PERF-001: Page Load Time
**Description:** Verify that all pages load within acceptable time limits  
**Preconditions:** System is in normal operating condition  
**Test Steps:**
1. Navigate to various pages in the system
2. Measure load time for each page

**Expected Result:** All pages load in less than 3 seconds  
**Status:** Not Tested  
**Priority:** Medium

### TC-PERF-002: Bulk Operations Performance
**Description:** Verify that bulk operations perform efficiently with large data sets  
**Preconditions:** Large number of student records exist  
**Test Steps:**
1. Perform bulk fee scheduling for 100+ students
2. Measure operation completion time

**Expected Result:** Bulk operation completes in reasonable time (< 10 seconds)  
**Status:** Not Tested  
**Priority:** Medium

### TC-PERF-003: Report Generation Performance
**Description:** Verify that reports generate efficiently with large data sets  
**Preconditions:** Large amount of payment and fee data exists  
**Test Steps:**
1. Generate comprehensive financial reports spanning a long time period
2. Measure report generation time

**Expected Result:** Reports generate in reasonable time (< 15 seconds)  
**Status:** Not Tested  
**Priority:** Medium

## Security Testing

### TC-SEC-001: Password Strength Enforcement
**Description:** Verify that the system enforces password strength requirements  
**Preconditions:** User account creation/password change functionality is available  
**Test Steps:**
1. Attempt to set weak passwords (too short, no special characters, etc.)

**Expected Result:** System rejects weak passwords with appropriate error messages  
**Status:** Not Tested  
**Priority:** High

### TC-SEC-002: SQL Injection Prevention
**Description:** Verify that the system is protected against SQL injection attacks  
**Preconditions:** Search and filter functionality exists  
**Test Steps:**
1. Attempt SQL injection in search fields and form inputs

**Expected Result:** System handles input safely without errors or unauthorized data access  
**Status:** Not Tested  
**Priority:** High

### TC-SEC-003: Cross-Site Scripting (XSS) Prevention
**Description:** Verify that the system is protected against XSS attacks  
**Preconditions:** Form input fields exist  
**Test Steps:**
1. Attempt to submit JavaScript code in text fields

**Expected Result:** System sanitizes input and prevents script execution  
**Status:** Not Tested  
**Priority:** High

## Usability Testing

### TC-USA-001: Intuitive Navigation
**Description:** Verify that users can navigate the system intuitively  
**Preconditions:** System is accessible  
**Test Steps:**
1. Ask test users to perform common tasks without prior training
2. Observe their navigation paths and success rate

**Expected Result:** Users can complete basic tasks without assistance  
**Status:** Not Tested  
**Priority:** Medium

### TC-USA-002: Form Validation Feedback
**Description:** Verify that forms provide clear feedback on validation errors  
**Preconditions:** Various forms exist in the system  
**Test Steps:**
1. Submit forms with invalid data
2. Observe error messages and indicators

**Expected Result:** Clear, specific error messages displayed near the relevant fields  
**Status:** Not Tested  
**Priority:** Medium

### TC-USA-003: Mobile Responsiveness
**Description:** Verify that the interface is usable on mobile devices  
**Preconditions:** System is accessible on mobile devices  
**Test Steps:**
1. Access the system from various mobile devices
2. Attempt to perform common tasks

**Expected Result:** Interface adjusts appropriately; all functions are usable  
**Status:** Not Tested  
**Priority:** Medium

## Compatibility Testing

### TC-COMP-001: Browser Compatibility
**Description:** Verify that the system works on all major browsers  
**Preconditions:** System is deployed and accessible  
**Test Steps:**
1. Access the system using Chrome, Firefox, Safari, and Edge
2. Perform basic operations on each browser

**Expected Result:** System functions correctly on all tested browsers  
**Status:** Not Tested  
**Priority:** High

### TC-COMP-002: Device Compatibility
**Description:** Verify that the system works on different devices  
**Preconditions:** System is deployed and accessible  
**Test Steps:**
1. Access the system using desktop, tablet, and smartphone
2. Perform basic operations on each device

**Expected Result:** System functions correctly on all tested devices  
**Status:** Not Tested  
**Priority:** High
