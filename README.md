# 🍽️ QuickBite - Personal Recipe Assistant

A modern, responsive recipe discovery application built with React and Node.js. QuickBite helps busy professionals find recipes based on available ingredients, cooking time, and personal preferences.

## ✨ Features

### 🔍 Smart Recipe Search
- **By Ingredient**: Find recipes using ingredients you have at home
- **By Recipe Name**: Search for specific dishes by name
- **By Meal ID**: Direct recipe lookup using TheMealDB ID
- **Time Filters**: Filter recipes by cooking time (15min, 30min, 60min+)

### 📱 Responsive Design
- **Mobile-First**: Optimized for smartphones and tablets
- **Touch-Friendly**: Proper touch target sizes (44px minimum)
- **Responsive Grid**: Adapts from 1 column (mobile) to 4 columns (desktop)
- **Mobile Navigation**: Collapsible hamburger menu for mobile devices

### ❤️ Favorites System
- **Local Storage**: Save favorite recipes locally
- **Dedicated View**: Separate favorites page with back navigation
- **Easy Management**: Add/remove favorites with heart icon
- **Persistent Data**: Favorites survive browser restarts

### 🎯 User Experience
- **Authentication**: Simple email/password login system
- **Auto-Login**: Persistent login using localStorage
- **Loading States**: Smooth loading animations
- **Error Handling**: Comprehensive error messages
- **Visual Feedback**: Hover effects and transitions

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Internet connection** (for TheMealDB API)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Quickbite
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Start the backend server:**
```bash
cd ../backend
npm start
```
Server will run on `http://localhost:4000`

5. **Start the frontend development server:**
```bash
cd ../frontend
npm start
```
Application will open at `http://localhost:3000`

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)  
- **Desktop**: > 1024px (xl)

### Mobile Features
- **Responsive Header**: Collapsible navigation menu
- **Touch Targets**: Minimum 44px tap targets for buttons
- **Mobile Modals**: Full-screen on mobile, centered on desktop
- **Grid Layout**: 1 column on mobile, up to 4 on desktop
- **Optimized Forms**: Proper input sizing and spacing

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Local Storage**: Client-side data persistence

### Backend  
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Axios**: HTTP client for external API calls
- **CORS**: Cross-origin resource sharing

### External APIs
- **TheMealDB**: Recipe data provider
  - Random recipes: `/random.php`
  - Search by ingredient: `/filter.php?i=`
  - Search by name: `/search.php?s=`
  - Recipe details: `/lookup.php?i=`

## 📂 Project Structure

```
Quickbite/
├── backend/
│   ├── index.js              # Main server file
│   ├── package.json          # Backend dependencies
│   └── node_modules/         # Backend packages
├── frontend/
│   ├── public/
│   │   ├── index.html        # Main HTML template
│   │   └── favicon.ico       # App icon
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.js     # Navigation header
│   │   │   ├── Login.js      # Authentication
│   │   │   ├── SearchForm.js # Recipe search
│   │   │   ├── RecipeGrid.js # Recipe cards grid
│   │   │   ├── RecipeModal.js# Recipe details popup
│   │   │   ├── Favorites.js  # Favorites page
│   │   │   └── Footer.js     # Page footer
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global styles
│   │   └── App.css           # App-specific styles
│   ├── package.json          # Frontend dependencies
│   └── node_modules/         # Frontend packages
└── README.md                 # This file
```

## 🎮 Usage Guide

### 1. **Login**
- Enter any email address
- Password must be 6+ characters
- Click "Sign In" to access the app

### 2. **Search Recipes**
- **Ingredient Search**: Enter ingredients like "chicken", "pasta"
- **Recipe Name**: Search specific dishes like "Arrabiata"
- **Meal ID**: Enter TheMealDB ID like "52772"
- **Time Filter**: Select cooking time preference

### 3. **Manage Favorites**
- Click ❤️ on any recipe to add to favorites
- Click "Favorites" in header to view saved recipes
- Click ❌ to remove from favorites
- Use back button to return to main view

### 4. **View Recipe Details**
- Click "View Recipe 👆" or recipe card
- View ingredients, instructions, and cooking info
- Click "Close Recipe" to return

## 🌐 API Endpoints

### Backend Routes
- `GET /api/recipes/random` - Get random recipe
- `GET /api/recipes/search/:name` - Search by recipe name
- `GET /api/recipes/ingredient/:ingredient` - Search by ingredient
- `GET /api/recipes/lookup/:id` - Get recipe by ID
- `GET /api/recipes/details/:id` - Get detailed recipe info

### External API Integration
All data is fetched from TheMealDB (www.themealdb.com):
- Free tier: 100 requests per day
- No API key required for basic usage
- JSON response format

## 🔧 Configuration

### Environment Variables
Create `.env` files if needed:

**Backend (.env):**
```env
PORT=4000
MEAL_DB_BASE_URL=https://www.themealdb.com/api/json/v1/1
```

**Frontend (.env):**
```env
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

## 📱 Mobile Testing

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Test touch interactions and responsiveness

### Physical Device Testing
1. Connect to same network as development server
2. Use your computer's IP address: `http://192.168.x.x:3000`
3. Test on actual mobile devices

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy build/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Push to deployment platform
# Set PORT environment variable
```

### Environment Setup
- Set production API URLs
- Configure CORS for production domains
- Update localStorage keys if needed

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Check if port 4000 is available
   - Run `npm install` in backend folder
   - Check for syntax errors in index.js

2. **Frontend not connecting:**
   - Verify backend is running on port 4000
   - Check API_BASE_URL in App.js
   - Look for CORS errors in browser console

3. **Recipes not loading:**
   - Check internet connection
   - Verify TheMealDB API is accessible
   - Check browser network tab for failed requests

4. **Mobile issues:**
   - Clear browser cache
   - Check viewport meta tag in index.html
   - Test in different mobile browsers

### Debug Mode
Add to localStorage to enable debug info:
```javascript
localStorage.setItem('quickbite_debug', 'true');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TheMealDB**: Providing free recipe data
- **Tailwind CSS**: For beautiful, responsive styling
- **React Community**: For excellent documentation and support
- **Emoji**: Making the interface fun and engaging! 🎉

---

**Made with ❤️ for food lovers and busy professionals**

*Last updated: [Current Date]*