import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import {
  formatDate,
  formatDisplayTime,
  getOriginalDateUTC,
  getOriginalTimeUTC,
} from "@/services/teacher.service";
import { studentService } from "@/services/student.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ClassCard, { ClassData as ClassCardsData } from "@/components/ClassCard";
import ConfirmClassEnrollmentModal from "@/components/ConfirmClassEnrollmentModal";

const ITEMS_PER_PAGE = 12;

const Classes = () => {
  const [upcomingClasses, setUpcomingClasses] = useState(true);

  if (upcomingClasses) {
    return <UpcomingClasses setUpcomingClasses={setUpcomingClasses} />;
  } else {
    return <ClassRequests setUpcomingClasses={setUpcomingClasses} />;
  }
};

const UpcomingClasses = ({ setUpcomingClasses }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allClasses, setAllClasses] = useState<ClassCardsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [classRequests, setClassRequests] = useState(0);
  const [meetingWindows, setMeetingWindows] = useState<
    Map<string, Window | null>
  >(new Map());

  const handleJoinClass = (
    classId: string,
    utcStartTime: Date,
    utcEndTime: Date
  ) => {
    if (!classId) return;

    const isClassOver = utcEndTime <= new Date();
    const isClassStarted = utcStartTime <= new Date();

    if (!isClassStarted) {
      alert("Class has not started yet");
      return;
    } else if (isClassOver) {
      alert("Class has ended");
      return;
    }
    const existingWindow = meetingWindows.get(classId);

    // Check if window exists and is not closed
    if (existingWindow && !existingWindow.closed) {
      // Focus on existing window instead of opening new one
      existingWindow.focus();
      return;
    }

    // Open new window
    const newWindow = window.open(
      `/student/meeting/${classId}`,
      `meeting-${classId}` // Named window - same name will reuse the window
    );

    // Store reference
    if (newWindow) {
      setMeetingWindows((prev) => new Map(prev).set(classId, newWindow));
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await studentService.getStudentClasses();
        if (response && response.data) {
          setAllClasses(
            response.data.classes.map((item) => {
              const utcStartTime = getOriginalDateUTC(
                item.date,
                item.timeSlot.startTime
              );
              const utcEndTime = getOriginalDateUTC(
                item.date,
                item.timeSlot.endTime
              );
              return {
                id: item.classId,
                student: item.teacherName,
                subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
                date: formatDate(utcStartTime),
                time: `${formatDisplayTime(
                  getOriginalTimeUTC(utcStartTime)
                )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
                onJoinClass: () =>
                  handleJoinClass(item.classId, utcStartTime, utcEndTime),
                onClick: () => navigate(`/student/classes/${item.classId}`),
                isTeacher: true,
              };
            })
          );
          setClassRequests(response.data.classRequests);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Filter students based on search (searches across ALL data, not just current page)
  const filteredClasses = useMemo(() => {
    if (searchValue.trim() === "") {
      return allClasses;
    }
    return allClasses.filter(
      (classData) =>
        classData?.subject?.toLowerCase().includes(searchValue.toLowerCase()) ||
        classData?.student?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allClasses, searchValue]);

  // Calculate pagination values
  const totalClasses = filteredClasses.length;
  const totalPages = Math.ceil(totalClasses / ITEMS_PER_PAGE);

  // Get current page data (12 items per page)
  const currentClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader
        title='Classes'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      ></TeacherCustomHeader>

      <div className='bg-white px-6 py-2 rounded-2xl'>
        <div className='flex justify-between items-center col-span-full'>
          <div>
            <h2 className='text-2xl text-textprimary font-semibold mb-1'>
              Upcoming Classes
            </h2>
          </div>
          <button
            onClick={() => {
              setUpcomingClasses(false);
            }}
            disabled={classRequests === 0}
            className='mb-4 px-8 py-[6px] text-bgprimary hover:bg-gray-50 rounded-full border border-[#EAEAEA] disabled:opacity-70 disabled:cursor-not-allowed'
          >
            Class Requests{" "}
            {loading === false && (
              <span className='font-medium'>{classRequests}</span>
            )}
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
          {loading && (
            <div className='flex justify-center items-center col-span-full py-12 h-80'>
              <LoadingSpinner size='lg' />
            </div>
          )}

          {!loading &&
            currentClasses &&
            currentClasses.length > 0 &&
            currentClasses.map((classData) => (
              <ClassCard key={classData.id} data={classData} />
            ))}
        </div>

        {filteredClasses.length === 0 && !loading && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg
                className='w-16 h-16 mx-auto'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
              </svg>
            </div>
            <p className='text-gray-500 text-lg font-medium mb-2'>
              {searchValue
                ? `No class found matching "${searchValue}"`
                : "No Upcoming Classes Yet"}
            </p>
            <p className='text-gray-400 text-sm'>
              {searchValue
                ? "Try searching with different keywords"
                : "Classes will appear here once they are created."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination - only show if there are students and more than one page */}
      {!loading && filteredClasses.length > 0 && totalPages > 1 && (
        <div className='mt-6'>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

const ClassRequests = ({ setUpcomingClasses }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allClassRequests, setAllClassRequests] = useState<ClassCardsData[]>(
    []
  );
  const [update, setUpdate] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [classId, setClassId] = useState("");
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [classDetails, setClassDetails] = useState<ClassCardsData | null>(null);

  const classAcceptence = async (classId: string, accepted: boolean) => {
    try {
      setLoading(true);
      await studentService.setStudentClassAcceptance(classId, accepted);
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Error accepting/rejecting class:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchClassRequests = async () => {
      try {
        setLoading(true);
        const [response, dashboardResponse] = await Promise.all([
          studentService.getStudentClassRequests(),
          studentService.getDashboardData(),
        ]);
        if (response && response.data) {
          setAllClassRequests(
            response.data.map((item) => {
              const utcStartTime = getOriginalDateUTC(
                item.date,
                item.timeSlot.startTime
              );
              const utcEndTime = getOriginalDateUTC(
                item.date,
                item.timeSlot.endTime
              );

              return {
                id: item.classId,
                student: item.teacherName,
                subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
                date: formatDate(utcStartTime),
                time: `${formatDisplayTime(
                  getOriginalTimeUTC(utcStartTime)
                )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
                onAcceptence: (accepted) => {
                  if (accepted) handleShowConfirmModal(item.classId);
                  else classAcceptence(item.classId, false);
                },
                onClick: () => navigate(`/student/classes/${item.classId}`),
                isTeacher: true,
              };
            })
          );
        } else {
          setAllClassRequests([]);
        }

        if (dashboardResponse && dashboardResponse.data) {
          setAvailableCredits(dashboardResponse.data.remainingCredits);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassRequests();
  }, [update]);

  const handleShowConfirmModal = (classId: string) => {
    setClassId(classId);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmEnrollment = async () => {
    if (!classId) return;
    try {
      setEnrollmentLoading(true);
      await studentService.setStudentClassAcceptance(classId, true);
      // Update available credits locally after successful enrollment
      setAvailableCredits((prev) => prev - 1);
      setShowConfirmModal(false);
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Error accepting class invitation:", error);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Filter students based on search (searches across ALL data, not just current page)
  const filteredClasses = useMemo(() => {
    if (searchValue.trim() === "") {
      return allClassRequests;
    }
    return allClassRequests.filter(
      (classData) =>
        classData?.subject?.toLowerCase().includes(searchValue.toLowerCase()) ||
        classData?.student?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allClassRequests, searchValue]);

  // Calculate pagination values
  const totalClasses = filteredClasses.length;
  const totalPages = Math.ceil(totalClasses / ITEMS_PER_PAGE);

  // Get current page data (12 items per page)
  const currentClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader
        title='Classes'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      ></TeacherCustomHeader>
      <div className='bg-white px-6 py-2 rounded-2xl'>
        <div className='flex justify-between items-center col-span-full'>
          <div>
            <h2 className='text-2xl text-textprimary font-semibold mb-1'>
              Class Requests
            </h2>
          </div>
          <button
            onClick={() => {
              setUpcomingClasses(true);
            }}
            className='mb-4 px-8 py-[6px] text-bgprimary hover:bg-gray-50 rounded-full border border-[#EAEAEA]'
          >
            Upcoming Classes
          </button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
          {loading && (
            <div className='flex justify-center items-center col-span-full py-12 h-80'>
              <LoadingSpinner size='lg' />
            </div>
          )}

          {!loading &&
            currentClasses &&
            currentClasses.length > 0 &&
            currentClasses.map((classData) => (
              <ClassCard key={classData.id} data={classData} />
            ))}
        </div>

        {filteredClasses.length === 0 && !loading && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg
                className='w-16 h-16 mx-auto'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
              </svg>
            </div>
            <p className='text-gray-500 text-lg font-medium mb-2'>
              {searchValue
                ? `No class found matching "${searchValue}"`
                : "No Class Requests Yet"}
            </p>
            <p className='text-gray-400 text-sm'>
              {searchValue
                ? "Try searching with different keywords"
                : "Classes will appear here once they are created."}
            </p>
          </div>
        )}
      </div>
      {/* Pagination - only show if there are students and more than one page */}
      {!loading && filteredClasses.length > 0 && totalPages > 1 && (
        <div className='mt-6'>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmClassEnrollmentModal
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmEnrollment}
        availableCredits={availableCredits}
        classDetails={(() => {
          const found = allClassRequests.find((c) => c.id === classId);
          if (found) {
            return {
              subject: found.subject || "",
              teacher: found.student || "",
              date: found.date || "",
              time: found.time || "",
            };
          }
          return {
            subject: "",
            teacher: "",
            date: "",
            time: "",
          };
        })()}
        loading={enrollmentLoading}
      />
    </div>
  );
};

export default Classes;
