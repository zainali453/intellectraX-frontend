import React from "react";

const PriceNegotiationSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-8 w-full max-w-[68%] my-10 animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-300 rounded-md w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
      </div>

      {/* Skeleton for 2 classes */}
      {[...Array(1)].map((_, classIndex) => (
        <div
          key={classIndex}
          className="bg-[#F9FAFB] rounded-lg overflow-hidden p-5 border-1 border-[#EAEAEA] mb-6"
        >
          {/* Level Header Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-300 rounded-md w-24"></div>
            <div className="h-4 bg-gray-200 rounded-md w-16"></div>
          </div>

          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-3 pl-2 text-left">
                    <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                  </th>
                  <th className="pb-3 text-right">
                    <div className="h-4 bg-gray-200 rounded-md w-20 ml-auto"></div>
                  </th>
                  <th className="pb-3 text-center">
                    <div className="h-4 bg-gray-200 rounded-md w-24 mx-auto"></div>
                  </th>
                  <th className="pb-3 text-left">
                    <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, subjectIndex) => (
                  <tr
                    key={subjectIndex}
                    className="bg-white border-1 border-[#EAEAEA]"
                  >
                    <td className="py-4 pl-4">
                      <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                    </td>
                    <td className="py-4 text-center p-2">
                      <div className="flex justify-end">
                        <div className="w-25 h-10 bg-gray-200 rounded-md"></div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-25 h-10 bg-gray-200 rounded-md"></div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Action Buttons Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <div className="flex-1 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default PriceNegotiationSkeleton;
