import { Route } from "react-router-dom";
import AuthGuard from "../layouts/AuthGuard";
import MainLayout from "../layouts/MainLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import TeachersVerification from "../pages/admin/Verifications";
import VerificationsTeacherDetail from "../pages/admin/VerificationsTeacherDetail";
import StudentPairing from "../pages/admin/StudentPairing";
import AdminTeachers from "../pages/admin/Teachers";
import AdminParents from "../pages/admin/Parents.tsx";
import AdminParentDetails from "../pages/admin/ParentDetail.tsx";
import AdminStudents from "../pages/admin/Students";
import AdminStudentDetails from "../pages/admin/StudentDetails";
import AdminClasses from "../pages/admin/Classes";
import AdminClassDetails from "../pages/admin/ClassDetails";
import AdminAssignments from "../pages/admin/Assignments";
import AdminAssignmentDetails from "../pages/admin/AssignmentDetails";
import AdminQuizzes from "../pages/admin/Quizzes";
import AdminQuizDetails from "../pages/admin/QuizDetails";
import AdminMessages from "../pages/admin/Messages";
import AdminLogs from "../pages/admin/Logs.tsx";
import AdminEarnings from "../pages/admin/Earnings.tsx";
import AdminSupportTickets from "../pages/admin/SupportTickers.tsx";
import AdminSettings from "../pages/admin/Settings.tsx";

export const AdminRoutes = (
  <Route
    path='/admin'
    element={
      <AuthGuard requireAuth={true} requireAdmin={true}>
        <MainLayout />
      </AuthGuard>
    }
  >
    <Route index element={<AdminDashboard title={"Dashboard"} />} />
    <Route path='dashboard' element={<AdminDashboard title={"Dashboard"} />} />
    <Route path='verifications' element={<TeachersVerification />} />
    <Route
      path='verifications/teacher/:id'
      element={<VerificationsTeacherDetail />}
    />
    <Route path='pairing' element={<StudentPairing />} />
    <Route path='students' element={<AdminStudents />} />
    <Route path='students/:id' element={<AdminStudentDetails />} />
    <Route path='teachers' element={<AdminTeachers />} />
    <Route path='teachers/:id' element={<VerificationsTeacherDetail />} />
    <Route path='parents' element={<AdminParents />} />
    <Route path='parents/:id' element={<AdminParentDetails />} />
    <Route path='classes' element={<AdminClasses />} />
    <Route path='classes/:id' element={<AdminClassDetails />} />
    <Route path='assignments' element={<AdminAssignments />} />
    <Route path='assignments/:id' element={<AdminAssignmentDetails />} />
    <Route path='quizzes' element={<AdminQuizzes />} />
    <Route path='quizzes/:id' element={<AdminQuizDetails />} />
    <Route path='messages' element={<AdminMessages />} />
    <Route path='system-logs' element={<AdminLogs />} />
    <Route path='earnings' element={<AdminEarnings />} />
    <Route path='support-tickets' element={<AdminSupportTickets />} />
    <Route path='settings' element={<AdminSettings />} />
    <Route path='*' element={<div>404 Not Found</div>} />
  </Route>
);
