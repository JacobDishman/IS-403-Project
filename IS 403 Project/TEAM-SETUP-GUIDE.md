# Cal-Endure to the End - Team Setup Guide

## 📦 Package Contents

This archive contains the complete Cal-Endure to the End web application with all fixes applied and tested.

---

## 🚀 Quick Start (5 minutes)

### 1. Extract the Archive
```bash
tar -xzf Cal-Endure-Project.tar.gz
cd IS\ 403\ Project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up PostgreSQL Database
```bash
# Start PostgreSQL (if not running)
sudo service postgresql start

# Create database as postgres user
sudo -u postgres psql -c "CREATE DATABASE cal_endure;"

# Run schema
sudo -u postgres psql -d cal_endure -f database/schema.sql

# Load sample data
sudo -u postgres psql -d cal_endure -f database/sample-data.sql
```

### 4. Start the Server
```bash
npm start
```

### 5. Access the Application
- **URL:** http://localhost:3000
- **Login:** john.smith@email.com
- **Password:** password123

---

## 📁 Project Structure

```
IS 403 Project/
├── server.js                 # Main Express application
├── package.json              # Dependencies
├── config/
│   └── database.js           # PostgreSQL connection
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── auth.js               # Login/signup routes
│   ├── dashboard.js          # Dashboard & statistics
│   ├── goals.js              # CRUD for goals
│   ├── events.js             # CRUD for events
│   └── contacts.js           # CRUD for contacts
├── views/
│   ├── landing.ejs           # Landing page
│   ├── login.ejs             # Login page
│   ├── dashboard.ejs         # Main dashboard (5 goal categories)
│   ├── calendar.ejs          # Calendar/events page
│   ├── contacts.ejs          # Contacts page
│   └── partials/             # Reusable EJS components
├── database/
│   ├── schema.sql            # Database structure
│   └── sample-data.sql       # Test data
└── styles.css                # Application styles
```

---

## 🗄️ Database Schema

**5 Tables:**
1. **users** - User accounts with bcrypt passwords
2. **contacts** - User's contacts with photos
3. **events** - Calendar events with date/time
4. **goals** - Goals in 5 categories (Spiritual, Social, Intellectual, Physical, Romantic)
5. **contact_events** - Many-to-many relationship for event attendees

---

## ✅ What's Working

### Goals Dashboard
- ✅ Add goals in 5 categories
- ✅ Check/uncheck to mark complete
- ✅ Delete goals with confirmation
- ✅ Dynamic progress bars per category
- ✅ Real-time statistics
- ✅ Database persistence

### Calendar (Events)
- ✅ Add events with date/time
- ✅ Attach contacts to events
- ✅ Month navigation (Previous/Next/Today)
- ✅ Event types match goal categories
- ✅ Location and notes support

### Contacts
- ✅ Add/delete contacts
- ✅ Upload contact photos
- ✅ Toggle favorites (star icon)
- ✅ Search functionality
- ✅ Real-time statistics

---

## 🔧 All Fixes Applied

1. ✅ Goal deletion (was 404) - Now uses POST forms
2. ✅ Goals not showing - Fixed category capitalization
3. ✅ Missing statistics - Fixed SQL queries
4. ✅ Checkboxes not working - Added AJAX toggle
5. ✅ Progress bars static - Now calculate dynamically
6. ✅ Week/Day buttons - Removed (month view only)
7. ✅ Contacts dropdown - Loads from database
8. ✅ Reminder option - Removed as requested
9. ✅ Events not adding - Fixed form fields
10. ✅ Hardcoded contacts - Now database-driven

---

## 🧪 Testing Checklist

### Test Goals (2 min)
1. Go to Dashboard: http://localhost:3000/dashboard
2. Click "+ Add Goal" for any category
3. Fill: Title + Target Count
4. Submit - goal appears immediately ✅
5. Check checkbox - marks complete ✅
6. Progress bar increases ✅
7. Click 🗑️ - deletes with confirmation ✅

### Test Events (2 min)
1. Go to Calendar
2. Click "+ Add Event"
3. Fill form (all fields)
4. Select contacts from dropdown ✅
5. Submit - event created ✅
6. Previous/Next/Today buttons work ✅

### Test Contacts (2 min)
1. Go to Contacts
2. Verify 6 sample contacts show ✅
3. Click "+ Add Contact"
4. Fill form + upload photo
5. Submit - appears in grid ✅
6. Click ⭐ - toggles favorite ✅
7. Delete test contact ✅

---

## 💾 Sample Data Included

- **2 Users:** John Smith, Sarah Johnson
- **6 Contacts:** Pre-loaded with photos
- **13 Events:** Distributed across calendar
- **12 Goals:** 2-3 per category
- **4 Contact-Event Links:** Sample attendees

---

## 🔐 Security Features

- bcrypt password hashing
- Express sessions for authentication
- Protected routes with auth middleware
- SQL injection prevention (parameterized queries)
- Input validation on forms

---

## 🎓 Assignment Requirements Met

✅ Landing page with navbar/footer
✅ Login/signup pages
✅ PostgreSQL database (5 tables)
✅ Full CRUD operations (Goals, Events, Contacts)
✅ User authentication & sessions
✅ Multiple HTML form types (text, select, date, time, file upload, checkbox)
✅ Dynamic images (contact photos via multer)
✅ Search functionality (contacts page)
✅ Professional design (LDS-themed, clean UI)
✅ At least 3 views (Dashboard, Calendar, Contacts)

---

## 🛠️ Troubleshooting

### Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
npm start
```

