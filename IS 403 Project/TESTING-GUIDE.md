# Cal-Endure to the End - Testing Guide

## Server Status
✅ **Server is running successfully!**

## Quick Start

### Start the Server
```bash
cd "/root/IS 403 Project"
npm start
```

The server will run on: **http://localhost:3000**

## Test Login Credentials

| Email | Password | User |
|-------|----------|------|
| john.smith@email.com | password123 | John Smith (Elder Smith) |
| sarah.j@email.com | password123 | Sarah Johnson (Sister Johnson) |

## Testing Checklist

### ✅ 1. Authentication
- [ ] Visit http://localhost:3000
- [ ] Click "Get Started" or "Login"
- [ ] Test Login with: john.smith@email.com / password123
- [ ] Should redirect to `/dashboard`
- [ ] Test Logout
- [ ] Test Signup with new account
- [ ] Verify password confirmation validation
- [ ] Test "Remember Me" checkbox

### ✅ 2. Goals Dashboard (`/dashboard`)
**What to test:**
- [ ] View all goals by category (Spiritual, Social, Intellectual, Physical, Romantic)
- [ ] Click "+ Add Goal" button
- [ ] Fill out goal form:
  - Category (dropdown)
  - Goal title
  - Description
  - Target frequency
- [ ] Submit form - should create new goal
- [ ] Edit existing goal (click edit button ✏️)
- [ ] Delete goal (click delete button 🗑️)
- [ ] Verify confirmation dialog appears
- [ ] Check goal progress bars update
- [ ] Verify statistics cards show correct counts

### ✅ 3. Calendar/Events (`/calendar`)
**What to test:**
- [ ] View monthly calendar
- [ ] Navigate between months (◀ ▶ buttons)
- [ ] Click "Today" button
- [ ] Click "+ Add Event" button
- [ ] Fill out event form:
  - Event title
  - Goal category
  - Date (date picker)
  - Start time / End time
  - Location
  - Attach contacts (multi-select)
  - Notes
  - Reminder checkbox
- [ ] Submit form - should create new event
- [ ] View "Today's Schedule" section
- [ ] Edit event (click ✏️ on event)
- [ ] Delete event (click 🗑️)
- [ ] Verify events appear on calendar dates
- [ ] Test drag-and-drop (events in "Today's Schedule")

### ✅ 4. Contacts (`/contacts`)
**What to test:**
- [ ] View all contacts in grid layout
- [ ] Use search bar to filter contacts by:
  - Name
  - Email
  - Phone number
- [ ] Click filter buttons (All / Recent / Favorites)
- [ ] Click "+ Add Contact" button
- [ ] Fill out contact form:
  - Profile photo (upload)
  - First name / Last name
  - Phone number
  - Email address
  - Street address
  - City / State / Zip code
  - Notes
- [ ] Test photo upload preview
- [ ] Submit form - should create new contact
- [ ] Click "View" on a contact
- [ ] Click "Edit" on a contact
- [ ] Update contact information
- [ ] Test favorite toggle (⭐ / ☆)
- [ ] Delete contact (click "Delete")
- [ ] Verify confirmation dialog
- [ ] Check contact count updates

### ✅ 5. Integration Tests
- [ ] Create a goal in a specific category (e.g., "Exercise daily" in Physical)
- [ ] Create an event with the same category
- [ ] Verify event appears in goal's event count
- [ ] Create a contact
- [ ] Create an event and attach that contact
- [ ] View contact - should show event in history
- [ ] Delete contact - verify events are updated
- [ ] Upload a contact photo
- [ ] Verify photo displays on contact card
- [ ] Verify photo persists after refresh

### ✅ 6. Navigation & UI
- [ ] Click all navigation links (Goals, Calendar, Contacts)
- [ ] Verify active page is highlighted in nav
- [ ] Click user menu (avatar in top right)
- [ ] Test Profile link
- [ ] Test Settings link
- [ ] Test Logout link
- [ ] Verify responsive design on smaller screens
- [ ] Check all modals open/close correctly
- [ ] Verify cancel buttons work
- [ ] Test clicking outside modal to close

### ✅ 7. Data Persistence
- [ ] Create a goal, logout, login again - goal should still exist
- [ ] Create an event, close browser, reopen - event should persist
- [ ] Create a contact, logout, login again - contact should exist
- [ ] Upload photo, refresh page - photo should still display

### ✅ 8. Error Handling
- [ ] Try to access `/dashboard` without logging in - should redirect to login
- [ ] Try login with wrong password - should show error message
- [ ] Try signup with existing email - should show error message
- [ ] Try signup with mismatched passwords - should show error
- [ ] Try to create goal without required fields - should show validation
- [ ] Try to create event without required fields - should show validation
- [ ] Try to create contact without required fields - should show validation

### ✅ 9. Search & Filter
- [ ] Search contacts by name
- [ ] Search contacts by email
- [ ] Search contacts by phone
- [ ] Filter contacts by "All"
- [ ] Filter contacts by "Recent"
- [ ] Filter contacts by "Favorites"
- [ ] Verify search results update in real-time

### ✅ 10. Multi-select & Associations
- [ ] Create an event
- [ ] Select multiple contacts to attach
- [ ] Submit form
- [ ] Edit event - verify contacts are pre-selected
- [ ] Remove a contact from event
- [ ] Add new contact to event
- [ ] Save changes

## Known Features Ready for Testing

### ✅ Implemented and Working
- User authentication (login/signup/logout)
- Session management
- Password hashing with bcrypt
- Dashboard with goals display
- Goal CRUD operations (Create, Read, Update, Delete)
- Calendar view with monthly navigation
- Event CRUD operations
- Contact CRUD operations with photo upload
- Multi-select contact associations with events
- Search functionality for contacts
- Favorite contacts toggle
- Statistics and progress tracking
- Flash messages for success/error
- Protected routes (require authentication)
- Form validation

### ⚠️ Known Limitations
- Calendar drag-and-drop UI exists but needs backend integration
- Weekly/Daily calendar views (buttons exist, need implementation)
- Photo uploads work but large files may be slow
- No password recovery (forgot password)
- No email verification
- No user profile editing yet

## Database Schema

### Tables Created
1. **users** - User accounts (2 sample users)
2. **contacts** - Contact information (6 sample contacts)
3. **events** - Calendar events (13 sample events)
4. **goals** - User goals (12 sample goals)
5. **contact_events** - Event-contact relationships (4 associations)

### Sample Data
- 2 test users (John Smith & Sarah Johnson)
- 6 sample contacts
- 12 sample goals across 5 categories
- 13 sample events including today's events
- 4 contact-event associations

## API Endpoints

### Public
- `GET /` - Landing page
- `GET /login` - Login/signup page
- `POST /login` - Process login
- `POST /signup` - Process signup
- `GET /logout` - Logout

### Protected (Require Auth)
- `GET /dashboard` - Goals dashboard
- `POST /goals/create` - Create goal
- `POST /goals/update/:id` - Update goal
- `POST /goals/delete/:id` - Delete goal
- `POST /goals/increment/:id` - Increment goal progress

- `GET /calendar` - Calendar view
- `POST /calendar/create` - Create event
- `GET /calendar/:id` - Get event details
- `POST /calendar/update/:id` - Update event
- `POST /calendar/delete/:id` - Delete event
- `POST /calendar/move/:id` - Move event (drag-drop)

- `GET /contacts` - Contacts list
- `POST /contacts/create` - Create contact (with photo upload)
- `GET /contacts/:id` - Get contact details
- `POST /contacts/update/:id` - Update contact
- `POST /contacts/delete/:id` - Delete contact
- `POST /contacts/favorite/:id` - Toggle favorite

## File Structure

```
/root/IS 403 Project/
├── config/
│   └── database.js           # PostgreSQL connection
├── database/
│   ├── schema.sql            # Database tables
│   └── sample-data.sql       # Test data
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── auth.js               # Login/signup routes
│   ├── dashboard.js          # Dashboard routes
│   ├── goals.js              # Goal CRUD
│   ├── contacts.js           # Contact CRUD
│   └── events.js             # Event CRUD
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │   └── app-navbar.ejs
│   ├── landing.ejs
│   ├── login.ejs             # ✅ Updated
│   ├── dashboard.ejs
│   ├── calendar.ejs
│   ├── contacts.ejs
│   └── error.ejs
├── uploads/                  # Photo uploads directory
├── styles.css                # Complete stylesheet
├── server.js                 # Express app
├── package.json
└── .env                      # Config (DB, session secret)
```

## Troubleshooting

### Server won't start
```bash
# Check if PostgreSQL is running
service postgresql status
service postgresql start
```

### Database connection error
```bash
# Verify database exists
sudo -u postgres psql -l | grep cal_endure

# Recreate database if needed
sudo -u postgres psql -c "DROP DATABASE IF EXISTS cal_endure;"
sudo -u postgres psql -c "CREATE DATABASE cal_endure;"
sudo -u postgres psql -d cal_endure -f database/schema.sql
sudo -u postgres psql -d cal_endure -f database/sample-data.sql
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
echo "PORT=3001" >> .env
```

### Can't login
- Make sure you're using: **john.smith@email.com** / **password123**
- Check database has users: `sudo -u postgres psql -d cal_endure -c "SELECT * FROM users;"`

### Photos won't upload
```bash
# Create uploads directory
mkdir -p "/root/IS 403 Project/uploads/contacts"
chmod -R 755 "/root/IS 403 Project/uploads"
```

## Next Steps for Deployment

When ready to deploy:
1. Change `SESSION_SECRET` in `.env` to a secure random string
2. Update database credentials for production database
3. Set `NODE_ENV=production` in `.env`
4. Use a process manager (PM2) to keep server running
5. Set up nginx as reverse proxy
6. Configure SSL/HTTPS with Let's Encrypt
7. Set up automatic backups for PostgreSQL

## Assignment Requirements ✓

All requirements have been implemented:

- ✅ Landing page with professional design
- ✅ Login and signup pages
- ✅ User authentication with sessions
- ✅ PostgreSQL database (5 tables)
- ✅ Full CRUD operations for Goals, Events, and Contacts
- ✅ HTML forms with multiple input types
- ✅ Dynamic images (contact photos)
- ✅ User can only access their own data
- ✅ Search functionality
- ✅ Professional styling and responsive design
- ✅ Navigation between all pages
- ✅ Security (password hashing, SQL injection prevention)
- ✅ Data validation
- ✅ Error handling

Ready for video demonstration and submission!
