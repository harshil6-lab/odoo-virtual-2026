<img width="646" height="209" alt="image" src="https://github.com/user-attachments/assets/3a4f816c-6989-4c87-837e-1eb0c154a94e" />

# GlobeTrotter

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [User Roles](#user-roles)
- [Procurement Workflow](#procurement-workflow)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Reference](#api-reference)
- [Default Credentials](#default-credentials)

## Overview

GlobeTrotter is a modern travel-planning platform built with React and Vite. It allows users to discover destinations, design multi-stop itineraries, manage budgets, organize experiences, and share travel plans with others.

The application combines a polished front-end experience with optional Supabase integration for authenticated users and persistent trip storage. When Supabase is not configured, the app gracefully falls back to browser-local storage for demo use.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Supabase JavaScript client
- date-fns
- Lucide React
- Recharts
- Sonner notifications

## Features

- Landing page with destination inspiration and travel storytelling
- User authentication with login, sign-up, and reset flow
- Personalized dashboard with upcoming trip highlights and statistics
- Trip and itinerary editor for adding cities, dates, and experiences
- City and activity discovery through the Explore section
- Budget tracking for transport, meals, activities, and other trip costs
- Calendar-style trip view for trip timelines
- Public trip sharing for selected journeys
- Responsive UI optimized for desktop and mobile devices

## User Roles

- Traveler / Planner: creates and manages personal trips, activities, and budgets
- Guest User: browses public landing pages and demo content
- Authenticated User: signs in to save personal journey data and manage profile settings
- Shared Viewer: accesses publicly shared trip links without ownership permissions

## Procurement Workflow

Although the project is a travel app, the planning and approval flow follows a procurement-style decision model:

1. Discover destinations and activities
2. Select travel stops and experiences
3. Add planned costs and timeline details
4. Review trip budget and expected spend
5. Save itinerary and finalize plan
6. Share public trip plans or keep them private

This workflow lets users compare options, assign travel resources, and confirm the final trip plan before travel begins.

## Project Structure

```text
.
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── TripNav.jsx
│   │   └── UI.jsx
│   ├── lib/
│   │   ├── auth.jsx
│   │   ├── constants.js
│   │   ├── exploreContent.js
│   │   ├── seed.js
│   │   ├── store.js
│   │   ├── supabase.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── ActivityDetail.jsx
│   │   ├── Budget.jsx
│   │   ├── Calendar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DestinationDetail.jsx
│   │   ├── Explore.jsx
│   │   ├── Home.jsx
│   │   ├── Itinerary.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Shared.jsx
│   │   ├── TripEditor.jsx
│   │   └── Trips.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   ├── README.md
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
├── index.html
├── LICENSE
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
└── package-lock.json
```

## Setup & Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

### 5. Supabase configuration

Copy the environment template:

```bash
copy .env.example .env.local
```

Then add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The app will continue working in demo mode without these values by using browser-local storage.

## API Reference

This project primarily uses the Supabase client and local data helpers instead of a standalone backend API.

### Core data functions

- `listTrips(userId)` — fetch all trips for a user
- `getTrip(id)` — fetch a single trip record
- `saveTrip(trip, userId)` — create or update a trip and related itinerary data
- `deleteTrip(id)` — remove a trip
- `getCities()` — retrieve destination catalog data
- `getActivities()` — retrieve activities catalog data
- `getPublicTrip(id)` — fetch a public trip for share links

### Main application routes

- `/` — landing page
- `/login` — sign in
- `/signup` — create account
- `/app/dashboard` — overview dashboard
- `/app/trips` — list all trips
- `/app/trips/new` — create new trip
- `/app/trips/:tripId` — edit trip details
- `/app/trips/:tripId/itinerary` — itinerary management
- `/app/trips/:tripId/budget` — budget tracking
- `/app/explore` — destination explorer
- `/app/profile` — user profile
- `/shared/:tripId` — public trip page

## Default Credentials

For demo mode, the app supports a local fallback user without a real Supabase account:

- Email: `demo-user@globetrotter.local`
- Password: `password`

For production or Supabase-connected mode, create user accounts directly in Supabase Auth and update the environment configuration accordingly.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
