import React from "react";
import { Student as StudentData } from "@/services/teacher.service";
import femaleImage from "@/assets/subjects/female.png";

interface StudentCardProps {
  student: StudentData;
  onClick: () => void;
  onSendMessage: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onClick,
  onSendMessage,
}) => {
  return (
    <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100  transition-shadow duration-200 max-w-[280px]'>
      {/* Student Profile Image */}
      <div className='mb-4 cursor-pointer' onClick={onClick}>
        <img
          src={student.gender === "female" ? femaleImage : femaleImage}
          alt={student.fullName}
          className='w-full h-32 object-cover rounded-xl'
        />
      </div>

      {/* Student Details */}
      <div className='space-y-2 mb-4'>
        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Student:</span>
          <span className='ml-2 text-gray-800 font-semibold'>
            {student.fullName}
          </span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Enrolled Class:</span>
          <span className='ml-2 text-gray-800'>{student.subject}</span>
        </div>
      </div>

      {/* Send Message Button */}
      <button
        onClick={onSendMessage}
        className='w-full bg-transparent border border-bgprimary text-bgprimary py-2.5 px-4 rounded-full font-medium text-sm hover:bg-teal-50 transition-colors duration-200'
      >
        Send Message
      </button>
    </div>
  );
};

export default StudentCard;
