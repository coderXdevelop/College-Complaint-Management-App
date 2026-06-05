import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import FacultyLayout from './layouts/FacultyLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import CreateComplaint from './pages/student/CreateComplaint';
import MyComplaints from './pages/student/MyComplaints';
import StudentComplaintDetails from './pages/student/ComplaintDetails';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import AllComplaints from './pages/faculty/AllComplaints';
import FacultyComplaintDetails from './pages/faculty/ComplaintDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="create" element={<CreateComplaint />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<StudentComplaintDetails />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Faculty Protected Routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="complaints" element={<AllComplaints />} />
            <Route path="complaints/:id" element={<FacultyComplaintDetails />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Default Redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
