import StudentCard from "@/components/StudentCard";
import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import EditClassModal from "@/components/EditClassModal";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import {
  ClassData,
  teacherService,
  formatDate,
  formatDisplayTime,
  getOriginalDateUTC,
  getOriginalTimeUTC,
} from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CustomIcon from "@/components/CustomIcon";
import ClassCard, { ClassData as ClassCardsData } from "@/components/ClassCard";
import SuccessModal from "@/components/SuccessModal";

const ITEMS_PER_PAGE = 12;

const Classes = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allClasses, setAllClasses] = useState<ClassCardsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveClass = async (classData: ClassData) => {
    try {
      setUpdating(true);
      const response = await teacherService.createClass(classData);
      if (response && response.success) {
        closeModal();
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert(error);
    } finally {
      setUpdating(false);
      setRefreshFlag((prev) => !prev);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getTeacherClasses();
        if (response && response.data) {
          setAllClasses(
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
                student: item.studentName,
                subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
                date: formatDate(utcStartTime),
                time: `${formatDisplayTime(
                  getOriginalTimeUTC(utcStartTime)
                )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
                onJoinClass: () => console.log("Join class", item.classId),
                onClick: () => navigate(`/teacher/classes/${item.classId}`),
                status: item.acceptedByStudent ? "Accepted" : "Pending",
              };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [refreshFlag]);

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
        title='Upcoming Classes'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      >
        <button
          onClick={openCreateModal}
          className='bg-bgprimary text-white text-sm px-4 py-2 rounded-full hover:bg-teal-600 transition flex flex-row items-center'
        >
          <CustomIcon name='add' className='w-[12px] h-[12px] mr-2' />
          Create Class
        </button>
      </TeacherCustomHeader>

      <div className='bg-white p-6 rounded-2xl'>
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
                : "No classes created yet"}
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

      {/* Create/Edit Class Modal */}
      {isModalOpen && (
        <EditClassModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveClass}
          mode='create'
          loading={updating}
        />
      )}
      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title='Successfully Created!'
        />
      )}
    </div>
  );
};

export default Classes;
