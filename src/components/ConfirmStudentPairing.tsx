import React from "react";
import CustomIcon from "./CustomIcon";

interface Teacher {
  id: string;
  email: string;
  fullName: string;
  profilePic: string;
  customId: string;
}

interface Student {
  id: string;
  email: string;
  fullName: string;
  level: string;
  customId: string;
}

interface ConfirmStudentPairingProps {
  teacher: Teacher;
  student: Student;
  subject: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmStudentPairing: React.FC<ConfirmStudentPairingProps> = ({
  teacher,
  student,
  subject,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  // Get initials for avatars
  const getInitials = (name: string | undefined, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Generate dummy data for display (in real app, this would come from API)
  const teacherDisplayData = {
    fullName: teacher.fullName,
    id: teacher.id,
    email: teacher.email,
    subject: subject[0].toUpperCase() + subject.slice(1),
    profilePic: teacher.profilePic,
    customId: teacher.customId,
  };

  const studentDisplayData = {
    fullName: student.fullName,
    id: student.id,
    email: student.email,
    level: student.level.toLocaleUpperCase(),
    subject: subject[0].toUpperCase() + subject.slice(1),
    customId: student.customId,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-8">
        Create New Teacher-Student Assignment
      </h2>

      {/* Info Banner */}
      <div className="bg-[#43939616] border-l-4 border-bgprimary p-4 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CustomIcon name="pairingActive" className="w-4 h-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-bgprimary">
              Please confirm teacher-student assignment details
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Review the details below and click "Assign Teacher" to complete
              the assignment.
            </p>
          </div>
        </div>
      </div>

      {/* Teacher and Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Teacher Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-bgprimary bg-[#43939616] px-4 py-1 rounded-full">
              Teacher
            </span>
          </div>

          <div className="flex items-center mb-4">
            {teacherDisplayData.profilePic ? (
              <img
                src={teacherDisplayData.profilePic}
                alt={teacherDisplayData.fullName}
                className="w-12 h-12 bg-gray-200 text-bgprimary rounded-full flex items-center justify-center font-semibold text-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 text-bgprimary rounded-full flex items-center justify-center font-semibold text-lg">
                {getInitials(teacherDisplayData.fullName, teacher.email)}
              </div>
            )}
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                {teacherDisplayData.fullName}
              </h3>
              <p className="text-sm text-gray-600">
                ID: {teacherDisplayData.customId}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-semibold text-gray-900">
                {teacherDisplayData.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subject:</span>
              <span className="text-sm font-semibold text-gray-900">
                {teacherDisplayData.subject}
              </span>
            </div>
          </div>
        </div>

        {/* Student Card */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-bgprimary bg-[#43939616] px-4 py-1 rounded-full">
              Student
            </span>
          </div>

          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-200 text-bgprimary rounded-full flex items-center justify-center font-semibold text-lg">
              {getInitials(studentDisplayData.fullName, student.email)}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                {studentDisplayData.fullName}
              </h3>
              <p className="text-sm text-gray-600">
                ID: {studentDisplayData.customId}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-semibold text-gray-900">
                {studentDisplayData.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Level:</span>
              <span className="text-sm font-semibold text-gray-900">
                {studentDisplayData.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subject:</span>
              <span className="text-sm font-semibold text-gray-900">
                {studentDisplayData.subject}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-6 py-3 bg-bgprimary text-white rounded-lg hover:bg-bgprimary/90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
          {isLoading ? "Assigning..." : "Assign Teacher"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmStudentPairing;
