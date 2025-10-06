import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import {
  teacherService,
  formatDate,
  AssignmentData,
  AssignmentDataForCards,
} from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CustomIcon from "@/components/CustomIcon";
import SuccessModal from "@/components/SuccessModal";
import EditAssignmentModal from "@/components/EditAssignmentModal";
import AssignmentCard, {
  AssignmentCardData,
} from "@/components/AssignmentCard";

const ITEMS_PER_PAGE = 12;

const tabs = [
  { id: "pending", label: "Pending Assignments" },
  { id: "completed", label: "Completed Assignments" },
];

const Assignments = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allAssignments, setAllAssignments] = useState<AssignmentCardData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAssignment = async (classData: AssignmentData) => {
    try {
      setUpdating(true);
      const response = await teacherService.createAssignment(classData);
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
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getAssignments(activeTab);
        if (response && response.data) {
          setAllAssignments(
            response.data.map((assignment: AssignmentDataForCards) => ({
              assignmentId: assignment.assignmentId,
              subject: assignment.subject.replace(/^\w/, (c) =>
                c.toUpperCase()
              ),
              title: assignment.title,
              student: assignment.studentName,
              dueDate: formatDate(assignment.dueDate),
              createdAt: formatDate(assignment.createdAt),
              status: assignment.isCompleted
                ? "Completed"
                : assignment.isSubmitted
                ? "Marking Pending"
                : "Submission Pending",
              onClick: () =>
                navigate(`/teacher/assignments/${assignment.assignmentId}`),
            }))
          );
        } else {
          setAllAssignments([]);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [refreshFlag, activeTab]);

  // Filter students based on search (searches across ALL data, not just current page)
  const filteredAssignments = useMemo(() => {
    if (searchValue.trim() === "") {
      return allAssignments;
    }
    return allAssignments.filter(
      (assignmentData) =>
        assignmentData?.subject
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        assignmentData?.student
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
    );
  }, [allAssignments, searchValue]);

  // Calculate pagination values
  const totalAssignments = filteredAssignments.length;
  const totalPages = Math.ceil(totalAssignments / ITEMS_PER_PAGE);

  // Get current page data (12 items per page)
  const currentAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAssignments.slice(startIndex, endIndex);
  }, [filteredAssignments, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader
        title='Assignments'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      >
        <button
          onClick={openCreateModal}
          className='bg-bgprimary text-white text-sm px-4 py-2 rounded-full hover:bg-teal-600 transition flex flex-row items-center'
        >
          <CustomIcon name='add' className='w-[12px] h-[12px] mr-2' />
          Create Assignment
        </button>
      </TeacherCustomHeader>

      <div className='bg-white rounded-2xl'>
        <div>
          <nav className='mb-6 flex flex-row justify-between items-center px-4'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 cursor-pointer py-4 px-1 border-b-3 font-medium text-base transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-bgprimary text-bgprimary"
                    : "border-[#E3E3E8] text-gray-400 hover:text-bgprimary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 px-10'>
          {loading && (
            <div className='flex justify-center items-center col-span-full py-12 h-80'>
              <LoadingSpinner size='lg' />
            </div>
          )}

          {!loading &&
            currentAssignments &&
            currentAssignments.length > 0 &&
            currentAssignments.map((assignmentData) => (
              <AssignmentCard
                key={assignmentData.assignmentId}
                data={assignmentData}
              />
            ))}
        </div>

        {filteredAssignments.length === 0 && !loading && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <CustomIcon
                name='assignmentsActive'
                className='w-13 h-15 mx-auto'
              />
            </div>
            <p className='text-gray-500 text-lg font-medium mb-2'>
              {searchValue
                ? `No assignments found matching "${searchValue}"`
                : "No assignments created yet"}
            </p>
            <p className='text-gray-400 text-sm'>
              {searchValue
                ? "Try searching with different keywords"
                : "Assignments will appear here once they are created."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination - only show if there are students and more than one page */}
      {!loading && filteredAssignments.length > 0 && totalPages > 1 && (
        <div className='mt-6'>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Create/Edit Assignment Modal */}
      {isModalOpen && (
        <EditAssignmentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveAssignment}
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

export default Assignments;
