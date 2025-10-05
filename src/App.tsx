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
import AdminTeachers from "./pages/admin/Teachers";
import AdminStudents from "./pages/admin/Students";
import AdminStudentDetails from "./pages/admin/StudentDetails";
import AdminClasses from "./pages/admin/Classes";
import AdminClassDetails from "./pages/admin/ClassDetails";

// teacher
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherStudents from "./pages/teacher/Students";
import TeacherStudentDetails from "./pages/teacher/StudentDetails";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherClassDetails from "./pages/teacher/ClassDetails";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherAssignmentDetails from "./pages/teacher/AssignmentDetails";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import TeacherQuizDetails from "./pages/teacher/QuizDetails";

// student
import StudentDashboard from "./pages/student/Dashboard";
import StudentTeachers from "./pages/student/Teachers";
import StudentTeacherDetails from "./pages/student/TeacherDetails";
import StudentClasses from "./pages/student/Classes";
import StudentClassDetails from "./pages/student/ClassDetails";
import StudentAssignments from "./pages/student/Assignments";
import StudentAssignmentDetails from "./pages/student/AssignmentDetails";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentQuizDetails from "./pages/student/QuizDetails";

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

        {/* Teacher Routes */}
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
          <Route
            path='assignments/:id'
            element={<TeacherAssignmentDetails />}
          />
          <Route path='quizzes' element={<TeacherQuizzes />} />
          <Route path='quizzes/:id' element={<TeacherQuizDetails />} />

          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>

        {/* student Routes */}
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
          <Route
            path='assignments/:id'
            element={<StudentAssignmentDetails />}
          />
          <Route path='quizzes' element={<StudentQuizzes />} />
          <Route path='quizzes/:id' element={<StudentQuizDetails />} />
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>

        {/* admin Routes */}
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
          <Route path='students' element={<AdminStudents />} />
          <Route path='students/:id' element={<AdminStudentDetails />} />
          <Route path='teachers' element={<AdminTeachers />} />
          <Route path='teachers/:id' element={<VerificationsTeacherDetail />} />
          <Route path='classes' element={<AdminClasses />} />
          <Route path='classes/:id' element={<AdminClassDetails />} />
          <Route path='*' element={<div>404 Not Found</div>} />
        </Route>

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