### Database Connection Error
Check PostgreSQL is running:
```bash
sudo service postgresql status
sudo service postgresql start
```

### Login Fails
Password for john.smith@email.com is: `password123`
Password is case-sensitive.

### Goals Not Showing
Clear browser cache and refresh page.

---

## 📚 Documentation Files

- **START-HERE.md** - Quick overview
- **ALL-FIXED-README.md** - All fixes summary
- **SYSTEMATIC-FIXES-COMPLETE.md** - Detailed fix log
- **TESTING-GUIDE.md** - Comprehensive testing
- **FIXES-APPLIED.md** - Technical changes
- **TEAM-SETUP-GUIDE.md** - This file!

---

## 🎥 Video Demo Script

1. **Landing Page** (15 sec)
   - Show navbar, footer, professional design

2. **Login** (10 sec)
   - Login as john.smith@email.com

3. **Dashboard** (90 sec)
   - Show 5 goal categories
   - Add a goal (Spiritual: "Pray Daily")
   - Check checkbox to complete it
   - Show statistics update
   - Show progress bar increase
   - Delete a goal with confirmation

4. **Calendar** (60 sec)
   - Click "+ Add Event"
   - Fill form: "Morning Study" / Spiritual / Today
   - Attach contacts from dropdown
   - Show month navigation works
   - Confirm no reminder checkbox

5. **Contacts** (45 sec)
   - Show 6 contacts from database
   - Add new contact with photo
   - Toggle favorite star
   - Delete test contact
   - Show search works

6. **Logout** (10 sec)

**Total: ~4 minutes**

---

## 👥 Team Member Checklist

Before working on the code:
- [ ] Extract archive
- [ ] Run `npm install`
- [ ] Set up PostgreSQL database
- [ ] Start server with `npm start`
- [ ] Login and test all features
- [ ] Review code structure
- [ ] Read documentation files
- [ ] Verify all 10 fixes are working

---

## 🚢 Ready for Deployment

The application is production-ready with:
- All features working
- Database fully integrated
- Authentication secure
- Code documented
- Tests verified
- No hardcoded data
- Clean, professional UI

---

## 📧 Questions?

Review these files in order:
1. START-HERE.md (overview)
2. TEAM-SETUP-GUIDE.md (this file)
3. TESTING-GUIDE.md (detailed testing)
4. FIXES-APPLIED.md (what was fixed)

---

**Version:** February 2025
**Status:** ✅ All Features Working
**Ready for:** Demo Video & Submission

🎉 **Good luck with your presentation!**
