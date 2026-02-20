# SupNum Connect

SupNum Connect is a social-academic network for the Institut Supérieur Numérique (SupNum).
This project is a frontend-only React application using Vite and Tailwind CSS.

## Features

- **Public Landing Page**: Dashboard stats, Events list, About section.
- **Authentication**: Sign In and Sign Up (with role selection).
- **Student Interface**: Profile management, User search, Friends system, Messaging.
- **Admin Interface**: Dashboard stats, Event management, User management.

## Tech Stack

- React (Vite)
- Tailwind CSS
- React Router DOM
- Recharts (for charts)
- Lucide React (for icons)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Mock Credentials

You can use any password.

- **Student**: `2Y001@supnum.mr`
- **Graduate**: `2Y002@supnum.mr`
- **Admin**: `admin@supnum.mr`

## Project Structure

- `src/components`: Reusable UI components and Navbar.
- `src/layouts`: Layout wrappers (Public, Dashboard).
- `src/pages`: Page components (Landing, Auth, Student, Admin).
- `src/context`: Auth context for state management.
- `src/data`: Mock data for users and events.
