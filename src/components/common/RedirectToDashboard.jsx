// components/common/RedirectToDashboard.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RedirectToDashboard = ({ fallback }) => {
  const { auth } = useAuth();

  if (!auth) return fallback;

  switch (auth.role) {
    case 'STUDENT':
      return <Navigate to="/student" replace />;
    case 'TEACHER':
      return <Navigate to="/teacher" replace />;
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default RedirectToDashboard;
