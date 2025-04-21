import StudentDashboard from '../pages/student/StudentDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import QuizPage from '../pages/student/exam/QuizPage';
import ExamQRPage from '../pages/teacher/create-exam/ExamQRPage';
import QuestionPage from '../pages/teacher/question/QuestionPage';

export const studentRoutes = [
  { path: "/student", element: <StudentDashboard /> },
  { path: "/quiz/:code", element: <QuizPage /> },
];

export const teacherRoutes = [
  { path: "/teacher", element: <TeacherDashboard /> },
  { path: "/exam-qr", element: <ExamQRPage /> },
  { path: "/question", element: <QuestionPage /> },
];

export const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
];
