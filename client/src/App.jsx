import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { AllTasks } from './pages/AllTasks';
import { TaskForm } from './pages/TaskForm';
import { Subjects } from './pages/Subjects';
import { CalendarView } from './pages/CalendarView';
import { UpcomingDeadlines } from './pages/UpcomingDeadlines';
import { CompletedTasks } from './pages/CompletedTasks';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AboutHelp } from './pages/AboutHelp';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/AppLayout';

// Component to redirect authenticated users away from /login and /signup
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Authentication Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Authenticated Application with Sidebar Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/edit/:id" element={<TaskForm />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/deadlines" element={<UpcomingDeadlines />} />
            <Route path="/completed" element={<CompletedTasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<AboutHelp />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
