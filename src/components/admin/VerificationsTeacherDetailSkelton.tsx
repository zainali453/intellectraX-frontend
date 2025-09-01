const VerificationsTeacherDetailSkelton = () => {
  return (
    <div className="min-h-screen mb-6">
      {/* Header with back button */}
      <div className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row justify-between gap-8">
        {/* Left Section Skeleton */}
        <div className="ml-8 w-[70%]">
          <div className="space-y-6 flex flex-col">
            <div className="flex flex-row justify-between gap-8 bg-white rounded-xl p-6">
              {/* Teacher Image Skeleton */}
              <div className="w-[500px] h-[375px] bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 max-w-[400px]">
                {/* Teacher Name Skeleton */}
                <div className="w-40 h-9 bg-gray-200 rounded animate-pulse mb-4"></div>
                {/* Bio Skeleton */}
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              {/* Documents Skeleton */}
              <div className="mb-8">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Action Buttons Skeleton */}
              <div className="flex gap-3 justify-end">
                <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section Skeleton */}
        <div className="w-[30%] p-8 bg-white rounded-xl">
          <div className="max-w-md">
            <div className="space-y-8">
              {/* Fields Skeleton */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex flex-row justify-between border-b border-[#DBDFE1] pb-2"
                >
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
              {/* Availability Skeleton */}
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <div key={item} className="flex justify-between">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationsTeacherDetailSkelton;
