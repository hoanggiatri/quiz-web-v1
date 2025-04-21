import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { studentRoutes, teacherRoutes, adminRoutes } from './routes/AppRoute';
import AdminLayout from './components/layout/AdminLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import StudentLayout from './components/layout/StudentLayout';
import RedirectToDashboard from './components/common/RedirectToDashboard';
import NotFoundPage from './pages/common/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectToDashboard fallback={<LoginPage />} />} />
          <Route path="/login" element={<RedirectToDashboard fallback={<LoginPage />} />} />

          {studentRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  element={<StudentLayout>{route.element}</StudentLayout>}
                  allowedRoles={['STUDENT']}
                />
              }
            />
          ))}

          {teacherRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  element={<TeacherLayout>{route.element}</TeacherLayout>}
                  allowedRoles={['TEACHER']}
                />
              }
            />
          ))}

          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute
                  element={<AdminLayout>{route.element}</AdminLayout>}
                  allowedRoles={['ADMIN']}
                />
              }
            />
          ))}

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
