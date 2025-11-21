import React from "react";
import { Teacher as TeacherData } from "@/services/student.service";
import StarRating from "./StarRating";

interface TeacherCardProps {
  teacher: TeacherData;
  onClick: () => void;
  onSendMessage: () => void;
  isParent?: boolean;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onClick,
  onSendMessage,
  isParent,
}) => {
  return (
    <div className='rounded-2xl p-4 shadow-sm border border-gray-100 max-w-[280px]'>
      {/* Student Profile Image */}
      <div className='mb-4 cursor-pointer' onClick={onClick}>
        <img
          src={teacher.profilePic}
          alt={teacher.fullName}
          className='w-full h-32 object-cover object-top rounded-xl'
        />
      </div>

      {/* Student Details */}
      <div className='space-y-2 mb-4'>
        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Teacher:</span>
          <span className='ml-2 text-gray-800 font-semibold'>
            {teacher.fullName}
          </span>
        </div>
        {isParent && (
          <div className='flex items-center text-sm'>
            <span className='text-gray-500 font-medium'>Child:</span>
            <span className='ml-2 text-gray-800 font-semibold'>
              {teacher.studentName}
            </span>
          </div>
        )}
        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Rating:</span>
          <div className='ml-2'>
            <StarRating rating={teacher.rating} size='lg' showValue={true} />
          </div>
        </div>

        <div className='flex flex-col items-start'>
          <div className='text-gray-500 text-sm font-medium'>
            Teaches Subjects
          </div>
          <div className='text-gray-800'>
            {teacher.subjects
              .join(", ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </div>
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

export default TeacherCard;
