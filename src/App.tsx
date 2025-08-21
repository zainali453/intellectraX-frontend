import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Signin";
import DashboardLayout from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthGuard from "./components/AuthGuard";
import TeacherOnboarding from "./pages/TeacherOnboarding";
import StudentOnboarding from "./pages/StudentsOnboarding";
import ParentOnboarding from "./pages/ParentOnbaording";
import Onboarding from "./pages/Onboarding";
import VerificationPending from "./pages/VerificationPending";
import { UserProvider } from "./context/UserContext";
import Landing from "./pages/Landing";
import JWTExpiredHandler from "./components/JWTExpiredHandler";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Page Components
import DashMain from "./pages/dashboard pages/DashMain";
import Verifications from "./pages/dashboard pages/Verification";
import ViewDetails from "./components/ViewDetails";
import ViewDetailsActor from "./components/ViewDetailsActor";
import ProfileView from "./pages/dashboard pages/ProfileView";
import Signup from "./pages/Signup";

// Role-based Route Components
import {
  ClassesRoute,
  StudentsRoute,
  TeachersRoute,
  ParentsRoute,
  SubjectsRoute,
  AssignmentsRoute,
  QuizzesRoute,
  SystemLogsRoute,
  EarningsRoute,
  SupportTicketsRoute,
} from "./routing";
import RegistrationForm from "./pages/onboarding components/RegistrationForm";
import OTP from "./pages/onboarding components/OTP";
import RegistrationSuccess from "./components/teacherOnboarding/RegistrationSuccess";
import PriceNegotiation from "./components/teacherOnboarding/PriceNegotation";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/"
            element={
              <AuthGuard requireAuth={false}>
                <Landing />
              </AuthGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthGuard requireAuth={false}>
                <Signup />
              </AuthGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuard requireAuth={false}>
                <RegistrationForm />
              </AuthGuard>
            }
          />
          <Route
            path="/otp"
            element={
              <AuthGuard requireAuth={false}>
                <OTP />
              </AuthGuard>
            }
          />

          <Route
            path="/signin"
            element={
              <AuthGuard requireAuth={false}>
                <SignIn />
              </AuthGuard>
            }
          />

          <Route
            path="/onboarding"
            element={
              <AuthGuard requireAuth={false}>
                <Onboarding />
              </AuthGuard>
            }
          />
          <Route
            path="/success"
            element={
              <AuthGuard requireAuth={false}>
                <RegistrationSuccess />
              </AuthGuard>
            }
          />
          <Route
            path="/pricenegotiation"
            element={
              <AuthGuard requireAuth={false}>
                <PriceNegotiation />
              </AuthGuard>
            }
          />
          {/* <Route
            path="/verification-pending"
            element={
              <AuthGuard requireAuth={true}>
                <VerificationPending />
              </AuthGuard>
            }
          /> */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Global JWT Expiration Handler */}
      <JWTExpiredHandler />
    </UserProvider>
  );
}

export default App;

// {
//   /* Main app with global header */
// }
// <Route element={<MainLayout />}>
//   {/* Protected dashboard routes under main layout */}
//   <Route
//     path="/dashboard"
//     element={
//       <AuthGuard requireAuth={true}>
//         <DashboardLayout />
//       </AuthGuard>
//     }
//   >
//     <Route
//       index
//       element={
//         <AuthGuard requireAuth={true}>
//           <DashMain title="Dashboard" />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="verifications"
//       element={
//         <AuthGuard requireAuth={true}>
//           <Verifications />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="subjects"
//       element={
//         <AuthGuard requireAuth={true}>
//           <SubjectsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="classes"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ClassesRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="students"
//       element={
//         <AuthGuard requireAuth={true}>
//           <StudentsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="teachers"
//       element={
//         <AuthGuard requireAuth={true}>
//           <TeachersRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="parents"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ParentsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="assignments"
//       element={
//         <AuthGuard requireAuth={true}>
//           <AssignmentsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="teachers/:email/:role"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ProfileView />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="quizzes"
//       element={
//         <AuthGuard requireAuth={true}>
//           <QuizzesRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/dashboard/quizzes/:id"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetails />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/dashboard/classes/:id"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetails />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/dashboard/students/:id"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetails />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/dashboard/teachers/:id"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetailsActor />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/dashboard/students/:id"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetailsActor />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="/dashboard/parents/:id"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetails />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="messages"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetails />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="system-logs"
//       element={
//         <AuthGuard requireAuth={true}>
//           <SystemLogsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="earnings"
//       element={
//         <AuthGuard requireAuth={true}>
//           <EarningsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="support-tickets"
//       element={
//         <AuthGuard requireAuth={true}>
//           <SupportTicketsRoute />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="settings"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ProfileView />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="profileview"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ProfileView />
//         </AuthGuard>
//       }
//     />
//     <Route
//       path="viewquiz"
//       element={
//         <AuthGuard requireAuth={true}>
//           <ViewDetails />
//         </AuthGuard>
//       }
//     />
//   </Route>
// </Route>;
