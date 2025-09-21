import React from "react";

export interface ClassData {
  id: string;
  subject: string;
  student: string;
  date: string;
  time: string;
  image: string;
  onJoinClass?: () => void;
}

interface ClassesCardsProps {
  classes: ClassData[];
  title?: string;
}

const ClassCard: React.FC<{ classData: ClassData }> = ({ classData }) => {
  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[280px] max-w-[320px]'>
      {/* Subject Image */}
      <div className='relative mb-4'>
        <img
          src={classData.image}
          alt={classData.subject}
          className='w-full h-32 object-cover rounded-xl'
        />
      </div>

      {/* Class Details */}
      <div className='space-y-2 mb-4'>
        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Subject:</span>
          <span className='ml-2 text-gray-800 font-semibold'>
            {classData.subject}
          </span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Student:</span>
          <span className='ml-2 text-gray-800'>{classData.student}</span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Date:</span>
          <span className='ml-2 text-gray-800'>{classData.date}</span>
        </div>

        <div className='flex items-center text-sm'>
          <span className='text-gray-500 font-medium'>Time:</span>
          <span className='ml-2 text-gray-800'>{classData.time}</span>
        </div>
      </div>

      {/* Join Class Button */}
      <button
        onClick={classData.onJoinClass}
        className='w-full bg-transparent border border-bgprimary text-bgprimary py-2.5 px-4 rounded-full font-medium text-sm hover:bg-teal-50 transition-colors duration-200'
      >
        Join Class
      </button>
    </div>
  );
};

const ClassesCards: React.FC<ClassesCardsProps> = ({
  classes,
  title = "Upcoming Classes",
}) => {
  return (
    <div className='w-full'>
      {/* Section Title */}
      <h2 className='text-2xl font-semibold text-textprimary mb-6'>{title}</h2>

      {/* Cards Container */}
      <div className='flex gap-6 overflow-x-auto pb-4'>
        {classes.map((classData) => (
          <ClassCard key={classData.id} classData={classData} />
        ))}
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-2'>
            <svg
              className='w-12 h-12 mx-auto'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H9.5v-2H11v2zm0-4H9.5V7H11v6z' />
            </svg>
          </div>
          <p className='text-gray-500'>No upcoming classes scheduled</p>
        </div>
      )}
    </div>
  );
};

export default ClassesCards;
