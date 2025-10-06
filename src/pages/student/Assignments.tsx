import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import { formatDate } from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CustomIcon from "@/components/CustomIcon";
import AssignmentCard, {
  AssignmentCardData,
} from "@/components/AssignmentCard";
import { studentService } from "@/services/student.service";

const ITEMS_PER_PAGE = 12;

const Assignments = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allAssignments, setAllAssignments] = useState<AssignmentCardData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await studentService.getAssignments();
        if (response && response.data) {
          setAllAssignments(
            response.data.map((assignment) => ({
              assignmentId: assignment.assignmentId,
              subject: assignment.subject.replace(/^\w/, (c) =>
                c.toUpperCase()
              ),
              title: assignment.title,
              student: assignment.teacherName,
              dueDate: formatDate(assignment.dueDate),
              createdAt: formatDate(assignment.createdAt),
              status: assignment.isCompleted
                ? "Completed"
                : assignment.isSubmitted
                ? "Marking Pending"
                : "Submission Pending",
              onClick: () =>
                navigate(`/student/assignments/${assignment.assignmentId}`),
              isTeacher: true,
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
  }, [refreshFlag]);

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

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader
        title='Assignments'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      ></TeacherCustomHeader>

      <div className='bg-white rounded-2xl p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4 px-10 pb-6'>
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
    </div>
  );
};

export default Assignments;
