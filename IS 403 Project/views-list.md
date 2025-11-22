# Cal-Endure to the End - List of Views (Pages)

## Project Overview
A web application for returned missionaries to manage their calendars, contacts, and events with full CRUD capabilities and user authentication.

---

## Phase 1: Authentication & Landing (COMPLETED ✓)

### 1. Landing Page (landing.html / landing.ejs)
**Status:** ✓ Completed
**Purpose:** Public-facing homepage to introduce the app and encourage sign-ups
**Features:**
- Hero section with value proposition
- Features showcase (6 feature cards)
- About section explaining the purpose
- Call-to-action sections
- Navigation to login/signup
- Footer with links

### 2. Login/Signup Page (login.html / login.ejs)
**Status:** ✓ Completed
**Purpose:** User authentication - login or create new account
**Features:**
- Login form (email, password, remember me)
- Signup form (name, email, username, password, mission field)
- Toggle between login/signup
- Form validation
- Password confirmation
- Terms of service checkbox
- Side panel with benefits

---

## Phase 2: Main Application (TO BE BUILT)

### 3. Dashboard / Calendar View (dashboard.ejs)
**Purpose:** Main view after login - displays calendar and upcoming events
**Required Features:**
- Monthly/weekly/daily calendar view
- Display all events for logged-in user
- Quick stats (# contacts, # upcoming events, # past events)
- Navigation menu/sidebar
- Add new event button (quick access)
- Today's schedule prominently displayed
- Upcoming events list
- User greeting with profile photo
**Navigation Links:**
- Contacts
- Events
- Profile
- Logout

### 4. All Events Page (events.ejs or events-list.ejs)
**Purpose:** Display all events with search and filter
**Required Features:**
- Table/list view of all events
- Columns: Date, Time, Title, Type, Contact(s), Location
- Search bar to find events by title, type, or contact
- Filter by date range, event type
- Sort by date (ascending/descending)
- Edit button for each event
- Delete button for each event
- "Add New Event" button
- Pagination (if many events)

### 5. Create Event Page (create-event.ejs or event-form.ejs)
**Purpose:** Form to add a new event
**Required Features:**
- Event title (input)
- Date picker
- Start time & end time
- Event type (dropdown: Meeting, Study, Service, Social, Church, Other)
- Location (input)
- Associated contact(s) (dropdown/multi-select from contacts)
- Notes/Description (textarea)
- Reminder checkbox
- Submit button
- Cancel button

### 6. Edit Event Page (edit-event.ejs)
**Purpose:** Form to edit an existing event
**Required Features:**
- Pre-populated form with current event data
- Same fields as Create Event
- Save changes button
- Cancel button
- Delete event button (with confirmation)
- Display event ID for reference

### 7. All Contacts Page (contacts.ejs or contacts-list.ejs)
**Purpose:** Display all contacts with search
**Required Features:**
- Grid or list view of all contacts
- Contact card showing: Photo, Name, Phone, Email
- Search bar to find contacts by name, phone, or email
- Alphabetical sorting
- Edit button for each contact
- Delete button for each contact
- "Add New Contact" button
- Click on contact to view details

### 8. Contact Details Page (contact-details.ejs)
**Purpose:** View individual contact information and event history
**Required Features:**
- Contact photo (uploaded or default)
- Full name
- Phone number (with click-to-call link)
- Email address (with mailto link)
- Physical address
- Notes about contact
- **Event History:** List of all events with this contact
- Edit contact button
- Delete contact button (with confirmation)
- Back to contacts button

### 9. Create Contact Page (create-contact.ejs or contact-form.ejs)
**Purpose:** Form to add a new contact
**Required Features:**
- First name (required)
- Last name (required)
- Phone number (optional)
- Email address (optional)
- Street address (optional)
- City (optional)
- State (optional)
- Zip code (optional)
- Photo upload (optional - show preview)
- Notes (textarea)
- Submit button
- Cancel button

### 10. Edit Contact Page (edit-contact.ejs)
**Purpose:** Form to edit an existing contact
**Required Features:**
- Pre-populated form with current contact data
- Same fields as Create Contact
- Current photo displayed with option to change
- Save changes button
- Cancel button
- Delete contact button (with confirmation)

### 11. User Profile Page (profile.ejs or account.ejs)
**Purpose:** View and edit user account information
**Required Features:**
- Display user info: Name, Username, Email, Mission
- Profile photo upload
- Edit account information form
- Change password section
- Account statistics (# contacts, # events)
- Delete account button (with confirmation warning)
- Logout button

### 12. Edit Profile Page (edit-profile.ejs)
**Purpose:** Form to update user account details
**Required Features:**
- First name
- Last name
- Email
- Username
- Mission field
- Profile photo upload
- Save changes button
- Cancel button

### 13. Change Password Page (change-password.ejs)
**Purpose:** Allow user to change their password
**Required Features:**
- Current password (input)
- New password (input)
- Confirm new password (input)
- Password strength indicator
- Submit button
- Cancel button

---

## Phase 3: Error & Utility Pages (TO BE BUILT)

### 14. 404 Error Page (404.ejs)
**Purpose:** Displayed when page not found
**Features:**
- "Page Not Found" message
- Link back to dashboard
- Suggestions for what user might be looking for

### 15. Error Page (error.ejs)
**Purpose:** General error handling
**Features:**
- Error message display
- Error code
- Back button
- Contact support link

### 16. Delete Confirmation Modal/Page (confirmation.ejs or modal)
**Purpose:** Confirm deletions to prevent accidents
**Features:**
- Warning message
- "Are you sure?" prompt
- Confirm delete button (red)
- Cancel button
- Explain consequences (e.g., "This will delete X events associated with this contact")

---

## Shared Components (Partials)

These will be included in other pages using EJS partials:

### header.ejs
- Navigation bar with logo
- User menu (profile, logout)
- Search bar (global)

### footer.ejs
- Copyright info
- Links to important pages
- Contact info

### sidebar.ejs
- Navigation menu for dashboard
- Quick links to all main sections

### message.ejs
- Flash messages for success/error
- Alerts and notifications

---

## Summary

### Phase 1 (Completed): 2 pages
- ✓ Landing Page
- ✓ Login/Signup Page

### Phase 2 (Core Application): 11 pages
- Dashboard
- All Events
- Create Event
- Edit Event
- All Contacts
- Contact Details
- Create Contact
- Edit Contact
- User Profile
- Edit Profile
- Change Password

### Phase 3 (Error Handling): 3 pages
- 404 Error
- General Error
- Confirmation Modal

### Shared Components: 4 partials
- Header
- Footer
- Sidebar
- Messages

**Total Views Needed: 16 main pages + 4 partials = 20 views**

---

## Routes Structure (for reference)

```
GET  /                          → Landing page
GET  /login                     → Login page
POST /login                     → Process login
POST /signup                    → Process signup
GET  /logout                    → Logout user

GET  /dashboard                 → Main dashboard (requires auth)
GET  /events                    → All events (requires auth)
GET  /events/new                → Create event form (requires auth)
POST /events                    → Save new event (requires auth)
GET  /events/:id/edit           → Edit event form (requires auth)
POST /events/:id/edit           → Update event (requires auth)
POST /events/:id/delete         → Delete event (requires auth)

GET  /contacts                  → All contacts (requires auth)
GET  /contacts/:id              → Contact details (requires auth)
GET  /contacts/new              → Create contact form (requires auth)
POST /contacts                  → Save new contact (requires auth)
GET  /contacts/:id/edit         → Edit contact form (requires auth)
POST /contacts/:id/edit         → Update contact (requires auth)
POST /contacts/:id/delete       → Delete contact (requires auth)

GET  /profile                   → User profile (requires auth)
GET  /profile/edit              → Edit profile form (requires auth)
POST /profile/edit              → Update profile (requires auth)
GET  /profile/change-password   → Change password form (requires auth)
POST /profile/change-password   → Update password (requires auth)
POST /profile/delete            → Delete account (requires auth)
```

---

## Notes

1. All pages except Landing and Login require authentication
2. Each page should have consistent navigation and styling
3. Forms should have validation (client-side and server-side)
4. Success/error messages should be displayed after CRUD operations
5. Delete operations should require confirmation
6. Image uploads should be handled for contact photos
7. Responsive design for mobile devices
8. Use the color scheme: #0d3b66, #faf0ca, #990000, #697268, #2ec0f9
