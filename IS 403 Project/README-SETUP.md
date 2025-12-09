# Cal-Endure to the End - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
cd "/root/IS 403 Project"
npm install
```

### 2. Setup Database
```bash
chmod +x setup-database.sh
./setup-database.sh
```

### 3. Start the Application
```bash
npm start
```

### 4. Access the Application
Open your browser and go to: `http://localhost:3000`

## Default Login Credentials

**Email:** john.smith@email.com
**Password:** password123

## Features

### ✅ Completed Features

1. **User Authentication**
   - Login/Signup with secure password hashing
   - Session management
   - Protected routes

2. **Goals Dashboard**
   - Create, Read, Update, Delete goals
   - 5 goal categories: Spiritual, Social, Intellectual, Physical, Romantic
   - Progress tracking
   - Statistics

3. **Calendar/Events**
   - Create, Read, Update, Delete events
   - Monthly calendar view
   - Associate contacts with events
   - Drag and drop support (UI ready)
   - Event categories matching goal categories

4. **Contacts**
   - Create, Read, Update, Delete contacts
   - Photo upload support
   - Search functionality
   - Filter by favorites
   - Associate with events

## Project Structure

```
IS 403 Project/
├── config/
│   └── database.js           # Database configuration
├── database/
│   ├── schema.sql            # Database schema
│   └── sample-data.sql       # Sample data
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── auth.js               # Login/signup routes
│   ├── dashboard.js          # Dashboard routes
│   ├── goals.js              # Goal CRUD routes
│   ├── contacts.js           # Contact CRUD routes
│   └── events.js             # Event CRUD routes
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │   └── app-navbar.ejs
│   ├── landing.ejs           # Landing page
│   ├── login.ejs             # Login/signup page
│   ├── dashboard.ejs         # Goals dashboard
│   ├── calendar.ejs          # Calendar/events
│   ├── contacts.ejs          # Contacts management
│   └── error.ejs             # Error page
├── uploads/                  # Uploaded files (photos)
├── styles.css                # Complete stylesheet
├── server.js                 # Main Express app
├── package.json              # Dependencies
└── .env                      # Environment variables
```

## Database Schema

### Tables
- **users** - User accounts with authentication
- **contacts** - Contact information
- **events** - Calendar events
- **goals** - User goals by category
- **contact_events** - Junction table for event-contact relationships

## API Routes

### Public Routes
- `GET /` - Landing page
- `GET /login` - Login/signup page
- `POST /login` - Process login
- `POST /signup` - Process signup

### Protected Routes (Require Authentication)
- `GET /dashboard` - Goals dashboard
- `GET /calendar` - Calendar view
- `GET /contacts` - Contacts list

### CRUD Routes
- **Goals**: `/goals/create`, `/goals/update/:id`, `/goals/delete/:id`
- **Events**: `/calendar/create`, `/calendar/update/:id`, `/calendar/delete/:id`
- **Contacts**: `/contacts/create`, `/contacts/update/:id`, `/contacts/delete/:id`

## Testing Checklist

- [ ] Can create new user account
- [ ] Can login with existing account
- [ ] Can view dashboard with goals
- [ ] Can create new goal
- [ ] Can edit existing goal
- [ ] Can delete goal
- [ ] Can view calendar with events
- [ ] Can create new event
- [ ] Can edit existing event
- [ ] Can delete event
- [ ] Can view contacts list
- [ ] Can create new contact
- [ ] Can upload contact photo
- [ ] Can edit existing contact
- [ ] Can delete contact
- [ ] Can associate contacts with events
- [ ] Can search contacts
- [ ] Can filter contacts by favorites
- [ ] Can logout and login again

## Troubleshooting

### Database Connection Issues
```bash
# Make sure PostgreSQL is running
service postgresql status
service postgresql start

# Check if database exists
sudo -u postgres psql -l | grep cal_endure
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

## Deployment Notes

When deploying to production:
1. Change SESSION_SECRET in .env to a random long string
2. Update database credentials in .env
3. Set NODE_ENV=production
4. Use a process manager like PM2
5. Set up SSL/HTTPS
6. Configure reverse proxy (nginx)

## Assignment Requirements ✓

- [x] Landing page with professional design
- [x] Login/Signup functionality
- [x] PostgreSQL database with multiple tables
- [x] Full CRUD operations (Create, Read, Update, Delete)
- [x] User authentication and security
- [x] HTML forms with multiple input types
- [x] Dynamic image display based on user data
- [x] Search functionality
- [x] Professional styling and responsive design
- [x] Navigation between pages
- [x] Session management
- [x] Data validation
- [x] Error handling

## Team

- Noah Blake
- Ethan Wood
- Jacob Dishman
- George Summerill

## Course

IS 403/404 - BYU

---

**Last Updated:** February 2025
