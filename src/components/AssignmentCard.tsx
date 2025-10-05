import React, { useState } from "react";

export interface AssignmentCardData {
  assignmentId: string;
  subject: string;
  student: string;
  createdAt: string;
  dueDate: string;
  title: string;
  status: string;
  onClick: () => void;
  isTeacher?: boolean;
  teacher?: string;
}

interface AssignmentCardProps {
  data: AssignmentCardData;
}

const ClassCard: React.FC<AssignmentCardProps> = ({ data }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div className='bg-white rounded-2xl px-4 pt-4 pb-2 shadow-sm border border-gray-100 min-w-[300px] max-w-[320px]'>
      {/* Subject Image */}
      <div className='relative mb-4 cursor-pointer' onClick={data.onClick}>
        {!imageError ? (
          <img
            src={`/subjects/${data?.subject?.toLowerCase()}.png`}
            alt={data?.subject}
            className='w-full h-32 object-cover rounded-xl'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='w-full h-32 bg-[#4393961a] rounded-xl flex items-center justify-center p-2'>
            <span className='text-bgprimary font-medium text-2xl capitalize wrap-anywhere text-center'>
              {data.subject || "Subject"}
            </span>
          </div>
        )}
      </div>

      {/* Class Details */}
      <div className='space-y-2 mb-4'>
        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Subject:</span>
          <span className='ml-2 text-gray-800 font-semibold'>
            {data.subject}
          </span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>
            {data.isTeacher ? "Teacher:" : "Student:"}
          </span>
          <span className='ml-2 text-gray-800'>{data.student}</span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Title:</span>
          <span className='ml-2 text-gray-800'>
            {data.title.length > 30
              ? data.title.slice(0, 30) + "..."
              : data.title}
          </span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Due Date:</span>
          <span className='ml-2 text-gray-800'>{data.dueDate}</span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Assigned Date:</span>
          <span className='ml-2 text-gray-800'>{data.createdAt}</span>
        </div>
        {data.status && (
          <div className='flex items-center text-sm'>
            <span className='text-gray-500 font-medium'>Status:</span>
            <span
              className={`ml-2 ${
                data.status === "Completed"
                  ? "text-green-600"
                  : data.status === "Marking Pending"
                  ? "text-blue-700"
                  : "text-yellow-600"
              }`}
            >
              {data.status}
            </span>
          </div>
        )}
        <button
          onClick={data.onClick}
          className='w-full bg-transparent border border-bgprimary text-bgprimary py-2.5 px-4 rounded-full font-medium text-sm hover:bg-teal-50 transition-colors duration-200'
        >
          View Submission
        </button>
      </div>
    </div>
  );
};

export default ClassCard;
