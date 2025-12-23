import React, { useEffect, useState } from "react";
import { teacherService, StudentForClass } from "@/services/teacher.service";
import InputField from "@/components/InputField";
import CustomDropdown from "@/components/CustomDropdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import TeacherCustomHeader from "@/components/TeacherCustomHeader";

type ParticipantType = "student" | "parent" | "both";

const TeacherCalls = () => {
  const navigate = useNavigate();
  const [callPurpose, setCallPurpose] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [participants, setParticipants] = useState<ParticipantType>("student");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [students, setStudents] = useState<StudentForClass[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [initiatingCall, setInitiatingCall] = useState(false);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const response = await teacherService.getSubjectsForCalls();
        if (response.success && response.data) {
          setSubjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch students when subject changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSubject) {
        setStudents([]);
        setSelectedStudent("");
        return;
      }

      try {
        setLoadingStudents(true);
        const response = await teacherService.getStudentsForCalls(
          selectedSubject
        );
        if (response.success && response.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedSubject]);

  const handleStartCall = async () => {
    if (!callPurpose.trim()) {
      alert("Please enter the call purpose");
      return;
    }
    if (!selectedSubject) {
      alert("Please select a subject");
      return;
    }
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    try {
      setInitiatingCall(true);
      const response = await teacherService.initiateCall({
        callPurpose,
        subject: selectedSubject,
        studentId: selectedStudent,
        participants,
      });

      if (response.success && response.data) {
        // Open the meeting in a new window
        const newWindow = window.open(
          `/teacher/call/${response.data.callId}`,
          `call-${response.data.callId}`
        );

        if (newWindow) {
          newWindow.focus();
        }
      }
    } catch (error: any) {
      console.error("Error initiating call:", error);
      alert(error.message || "Failed to initiate call");
    } finally {
      setInitiatingCall(false);
    }
  };

  const subjectOptions = subjects.map((subject) => ({
    value: subject,
    label: subject.charAt(0).toUpperCase() + subject.slice(1),
  }));

  const studentOptions = students.map((student) => ({
    value: student.studentId,
    label: student.fullName,
  }));

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader title='Audio/Video Call' />
      <div className='bg-white p-6 rounded-2xl'>
        <div className='max-w-7xl'>
          {/* Call Purpose */}
          <div className='mb-6'>
            <InputField
              label={
                <span className='text-teal-600 font-medium'>Call Purpose</span>
              }
              name='callPurpose'
              placeholder='Call Purpose'
              value={callPurpose}
              onChange={(e) => setCallPurpose(e.target.value)}
            />
          </div>

          {/* Subject and Participants Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            {/* Subject Dropdown */}
            <div>
              <CustomDropdown
                label='Subject'
                placeholder='Select Subject'
                value={selectedSubject}
                onChange={(value) => {
                  setSelectedSubject(value);
                  setSelectedStudent("");
                }}
                options={subjectOptions}
                disabled={loadingSubjects}
              />
            </div>

            {/* Participants Radio Buttons */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Participants
              </label>
              <div className='flex items-center gap-8 py-3 px-4 border border-gray-300 rounded-lg bg-white'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='participants'
                    value='student'
                    checked={participants === "student"}
                    onChange={() => setParticipants("student")}
                    className='w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 accent-teal-600'
                  />
                  <span className='text-gray-700'>Student</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='participants'
                    value='parent'
                    checked={participants === "parent"}
                    onChange={() => setParticipants("parent")}
                    className='w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 accent-teal-600'
                  />
                  <span className='text-gray-700'>Parent</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='participants'
                    value='both'
                    checked={participants === "both"}
                    onChange={() => setParticipants("both")}
                    className='w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 accent-teal-600'
                  />
                  <span className='text-gray-700'>Both</span>
                </label>
              </div>
            </div>
          </div>

          {/* Student Dropdown */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div>
              <CustomDropdown
                label='Student'
                placeholder='Select Student'
                value={selectedStudent}
                onChange={setSelectedStudent}
                options={studentOptions}
                disabled={!selectedSubject || loadingStudents}
              />
            </div>
          </div>

          {/* Start Call Button */}
          <div className='flex justify-center'>
            <button
              onClick={handleStartCall}
              disabled={
                initiatingCall ||
                !callPurpose ||
                !selectedSubject ||
                !selectedStudent
              }
              className='px-12 py-3 bg-teal-600 text-white font-medium rounded-full hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {initiatingCall ? (
                <>
                  <LoadingSpinner size='sm' />
                  <span>Starting...</span>
                </>
              ) : (
                "Start Call"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCalls;
