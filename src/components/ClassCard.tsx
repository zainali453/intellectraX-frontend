import React, { useState } from "react";

export interface ClassData {
  id: string;
  subject: string;
  student: string;
  date: string;
  time: string;
  onJoinClass?: () => void;
  onAcceptence?: (accepted: boolean) => void;
  onClick?: () => void;
  isTeacher?: boolean;
  status?: string;
}

interface ClassCardProps {
  data: ClassData;
}

const ClassCard: React.FC<ClassCardProps> = ({ data }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[280px] max-w-[320px]'>
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
          <span className='text-gray-500 font-medium'>Date:</span>
          <span className='ml-2 text-gray-800'>{data.date}</span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Time:</span>
          <span className='ml-2 text-gray-800'>{data.time}</span>
        </div>
        {data.status && (
          <div className='flex items-center text-sm'>
            <span className='text-gray-500 font-medium'>Status:</span>
            <span
              className={`ml-2 ${
                data.status === "Accepted"
                  ? "text-green-600"
                  : data.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {data.status}
            </span>
          </div>
        )}
      </div>

      {/* Join Class Button */}
      {data.onJoinClass ? (
        <button
          onClick={data.onJoinClass}
          className='w-full bg-transparent border border-bgprimary text-bgprimary py-2.5 px-4 rounded-full font-medium text-sm hover:bg-teal-50 transition-colors duration-200'
        >
          Join Class
        </button>
      ) : (
        data.onAcceptence && (
          <div className='grid grid-cols-2 gap-2'>
            <button
              onClick={() => {
                data.onAcceptence && data.onAcceptence(true);
              }}
              className='w-full border-bgprimary border text-bgprimary hover:text-white py-2.5 px-4 rounded-full font-medium text-sm hover:bg-teal-600 transition-colors duration-200'
            >
              Accept
            </button>
            <button
              onClick={() => {
                data.onAcceptence && data.onAcceptence(false);
              }}
              className='w-full border-[#D94141] border text-[#D94141] hover:text-white py-2.5 px-4 rounded-full font-medium text-sm hover:bg-[#D94141] transition-colors duration-200'
            >
              Reject
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ClassCard;
