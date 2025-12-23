import { Route } from "react-router-dom";
import AuthGuard from "../layouts/AuthGuard";
import MainLayout from "../layouts/MainLayout";

import ParentDashboard from "../pages/parent/Dashboard.tsx";
import ParentClasses from "../pages/parent/Classes";
import ParentClassDetails from "../pages/parent/ClassDetails";
import ParentTeachers from "../pages/parent/Teachers";
import ParentTeacherDetails from "../pages/parent/TeacherDetails";
import ParentAssignments from "../pages/parent/Assignments";
import ParentAssignmentDetails from "../pages/parent/AssignmentDetails";
import ParentQuizzes from "../pages/parent/Quizzes";
import ParentQuizDetails from "../pages/parent/QuizDetails";
import ParentMeeting from "../pages/parent/ParentMeeting.tsx";
import ParentMessages from "../pages/parent/Messages.tsx";
import ParentCalls from "../pages/parent/ParentCalls.tsx";
import ParentPayments from "../pages/parent/Payments.tsx";
import ParentSubscription from "@/pages/parent/Subscription.tsx";
import ParentSettings from "../pages/parent/Settings.tsx";

export const ParentRoutes = (
  <>
    <Route
      path='/parent'
      element={
        <AuthGuard requireAuth={true} requireParent={true}>
          <MainLayout />
        </AuthGuard>
      }
    >
      <Route index element={<ParentDashboard title={"Dashboard"} />} />
      <Route
        path='dashboard'
        element={<ParentDashboard title={"Dashboard"} />}
      />
      <Route path='classes' element={<ParentClasses />} />
      <Route path='classes/:id' element={<ParentClassDetails />} />
      <Route path='teachers' element={<ParentTeachers />} />
      <Route path='teachers/:id' element={<ParentTeacherDetails />} />
      <Route path='assignments' element={<ParentAssignments />} />
      <Route path='assignments/:id' element={<ParentAssignmentDetails />} />
      <Route path='quizzes' element={<ParentQuizzes />} />
      <Route path='quizzes/:id' element={<ParentQuizDetails />} />
      <Route path='messages' element={<ParentMessages />} />
      <Route path='messages/:id' element={<ParentMessages />} />
      <Route path='calls' element={<ParentCalls />} />
      <Route path='payments' element={<ParentPayments />} />
      <Route path='settings' element={<ParentSettings />} />
      <Route path='subscription-plans' element={<ParentSubscription />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Route>

    <Route
      path='/parent/meeting/:classId'
      element={
        <AuthGuard requireAuth={true} requireParent={true}>
          <ParentMeeting />
        </AuthGuard>
      }
    />
  </>
);
