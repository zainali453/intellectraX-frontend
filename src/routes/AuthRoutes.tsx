import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import AuthGuard from "../layouts/AuthGuard";
import Landing from "../pages/Landing";
import Signup from "../pages/Signup";
import RegistrationForm from "../pages/onboarding components/RegistrationForm";
import OTP from "../pages/onboarding components/OTP";
import Onboarding from "../pages/Onboarding";
import RegistrationSuccess from "../components/teacherOnboarding/RegistrationSuccess";
import StudentRegistrationSuccess from "../components/studentOnboarding/RegistrationSuccess";
import PriceNegotiation from "../pages/PriceNegotiation";
import SignIn from "../pages/Signin";
export const AuthRoutes = (
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
);
