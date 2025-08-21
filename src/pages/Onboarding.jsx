import React from "react";
import { useUser } from "../context/UserContext";
import TeacherOnboarding from "./TeacherOnboarding";
import StudentOnboarding from "./StudentsOnboarding";
import ParentOnboarding from "./ParentOnbaording";

const Onboarding = () => {
  const { user } = useUser();

  // Get the user's role and convert to lowercase for comparison
  const userRole = user?.role?.toLowerCase();

  console.log("Onboarding component - User role:", userRole);

  // Render the appropriate onboarding component based on role
  switch ("teacher") {
    case "teacher":
      return <TeacherOnboarding />;
    case "student":
      return <StudentOnboarding />;
    case "parent":
      return <ParentOnboarding />;
    default:
      // Fallback for unknown roles or missing role
      console.error("Unknown or missing user role:", userRole);
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Role Not Found
            </h2>
            <p className="text-gray-600">
              Unable to determine your role for onboarding.
            </p>
          </div>
        </div>
      );
  }
};

export default Onboarding;
