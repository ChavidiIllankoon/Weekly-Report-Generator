import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Member Pages
import MemberDashboard from '../pages/member/Dashboard';
import CreateReport from '../pages/member/CreateReport';
import EditReport from '../pages/member/EditReport';
import MyReports from '../pages/member/MyReports';
import Profile from '../pages/member/Profile';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';
import ManagerReports from '../pages/manager/Reports';
import ManagerProjects from '../pages/manager/Projects';
import ManagerUsers from '../pages/manager/Users';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Member Protected Workspace */}
        <Route
          path="/member"
          element={
            <ProtectedRoute roles={['member']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="create-report" element={<CreateReport />} />
          <Route path="edit-report/:id" element={<EditReport />} />
          <Route path="reports" element={<MyReports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Manager Protected Workspace */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={['manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="projects" element={<ManagerProjects />} />
          <Route path="users" element={<ManagerUsers />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Catch-all redirect to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
