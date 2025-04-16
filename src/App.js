// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QuizPage from './pages/student/exam/QuizPage';
import UploadCSV from './pages/teacher/create-question/UploadCSV';
import ExamQRPage from './pages/teacher/create-question/ExamQRPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/quiz/:code" element={<QuizPage />} />
        <Route path="/upload-csv" element={<UploadCSV />} />
        <Route path="/exam-qr" element={<ExamQRPage />} />
      </Routes>
    </Router>
  );
}

export default App;
