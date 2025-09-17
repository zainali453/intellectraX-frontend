import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Signin";
import { UserProvider } from "./context/UserContext";
import Landing from "./pages/Landing";
import AuthLayout from "./layouts/AuthLayout";
import AuthGuard from "./layouts/AuthGuard";

import RegistrationForm from "./pages/onboarding components/RegistrationForm";
import OTP from "./pages/onboarding components/OTP";
import RegistrationSuccess from "./components/teacherOnboarding/RegistrationSuccess";
import StudentRegistrationSuccess from "./components/studentOnboarding/RegistrationSuccess";
import PriceNegotiation from "./pages/PriceNegotiation";
import Onboarding from "./pages/Onboarding";
import Signup from "./pages/Signup";
import MainLayout from "./layouts/MainLayout";

// admin
import AdminDashboard from "./pages/admin/Dashboard";
import TeachersVerification from "./pages/admin/Verifications";
import VerificationsTeacherDetail from "./pages/admin/VerificationsTeacherDetail";
import StudentPairing from "./pages/admin/StudentPairing";

// teacher
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudents from "./pages/teacher/Students";
import TeacherStudentDetails from "./pages/teacher/StudentDetails";

// student
import StudentDashboard from "./pages/student/Dashboard";
import StudentTeachers from "./pages/student/Teachers";
import StudentTeacherDetails from "./pages/student/TeacherDetails";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path='/'
            element={
              <AuthGuard requireAuth={false}>
                <Landing />
              </AuthGuard>
            }
          />
          <Route
            path='/signup'
            element={
              <AuthGuard requireAuth={false}>
                <Signup />
              </AuthGuard>
            }
          />
          <Route
            path='/register'
            element={
              <AuthGuard requireAuth={false}>
                <RegistrationForm />
              </AuthGuard>
            }
          />
          <Route
            path='/otp'
            element={
              <AuthGuard requireAuth={true}>
                <OTP />
              </AuthGuard>
            }
          />

          <Route
            path='/signin'
            element={
              <AuthGuard requireAuth={false}>
                <SignIn />
              </AuthGuard>
            }
          />

          <Route
            path='/onboarding'
            element={
              <AuthGuard requireAuth={true}>
                <Onboarding />
              </AuthGuard>
            }
          />
          <Route
            path='/success'
            element={
              <AuthGuard requireAuth={true}>
                <RegistrationSuccess />
              </AuthGuard>
            }
          />
          <Route
            path='/studentsuccess'
            element={
              <AuthGuard requireAuth={true}>
                <StudentRegistrationSuccess />
              </AuthGuard>
            }
          />
          <Route
            path='/pricenegotiation'
            element={
              <AuthGuard requireAuth={true}>
                <PriceNegotiation />
              </AuthGuard>
            }
          />
        </Route>
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
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>
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
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>
        <Route
          path='/admin'
          element={
            <AuthGuard requireAuth={true} requireAdmin={true}>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route index element={<AdminDashboard title={"Dashboard"} />} />
          <Route
            path='dashboard'
            element={<AdminDashboard title={"Dashboard"} />}
          />
          <Route path='verifications' element={<TeachersVerification />} />
          <Route
            path='verifications/teacher/:id'
            element={<VerificationsTeacherDetail />}
          />
          <Route path='pairing' element={<StudentPairing />} />
          <Route path='users' element={<div>Users Component</div>} />
          <Route path='settings' element={<div>Settings Component</div>} />
          <Route path='teachers' element={<div>Teachers Component</div>} />
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
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
