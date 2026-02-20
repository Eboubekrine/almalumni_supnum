import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { PublicEvents } from './pages/PublicEvents';
import { About } from './pages/About';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

// Student Pages
import { DashboardHome } from './pages/student/DashboardHome';
import { Profile } from './pages/student/Profile';
import { Search } from './pages/student/Search';
import { Friends } from './pages/student/Friends';
import { Messages } from './pages/student/Messages';
import { UserProfile } from './pages/UserProfile';
import { Internships } from './pages/student/Internships';
import { Companies } from './pages/student/Companies';
import { MyApplications } from './pages/student/MyApplications';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { ManageEvents } from './pages/admin/ManageEvents';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageInternships } from './pages/admin/ManageInternships';
import { ManageCompanies } from './pages/admin/ManageCompanies';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/events" element={<PublicEvents />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Auth Routes (Full Screen) */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Student/Graduate Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ALUMNI']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:id" element={<UserProfile />} />
              <Route path="search" element={<Search />} />
              <Route path="friends" element={<Friends />} />
              <Route path="messages" element={<Messages />} />
              <Route path="internships" element={<Internships />} />
              <Route path="companies" element={<Companies />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="offers" element={<ManageInternships />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="internships" element={<ManageInternships />} />
              <Route path="companies" element={<ManageCompanies />} />
              <Route path="profile/:id" element={<UserProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
