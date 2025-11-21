import React from "react";
import CustomIcon from "./CustomIcon";
import { ChildDashboardCard as ChildDashboardCardType } from "@/services/parent.service";
import { formatDisplayTime } from "@/services/teacher.service";

interface ChildDashboardCardProps {
  data: ChildDashboardCardType;
}

const CalculateDatePeriod = (date: string) => {
  const classDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (classDate.getTime() === today.getTime()) {
    return "Today";
  }
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  if (classDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }
  // if the date is within the next 7 days, return the weekday name
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);
  if (classDate > today && classDate < nextWeek) {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return classDate.toLocaleDateString(undefined, options);
  }
  // otherwise, return the date in MM/DD/YYYY format
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return classDate.toLocaleDateString(undefined, options);
};
const ChildDashboardCard: React.FC<ChildDashboardCardProps> = ({ data }) => {
  const { childName, grade, profilePic, academicProgress, upcomingClasses } =
    data;

  return (
    <div className='bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer'>
      {/* Header with Profile */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0'>
          {profilePic ? (
            <img
              src={profilePic}
              alt={childName}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <CustomIcon name='user' className='w-8 h-8 text-gray-400' />
            </div>
          )}
        </div>
        <div className='flex-1'>
          <h3 className='text-lg font-bold text-gray-900'>{childName}</h3>
          <p className='text-sm text-gray-500'>{grade.toLocaleUpperCase()}</p>
        </div>
      </div>

      {/* Academic Progress */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-semibold text-gray-700'>
            Academic Progress
          </span>
          <span className='text-sm font-bold text-bgprimary'>
            {academicProgress}%
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2.5'>
          <div
            className={`h-2.5 rounded-full transition-all duration-1000 bg-bgprimary`}
            style={{ width: `${academicProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className='mb-6'>
        <h4 className='text-sm font-semibold text-gray-700 mb-3'>
          Upcoming Classes
        </h4>
        <div className='space-y-2'>
          {upcomingClasses.slice(0, 3).map((classItem, index) => (
            <div
              key={index}
              className='flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0
                      ? "bg-bgprimary"
                      : index === 1
                      ? "bg-[#A855F7]"
                      : "bg-[#F97316]"
                  }`}
                >
                  <span className='text-white text-sm font-bold'>
                    {classItem.subject.toLocaleUpperCase().charAt(0)}
                  </span>
                </div>
                <span className='text-sm font-medium text-gray-800'>
                  {classItem.subject.toLocaleUpperCase()}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-medium text-gray-600'>
                  {formatDisplayTime(classItem.time)}
                </span>
                <span className='text-xs text-gray-400'>
                  {CalculateDatePeriod(classItem.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      {/* <div>
        <h4 className='text-sm font-semibold text-gray-700 mb-3'>
          Important Information
        </h4>
        <div className='space-y-2'>
          {importantInfo.map((info, index) => (
            <div
              key={index}
              className='flex items-start gap-3 py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${info.color}`}
              >
                <span className='text-white text-lg'>
                  {info.icon === "book"
                    ? "📖"
                    : info.icon === "quiz"
                    ? "📝"
                    : "📋"}
                </span>
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-800'>
                  {info.title}
                </p>
                <p className='text-xs text-gray-500 mt-0.5'>
                  {info.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ChildDashboardCard;
