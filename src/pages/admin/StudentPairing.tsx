import CustomHeader from "@/components/CustomHeader";
import CustomDropdown from "@/components/CustomDropdown";
import CustomMultiSelect from "@/components/CustomMultiSelect";
import SkeletonDropdown from "@/components/SkeletonDropdown";
import ConfirmStudentPairing from "@/components/ConfirmStudentPairing";
import { adminService } from "@/services/admin.service";
import React, { useState, useEffect } from "react";

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

const StudentPairing = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  // Loading states for different data
  const [isLoadingTeachersAndStudents, setIsLoadingTeachersAndStudents] =
    useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchTeachersAndStudents = async () => {
      setIsLoadingTeachersAndStudents(true);
      try {
        const response = await adminService.getTeacherAndStudentsForPairing();
        if (response.data) {
          setTeachers(response.data.teachers);
          setStudents(response.data.students);
        }
      } catch (error) {
        console.error("Error fetching teachers and students:", error);
      } finally {
        setIsLoadingTeachersAndStudents(false);
      }
    };

    fetchTeachersAndStudents();
  }, []);

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.id,
    label: teacher.email + " - " + teacher.fullName,
  }));

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: student.email + " - " + student.fullName,
  }));

  const subjectOptions = subjects.map((subject) => ({
    value: subject,
    label: subject[0].toLocaleUpperCase() + subject.slice(1),
  }));

  const fetchSubjects = async () => {
    if (!selectedTeacher || !selectedStudent) return;

    setIsLoadingSubjects(true);
    setSubjects([]); // Clear previous subjects
    setSelectedSubject([]); // Clear selected subject

    try {
      const response = await adminService.getSubjectsByTeacherAndStudent(
        selectedTeacher,
        selectedStudent
      );
      if (response.success) {
        if (
          response.data.alreadyPaired &&
          response.data.pairedSubjects.length > 0
        ) {
          setSelectedSubject(response.data.pairedSubjects);
        }
        setSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  useEffect(() => {
    if (selectedTeacher && selectedStudent) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject([]);
      setIsLoadingSubjects(false);
    }
  }, [selectedTeacher, selectedStudent]);

  const handleAssignTeacher = async () => {
    if (!selectedTeacher || !selectedStudent || selectedSubject.length === 0) {
      alert(
        "Please select teacher, student, and at least one subject before assigning."
      );
      return;
    }

    // Show confirmation step instead of directly calling API
    setShowConfirmation(true);
  };

  const handleConfirmAssignment = async () => {
    setIsLoading(true);

    try {
      // Future API call implementation
      const response = await adminService.assignTeacherToStudent(
        selectedTeacher,
        selectedStudent,
        selectedSubject
      );

      if (response.success) {
        alert("Teacher assigned successfully!");
        handleCancel();
      }
    } catch (error: any) {
      console.error("Error assigning teacher:", error);
      alert(error.message || "Failed to assign teacher. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedTeacher("");
    setSelectedStudent("");
    setSelectedSubject([]);
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Get selected teacher and student objects for confirmation
  const selectedTeacherObj = teachers.find((t) => t.id === selectedTeacher);
  const selectedStudentObj = students.find((s) => s.id === selectedStudent);

  return (
    <div className='px-8 py-6'>
      <CustomHeader title='Teacher Assignments' />

      <div className='mt-8'>
        {showConfirmation ? (
          <ConfirmStudentPairing
            teacher={selectedTeacherObj!}
            student={selectedStudentObj!}
            subject={selectedSubject}
            onConfirm={handleConfirmAssignment}
            onCancel={handleCancelConfirmation}
            isLoading={isLoading}
          />
        ) : (
          <div className='bg-white rounded-xl border border-gray-200 p-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-8'>
              Create New Teacher-Student Assignment
            </h2>

            <div className='space-y-6 max-w-md'>
              {isLoadingTeachersAndStudents ? (
                <SkeletonDropdown label='Select Teacher' required />
              ) : (
                <CustomDropdown
                  label='Select Teacher'
                  placeholder='Select a teacher'
                  value={selectedTeacher}
                  onChange={setSelectedTeacher}
                  options={teacherOptions}
                  required
                />
              )}

              {isLoadingTeachersAndStudents ? (
                <SkeletonDropdown label='Select Student' required />
              ) : (
                <CustomDropdown
                  label='Select Student'
                  placeholder='Select a student'
                  value={selectedStudent}
                  onChange={setSelectedStudent}
                  options={studentOptions}
                  required
                />
              )}

              {isLoadingSubjects || isLoadingTeachersAndStudents ? (
                <SkeletonDropdown label='Select Subject' required />
              ) : (
                <CustomMultiSelect
                  label='Select Subject'
                  placeholder='Select subjects'
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  options={subjectOptions}
                  required
                  disabled={
                    !selectedTeacher ||
                    !selectedStudent ||
                    subjects.length === 0
                  }
                />
              )}
            </div>

            <div className='flex justify-end gap-4 mt-8'>
              <button
                onClick={handleCancel}
                disabled={isLoading || isLoadingTeachersAndStudents}
                className='px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTeacher}
                disabled={
                  isLoading ||
                  isLoadingTeachersAndStudents ||
                  isLoadingSubjects ||
                  !selectedTeacher ||
                  !selectedStudent ||
                  selectedSubject.length === 0
                }
                className='px-6 py-3 bg-bgprimary text-white rounded-lg hover:bg-bgprimary/90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {isLoading && (
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                )}
                {isLoading ? "Assigning..." : "Assign Teacher"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPairing;
