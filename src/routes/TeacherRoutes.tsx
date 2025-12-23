import { Route } from "react-router-dom";
import AuthGuard from "../layouts/AuthGuard";
import MainLayout from "../layouts/MainLayout";

import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherStudents from "../pages/teacher/Students";
import TeacherStudentDetails from "../pages/teacher/StudentDetails";
import TeacherClasses from "../pages/teacher/Classes";
import TeacherClassDetails from "../pages/teacher/ClassDetails";
import TeacherAssignments from "../pages/teacher/Assignments";
import TeacherAssignmentDetails from "../pages/teacher/AssignmentDetails";
import TeacherQuizzes from "../pages/teacher/Quizzes";
import TeacherQuizDetails from "../pages/teacher/QuizDetails";
import TeacherMessages from "../pages/teacher/Messages.tsx";
import TeacherMeeting from "../pages/teacher/TeacherMeeting";
import TeacherCalls from "../pages/teacher/TeacherCalls.tsx";
import TeacherEarnings from "../pages/teacher/Earnings.tsx";
import TeacherLogs from "../pages/teacher/Logs.tsx";
import TeacherSettings from "../pages/teacher/Settings.tsx";

export const TeacherRoutes = (
  <>
    <Route
      path='/teacher'
      element={
        <AuthGuard requireAuth={true} requireTeacher={true}>
          <MainLayout />
        </AuthGuard>
      }
    >
      <Route index element={<TeacherDashboard title={"Dashboard"} />} />
      <Route
        path='dashboard'
        element={<TeacherDashboard title={"Dashboard"} />}
      />
      <Route path='students' element={<TeacherStudents />} />
      <Route path='students/:id' element={<TeacherStudentDetails />} />
      <Route path='classes' element={<TeacherClasses />} />
      <Route path='classes/:id' element={<TeacherClassDetails />} />
      <Route path='assignments' element={<TeacherAssignments />} />
      <Route path='assignments/:id' element={<TeacherAssignmentDetails />} />
      <Route path='quizzes' element={<TeacherQuizzes />} />
      <Route path='quizzes/:id' element={<TeacherQuizDetails />} />
      <Route path='messages' element={<TeacherMessages />} />
      <Route path='messages/:id' element={<TeacherMessages />} />
      <Route path='calls' element={<TeacherCalls />} />
      <Route path='earnings' element={<TeacherEarnings />} />
      <Route path='logs' element={<TeacherLogs />} />
      <Route path='settings' element={<TeacherSettings />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Route>

    <Route
      path='/teacher/meeting/:classId'
      element={
        <AuthGuard requireAuth={true} requireTeacher={true}>
          <TeacherMeeting />
        </AuthGuard>
      }
    />
  </>
);
