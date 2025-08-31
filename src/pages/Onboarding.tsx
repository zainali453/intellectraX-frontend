import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import TeacherOnboarding from "./TeacherOnboarding";
import StudentOnboarding from "./StudentsOnboarding";
import ParentOnboarding from "./ParentOnbaording";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user.role, navigate]);

  // Render the appropriate onboarding component based on role
  switch (user.role) {
    case "teacher":
      return <TeacherOnboarding />;
    case "student":
      return <StudentOnboarding />;
    case "parent":
      return <ParentOnboarding />;
    case "admin":
      return null;
    default:
      // Fallback for unknown roles or missing role
      console.error("Unknown or missing user role:", user.role);
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
