import { Route } from "react-router-dom";
import AuthGuard from "../layouts/AuthGuard";
import MainLayout from "../layouts/MainLayout";

import StudentDashboard from "../pages/student/Dashboard";
import StudentTeachers from "../pages/student/Teachers";
import StudentTeacherDetails from "../pages/student/TeacherDetails";
import StudentClasses from "../pages/student/Classes";
import StudentClassDetails from "../pages/student/ClassDetails";
import StudentAssignments from "../pages/student/Assignments";
import StudentAssignmentDetails from "../pages/student/AssignmentDetails";
import StudentQuizzes from "../pages/student/Quizzes";
import StudentQuizDetails from "../pages/student/QuizDetails";
import StudentMessages from "../pages/student/Messages.tsx";
import StudentMeeting from "../pages/student/StudentMeeting";
import StudentPayments from "../pages/student/Payments";
import StudentSettings from "../pages/student/Settings.tsx";
import StudentSubscription from "../pages/student/Subscription.tsx";

export const StudentRoutes = (
  <>
    <Route
      path='/student'
      element={
        <AuthGuard requireAuth={true} requireStudent={true}>
          <MainLayout />
        </AuthGuard>
      }
    >
      <Route index element={<StudentDashboard title={"Dashboard"} />} />
      <Route
        path='dashboard'
        element={<StudentDashboard title={"Dashboard"} />}
      />
      <Route path='teachers' element={<StudentTeachers />} />
      <Route path='teachers/:id' element={<StudentTeacherDetails />} />
      <Route path='classes' element={<StudentClasses />} />
      <Route path='classes/:id' element={<StudentClassDetails />} />
      <Route path='assignments' element={<StudentAssignments />} />
      <Route path='assignments/:id' element={<StudentAssignmentDetails />} />
      <Route path='quizzes' element={<StudentQuizzes />} />
      <Route path='quizzes/:id' element={<StudentQuizDetails />} />
      <Route path='messages' element={<StudentMessages />} />
      <Route path='messages/:id' element={<StudentMessages />} />
      <Route path='payments' element={<StudentPayments />} />
      <Route path='settings' element={<StudentSettings />} />
      <Route path='subscription-plans' element={<StudentSubscription />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Route>

    <Route
      path='/student/meeting/:classId'
      element={
        <AuthGuard requireAuth={true} requireStudent={true}>
          <StudentMeeting />
        </AuthGuard>
      }
    />
  </>
);
