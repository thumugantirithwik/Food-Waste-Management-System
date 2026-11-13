# 🍱 Food Waste Management System — Frontend Application

This is the React client interface for the Food Waste Management System built with Vite.

## Features

- **Framework**: React 19
- **Build Tool**: Vite 8
- **UI Components**:
  - Landing / Home page with platform overview & metrics
  - User Authentication (Login, Register with Role Selection, Profile)
  - Food Marketplace (Discover and browse available food listings)
  - Donation Management (Submit listings, upload details, track requests)
  - Request Workflow (Submit claims, donor approval/rejection, status progression)
  - Admin & Role Dashboards (View metrics, requests, and listings)
- **Responsive Styling**: Pure responsive CSS with custom theme variables.

## Directory Structure

```
Front end/
├── public/                 # Static assets, favicon, icons
├── src/
│   ├── api/                # API client modules for backend endpoints
│   ├── components/         # Reusable buttons, cards, modals, navigation
│   │   ├── common/
│   │   ├── dashboard/
│   │   └── layout/
│   ├── context/            # Auth and notification React contexts
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Primary views
│   ├── utils/              # Constants, helpers, date formatters
│   ├── App.jsx             # Main view router and navigation
│   ├── main.jsx            # Entry point
│   ├── style.css           # Global theme styling
│   └── index.css           # Reset & base styles
├── index.html
├── package.json
└── vite.config.js
```

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`.
Ensure the backend server is running on `http://localhost:5000` to handle API requests.
