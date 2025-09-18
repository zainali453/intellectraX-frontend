import StudentCard from "@/components/StudentCard";
import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import { Student, teacherService } from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const Students = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getStudents();
        if (response && response.data) {
          setAllStudents(response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students based on search (searches across ALL data, not just current page)
  const filteredStudents = useMemo(() => {
    if (searchValue.trim() === "") {
      return allStudents;
    }
    return allStudents.filter(
      (student) =>
        student?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        student?.subject?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allStudents, searchValue]);

  // Calculate pagination values
  const totalStudents = filteredStudents.length;
  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

  // Get current page data (12 items per page)
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

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
        title='Students'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      />

      <div className='bg-white p-6 rounded-2xl'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
          {loading && (
            <div className='flex justify-center items-center col-span-full py-12 h-80'>
              <LoadingSpinner size='lg' />
            </div>
          )}
          {!loading &&
            currentStudents.map((student, index) => (
              <StudentCard
                key={index}
                student={student}
                onClick={() =>
                  navigate(
                    "/teacher/students/" +
                      student.studentId +
                      "?subject=" +
                      student.subject
                  )
                }
                onSendMessage={() =>
                  console.log("Send message to:", student.studentId)
                }
              />
            ))}
        </div>

        {filteredStudents.length === 0 && !loading && (
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
                ? `No students found matching "${searchValue}"`
                : "No students assigned yet"}
            </p>
            <p className='text-gray-400 text-sm'>
              {searchValue
                ? "Try searching with different keywords"
                : "Students will appear here once they are assigned to you."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination - only show if there are students and more than one page */}
      {!loading && filteredStudents.length > 0 && totalPages > 1 && (
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

export default Students;
