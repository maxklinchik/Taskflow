# TaskFlow

A modern, feature-rich homework and task management application designed for students. Track assignments, manage tasks, and organize events with an intuitive, glassmorphism-styled interface.

## Features

### 📚 Assignment Management
- **7 Pre-configured Classes**: Physics, Computer Science, Math, English, Chemistry, Gym/Health, History
- **Assignment Types**: Homework, Tests, and Projects with color-coded badges
- **Flexible Due Dates**: Add optional due times for precise scheduling
- **Smart Date Display**: Shows "Today" or "Tomorrow" for relevant assignments
- **Auto-Categorization**: Assignments organized into "Due by tomorrow", "This Week", and "Other"
- **Time-based Sorting**: Assignments on the same day are sorted by time

### 🎯 Test Management
- Tests automatically disappear at 3:00 PM on the test date
- No completion checkbox for tests (unlike homework/projects)
- Tests labeled with "On:" instead of "Due:"

### ✅ Task Tracking
- Create standalone tasks with dates and notes
- Mark tasks as complete with checkboxes
- Quick access from the sidebar

### 📅 Event Management
- Add events with optional times
- Times displayed in 12-hour format (AM/PM)
- Shows up to 4 events with "Show More" option
- Delete events on hover
- "All Day" events for flexible scheduling

### 👁️ Multiple View Options
- **Class View**: Cards organized by subject
- **List View**: Chronological list with section headers

### 🎨 Theme Options
- **Dark Theme**: Modern dark gray background with purple gradient accents
- **Light Theme**: Clean white interface with enhanced contrast
- Theme preference saved automatically

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Hosting**: GitHub Pages
- **Authentication**: Email/Password via Supabase Auth

## Getting Started

### Prerequisites

- A Supabase account ([supabase.com](https://supabase.com))
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CalendarProject.git
   cd CalendarProject
   ```

2. **Set up Supabase**
   
   a. Create a new project in Supabase
   
   b. Run the database schema:
   - Go to the SQL Editor in your Supabase dashboard
   - Execute the contents of `supabase-schema.sql`
   - If upgrading from an older version, also run `migration.sql`
   
   c. Get your Supabase credentials:
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

3. **Configure Supabase credentials**
   
   Edit `docs/assets/js/supabase-config.js`:
   ```javascript
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

4. **Deploy**
   
   Option A - GitHub Pages:
   - Push to GitHub
   - Enable GitHub Pages from the `docs/` folder in repository settings
   
   Option B - Local Development:
   - Open `docs/index.html` in a web browser
   - Or use a local server: `python -m http.server 8000`

## Database Schema

### Tables

**homework**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `class` (TEXT) - Subject name
- `title` (TEXT) - Assignment title
- `due_date` (DATE) - Due date
- `due_time` (TEXT, Optional) - Due time in 12-hour format
- `type` (TEXT) - 'homework', 'test', or 'project'
- `notes` (TEXT, Optional)
- `completed` (BOOLEAN)

**tasks**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (TEXT)
- `date` (DATE)
- `notes` (TEXT, Optional)
- `completed` (BOOLEAN)

**events**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (TEXT)
- `date` (DATE)
- `time` (TEXT, Optional) - Time in 12-hour format with AM/PM

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Project Structure

```
CalendarProject/
├── docs/                          # GitHub Pages deployment directory
│   ├── index.html                # Login/signup page
│   ├── pages/
│   │   ├── dashboard.html        # Main application
│   │   └── settings.html         # Theme settings
│   └── assets/
│       ├── css/
│       │   ├── style.css         # Auth page styles
│       │   ├── dashboard.css     # Main app styles (dark theme)
│       │   ├── theme-light.css   # Light theme overrides
│       │   └── settings.css      # Settings page styles
│       └── js/
│           ├── auth.js           # Authentication logic
│           ├── dashboard-supabase.js  # Main app logic
│           ├── settings.js       # Theme switcher
│           └── supabase-config.js     # Supabase client configuration
├── supabase-schema.sql           # Database schema
├── migration.sql                 # Schema updates
└── README.md
```

## Key Features Explained

### Date Handling
- Manual date parsing to avoid timezone issues: `new Date(year, month-1, day)`
- Relative dates: "Today, Feb 11" and "Tomorrow, Feb 12"
- Weekday display for other dates: "Wednesday, Feb 13"

### Test Auto-removal
Tests are automatically filtered from the view at 3:00 PM on their scheduled date, keeping your assignment list clean.

### Smart Sorting
Assignments are sorted first by date, then by time. Items without a specified time appear last.

### Theme Persistence
Theme preference is stored in localStorage and persists across sessions.

## Color Scheme

### Dark Theme
- Background: `#18181b` (dark gray)
- Accent: Purple gradient (`#a855f7`, `#8b5cf6`, `#ec4899`)
- Text: `#f1f5f9` (off-white)

### Type Color Coding
- **Homework**: Blue (`#3b82f6`)
- **Test**: Red (`#ef4444`)
- **Project**: Purple (`#8b5cf6`)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Supabase](https://supabase.com) for backend infrastructure
- Inspired by modern student productivity needs
- Font: Inter, Segoe UI, system-ui

## Support

For issues or questions, please open an issue on GitHub or contact the maintainer.

---

Made with 💜 by students, for students
