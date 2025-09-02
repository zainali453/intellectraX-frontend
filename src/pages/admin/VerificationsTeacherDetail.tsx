import { useEffect, useState } from "react";
import CustomIcon from "../../components/CustomIcon";
import { adminService, TeacherData } from "@/services/admin.service";
import { useNavigate, useParams } from "react-router-dom";
import VerificationsTeacherDetailSkelton from "@/components/admin/VerificationsTeacherDetailSkelton";
import PriceNegotiation from "@/components/admin/PriceNegotation";

// Helper function to format time from 24-hour to 12-hour format
const formatTimeTo12Hour = (time24: string): string => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return `${hour12}:${minutes} ${ampm}`;
};

const VerificationsTeacherDetail = () => {
  const navigate = useNavigate();
  const { id: teacherId } = useParams<{ id: string }>();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    // Fetch teacher data by ID
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      try {
        setLoading(true);
        const response = await adminService.getTeacherById(teacherId);
        if (response.data) {
          setTeacherData(response.data);
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId, update]);

  const handleVerification = async (
    teacherId: string,
    action: "accept" | "reject"
  ) => {
    try {
      setLoading(true);
      await adminService.verifyTeacher(teacherId, action);
      // Refresh the data after successful verification
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Verification failed:", error);
      setLoading(false);
      // Handle error (show toast, alert, etc.)
    }
  };

  // Show skeleton loader while loading
  if (loading) {
    return <VerificationsTeacherDetailSkelton />;
  }

  // Show error state if no data
  if (!teacherData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Teacher not found
          </h2>
          <p className="text-gray-600">
            The teacher you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-6">
      {/* Header with back button */}
      <div className="px-8 py-5">
        <div className="flex items-center gap-4">
          <button
            className="text-bgprimary hover:text-teal-600 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <CustomIcon name="back" className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-medium text-textprimary">
            Teacher Details Page
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className=" flex flex-row justify-between gap-8">
        {/* Left Section - Teacher Image, Bio, and Documents */}
        <div className="ml-8 w-[70%]">
          <div className="space-y-6 flex flex-col">
            <div className="flex flex-row justify-between gap-8 bg-white rounded-xl p-6">
              {/* Teacher Image */}
              <div className="w-auto max-w-[500px] h-auto max-h-[500px] rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={teacherData.userId.profilePic || ""}
                  alt={teacherData.userId.fullName || "Teacher Profile Picture"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 max-w-[400px]">
                {/* Teacher Name */}
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  {teacherData.userId?.fullName || "N/A"}
                </h2>

                {/* Bio */}
                <p className=" text-gray-700 text-base leading-relaxed mb-6">
                  {teacherData.bio || "No bio available"}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6">
              {/* Attached Documents */}
              <div className="mb-8">
                <h3 className="text-xl font-medium text-textprimary mb-6">
                  Attached Documents
                </h3>
                <div className="space-y-6">
                  {teacherData.governmentId && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-bgprimary rounded-full"></div>
                        Government ID
                      </h4>
                      <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <CustomIcon
                              name="assignments"
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
                            <span className="text-gray-900 text-sm font-medium block">
                              Government ID Document
                            </span>
                            <span className="text-gray-500 text-xs">
                              Official identification
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            window.open(teacherData.governmentId, "_blank")
                          }
                          className="px-4 py-2 bg-bgprimary text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Degree Certificates Section */}
                  {teacherData.degreeLinks &&
                    teacherData.degreeLinks.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Degrees ({teacherData.degreeLinks.length})
                        </h4>
                        <div className="space-y-3">
                          {teacherData.degreeLinks.map((link, index) => (
                            <div
                              key={`degree-${index}`}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <CustomIcon
                                    name="assignments"
                                    className="w-5 h-5 text-green-600"
                                  />
                                </div>
                                <div>
                                  <span className="text-gray-900 text-sm font-medium block">
                                    Degree Certificate{" "}
                                    {teacherData.degreeLinks.length > 1
                                      ? `#${index + 1}`
                                      : ""}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    Academic qualification
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => window.open(link, "_blank")}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Teaching Certificates Section */}
                  {teacherData.certificateLinks &&
                    teacherData.certificateLinks.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Certificates ({teacherData.certificateLinks.length})
                        </h4>
                        <div className="space-y-3">
                          {teacherData.certificateLinks.map((link, index) => (
                            <div
                              key={`cert-${index}`}
                              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <CustomIcon
                                    name="assignments"
                                    className="w-5 h-5 text-purple-600"
                                  />
                                </div>
                                <div>
                                  <span className="text-gray-900 text-sm font-medium block">
                                    Teaching Certificate{" "}
                                    {teacherData.certificateLinks.length > 1
                                      ? `#${index + 1}`
                                      : ""}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    Professional certification
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => window.open(link, "_blank")}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Empty State */}
                  {!teacherData.governmentId &&
                    (!teacherData.degreeLinks ||
                      teacherData.degreeLinks.length === 0) &&
                    (!teacherData.certificateLinks ||
                      teacherData.certificateLinks.length === 0) && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CustomIcon
                            name="assignments"
                            className="w-8 h-8 text-gray-400"
                          />
                        </div>
                        <h4 className="text-lg font-medium text-gray-600 mb-2">
                          No Documents Uploaded
                        </h4>
                        <p className="text-gray-500 text-sm">
                          The teacher hasn't uploaded any verification documents
                          yet.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                {teacherData.userId.verified === "verified" && (
                  <button
                    className="px-6 py-2.5 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors text-base font-medium"
                    onClick={() =>
                      handleVerification(teacherData._id, "reject")
                    }
                  >
                    Reject Teacher
                  </button>
                )}
                {teacherData.isVerified === false &&
                  (teacherData.userId.verified === "verified" ||
                    teacherData.userId.verified === "rejected") && (
                    <button
                      className="px-6 py-2.5 bg-bgprimary text-white rounded-md hover:bg-teal-600 transition-colors text-base font-medium"
                      onClick={() =>
                        handleVerification(teacherData._id, "accept")
                      }
                    >
                      Verify Teacher
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Details */}
        <div className="w-[30%] p-8 bg-white rounded-xl">
          <div className="max-w-md">
            <div className="space-y-8">
              {/* Email */}
              <div className="flex flex-row justify-between border-b border-[#DBDFE1] pb-2">
                <label className="block text-base font-medium text-[#8E97A4] mb-2">
                  Email
                </label>
                <div className="text-gray-900 text-base">
                  {teacherData.userId?.email || "N/A"}
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex flex-row justify-between border-b border-[#DBDFE1] pb-2">
                <label className="block text-base font-medium text-[#8E97A4] mb-2">
                  Mobile Number
                </label>
                <div className="text-gray-900 text-base">
                  {teacherData.userId.mobileNumber || "N/A"}
                </div>
              </div>
              {/* Teacher Status */}
              <div className="flex flex-row justify-between border-b border-[#DBDFE1] pb-2">
                <label className="block text-base font-medium text-[#8E97A4] mb-2">
                  Status
                </label>
                <div
                  className={
                    "text-base font-medium" +
                    (teacherData.isVerified
                      ? teacherData.userId.verified !== "completed"
                        ? " text-yellow-500"
                        : " text-green-500"
                      : " text-red-500")
                  }
                >
                  {teacherData.isVerified
                    ? teacherData.userId.verified !== "completed"
                      ? "Partially Accepted"
                      : "Completed"
                    : teacherData.userId.verified === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </div>
              </div>

              {/* Study Levels */}
              <div className="border-b border-[#DBDFE1] pb-2">
                <label className="block text-base font-medium text-[#8E97A4] mb-2">
                  Study Levels
                </label>
                <div className="text-gray-900 text-base">
                  {teacherData.userId.verified === "completed"
                    ? teacherData.finalizedClasses?.map((cls, index) => (
                        <div key={index} className="mb-3">
                          <div className="font-medium text-base">
                            {cls.level}
                          </div>
                          <div className="text-base text-gray-600 mt-1">
                            {cls.subjects?.map((subj, subIndex) => (
                              <div
                                className="flex justify-between px-4"
                                key={subIndex}
                              >
                                <div>{subj.subject}</div>
                                <div className="font-medium">${subj.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )) || <div>No study levels available</div>
                    : teacherData.classes?.map((cls, index) => (
                        <div key={index} className="mb-3">
                          <div className="font-medium text-base">
                            {cls.level}
                          </div>
                          <div className="text-base text-gray-600 mt-1">
                            {cls.subjects?.map((subj, subIndex) => (
                              <div
                                className="flex justify-between px-4"
                                key={subIndex}
                              >
                                <div>{subj.subject}</div>
                                <div className="font-medium">${subj.price}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )) || <div>No study levels available</div>}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-[#8E97A4] mb-4">
                  Availability
                </label>
                <div className="space-y-3">
                  {(() => {
                    const allDays = [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ];

                    return allDays.map((day) => {
                      const daySlot = teacherData.availability?.find(
                        (slot) => slot.day === day
                      );

                      return (
                        <div key={day}>
                          <div className="flex justify-between">
                            <span className="text-gray-900 text-sm font-medium w-20">
                              {day}
                            </span>
                            <div className="flex-1 text-right">
                              {daySlot && daySlot.times?.length > 0 ? (
                                <div className="space-y-1">
                                  {daySlot.times.map((timeSlot, timeIndex) => (
                                    <div key={timeIndex}>
                                      <span className="text-gray-900 text-sm">
                                        {formatTimeTo12Hour(timeSlot.startTime)}{" "}
                                        - {formatTimeTo12Hour(timeSlot.endTime)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-900 text-sm">
                                  Not Working
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {teacherData.isVerified &&
        teacherId &&
        teacherData.userId.verified !== "completed" && (
          <div className="ml-8">
            <PriceNegotiation teacherId={teacherId} />
          </div>
        )}
    </div>
  );
};

export default VerificationsTeacherDetail;
