# Cal-Endure to the End (CEE)
### A PMG-Inspired Calendar for Returned Missionaries

![Color Scheme](https://via.placeholder.com/800x100/0d3b66/ffffff?text=0d3b66) ![](https://via.placeholder.com/800x100/faf0ca/000000?text=faf0ca) ![](https://via.placeholder.com/800x100/990000/ffffff?text=990000) ![](https://via.placeholder.com/800x100/697268/ffffff?text=697268) ![](https://via.placeholder.com/800x100/2ec0f9/ffffff?text=2ec0f9)

---

## Team Members
- Noah Blake
- Ethan Wood
- Jacob Dishman
- George Summerill

---

## Project Description

**Cal-Endure to the End** is a web application designed for returned missionaries who miss the structure and organization of planning every hour of their day, just like they did on their missions. While Google Calendar is fine, it doesn't capture the spirit and discipline of Preach My Gospel planning. CEE fills that gap.

The app allows users to:
- Schedule events with detailed information
- Manage contacts with photos and history
- Track interactions and maintain relationships
- Stay organized and disciplined in their post-mission life

---

## Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Dark Blue | `#0d3b66` | Primary color, headers, navigation |
| Cream | `#faf0ca` | Background, light sections |
| Dark Red | `#990000` | Accent color, CTAs, important actions |
| Gray | `#697268` | Secondary text, borders |
| Light Blue | `#2ec0f9` | Highlights, links, interactive elements |

---

## Current Progress

### ✅ Completed (Project Phase 1 & 2)

1. **Landing Page** (`landing.html`)
   - Hero section with app introduction
   - Features showcase (6 key features)
   - About section
   - Call-to-action sections
   - Mobile-responsive design
   - Professional styling with brand colors

2. **Login/Signup Page** (`login.html`)
   - Login form with email/password
   - Signup form with full user details
   - Toggle between login and signup
   - Form validation (client-side)
   - Password confirmation
   - Mission field (optional)
   - Terms of service checkbox
   - Side panel with benefits
   - Responsive design

3. **Stylesheet** (`styles.css`)
   - Complete styling for all components
   - Responsive breakpoints
   - Button styles
   - Form styles
   - Color scheme implementation
   - Mobile-first approach

4. **Views Documentation** (`views-list.md`)
   - Complete list of all needed pages
   - Features for each view
   - Route structure
   - Phase breakdown

---

## Project Structure

```
IS 403 Project/
│
├── landing.html              # Public landing page
├── login.html                # Login and signup page
├── styles.css                # Complete stylesheet
├── views-list.md             # List of all views needed
├── README.md                 # This file
└── Cal-Endure to the End (CEE).pdf  # Original proposal
```

---

## Features Implementation

### Required Features (Per Assignment)

#### ✅ 1. Landing Page
- Professional design with branding
- Clear value proposition
- Navigation to login/signup
- Responsive layout

#### ✅ 2. Login/Signup Functionality
- User authentication forms
- Account creation with validation
- Password confirmation
- Optional fields (mission)
- Remember me functionality

#### 🔜 3. PostgreSQL Database
**Tables Needed:**
- `users` - User accounts and authentication
- `contacts` - People in the user's network
- `events` - Calendar events and appointments
- `contact_events` - Junction table linking contacts to events

#### 🔜 4. CRUD Operations
**Contacts:**
- Create: Add new contacts with name, phone, email, address, photo
- Read: View all contacts, view individual contact details
- Update: Edit contact information
- Delete: Remove contacts (with confirmation)

**Events:**
- Create: Add new calendar events with time, location, type, notes
- Read: View calendar, view all events, search/filter events
- Update: Edit event details
- Delete: Remove events (with confirmation)

#### 🔜 5. HTML Forms & Components
- Input fields (text, email, password, date, time)
- Dropdowns (event type, contact selection)
- Textareas (notes, descriptions)
- Checkboxes (reminders, terms)
- File upload (contact photos)
- Buttons (submit, cancel, delete)

#### 🔜 6. Dynamic Images
- Contact photos (uploaded or default stock image)
- Display photos dynamically based on contact ID
- Image preview on upload
- Default avatar for contacts without photos

#### 🔜 7. User Authentication & Security
- Secure login system
- Password hashing
- Session management
- User can only access/edit their own data
- Account management (update profile, delete account)

---

## Next Steps (Project Phase 3 & 4)

### Phase 3: Backend Setup
1. Set up Node.js with Express
2. Install dependencies (express, pg, ejs, bcrypt, express-session, multer)
3. Create database schema with all tables
4. Set up EJS as templating engine
5. Configure session management
6. Set up PostgreSQL connection

### Phase 4: Core Application Pages
1. **Dashboard** - Main view after login with calendar
2. **Events Management**
   - View all events
   - Create new event
   - Edit event
   - Delete event
   - Search/filter events
3. **Contacts Management**
   - View all contacts
   - Create new contact
   - Edit contact
   - Delete contact
   - View contact details with event history
4. **User Profile**
   - View profile
   - Edit profile
   - Change password
   - Delete account

### Phase 5: Advanced Features
1. Image upload for contacts
2. Event-contact associations
3. Search and filter functionality
4. Event history per contact
5. Calendar view (monthly/weekly)

### Phase 6: Testing & Deployment
1. Test all CRUD operations
2. Test authentication flow
3. Test responsive design
4. Deploy to hosting platform

---

## Database Schema (ERD)

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mission VARCHAR(100),
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
    contact_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    street_address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    photo VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    event_type VARCHAR(50),
    location VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contact_Events Junction Table
```sql
CREATE TABLE contact_events (
    contact_event_id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(contact_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE(contact_id, event_id)
);
```

---

## Technology Stack

### Frontend
- HTML5
- CSS3 (Custom styling, no framework)
- JavaScript (Vanilla JS for form validation)
- EJS (Templating)

### Backend
- Node.js
- Express.js
- PostgreSQL
- bcrypt (Password hashing)
- express-session (Session management)
- multer (File uploads)

### Development Tools
- Git (Version control)
- VS Code / Claude Code
- PostgreSQL (Database)

---

## How to View Current Pages

1. Open `landing.html` in your web browser to see the landing page
2. Open `login.html` in your web browser to see the login/signup page
3. Both pages are fully styled and responsive

**Note:** These are currently static HTML pages. They will be converted to EJS templates when the backend is implemented.

---

## Installation (For Future Development)

```bash
# Clone the repository
git clone <repository-url>
cd "IS 403 Project"

# Install dependencies
npm install

# Set up PostgreSQL database
createdb cal_endure

# Run database schema
psql cal_endure < schema.sql

# Start the server
npm start

# Visit http://localhost:3001
```

---

## Contributing

This is a group project for IS 403/404 course. All team members contribute to:
- Design and planning
- Frontend development
- Backend development
- Database design
- Testing and deployment

---

## Project Requirements Checklist

- [x] Landing page created
- [x] Login page created with forms
- [x] Sign up functionality designed
- [x] Color scheme implemented
- [x] Responsive design
- [x] Professional styling
- [ ] PostgreSQL database setup
- [ ] User authentication implemented
- [ ] Contact CRUD operations
- [ ] Event CRUD operations
- [ ] Image upload for contacts
- [ ] Dynamic image display
- [ ] Contact-event associations
- [ ] Search functionality
- [ ] Event history per contact
- [ ] User profile management
- [ ] Account deletion
- [ ] Full CRUD testing
- [ ] Deployment

---

## License

This project is created for educational purposes as part of IS 403/404 coursework.

---

## Contact

For questions or collaboration:
- Noah Blake
- Ethan Wood
- Jacob Dishman
- George Summerill

---

**Last Updated:** October 31, 2025
