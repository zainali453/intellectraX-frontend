import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import {
  calculateTimeLimit,
  formatDate,
  getTimeString,
} from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CustomIcon from "@/components/CustomIcon";
import QuizCard, { QuizCardData } from "@/components/QuizCard";
import { studentService } from "@/services/student.service";

const ITEMS_PER_PAGE = 12;

const Quizzes = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allQuizzes, setAllQuizzes] = useState<QuizCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await studentService.getQuizzes();
        if (response && response.data) {
          setAllQuizzes(
            response.data.map((quiz) => ({
              quizId: quiz.quizId,
              subject: quiz.subject.replace(/^\w/, (c) => c.toUpperCase()),
              title: quiz.title,
              student: quiz.teacherName,
              dueDate: formatDate(quiz.dueDate),
              timeLimit: calculateTimeLimit(
                getTimeString(new Date(quiz.startTime)),
                getTimeString(new Date(quiz.endTime))
              ),
              status: quiz.isCompleted
                ? "Completed"
                : quiz.isSubmitted
                ? "Marking Pending"
                : new Date() > new Date(quiz.endTime)
                ? "Overdue"
                : "Submission Pending",
              onClick: () => navigate(`/student/quizzes/${quiz.quizId}`),
              isTeacher: true,
            }))
          );
        } else {
          setAllQuizzes([]);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [refreshFlag]);

  // Filter students based on search (searches across ALL data, not just current page)
  const filteredQuizzes = useMemo(() => {
    if (searchValue.trim() === "") {
      return allQuizzes;
    }
    return allQuizzes.filter(
      (quizData) =>
        quizData?.subject?.toLowerCase().includes(searchValue.toLowerCase()) ||
        quizData?.student?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allQuizzes, searchValue]);

  // Calculate pagination values
  const totalQuizzes = filteredQuizzes.length;
  const totalPages = Math.ceil(totalQuizzes / ITEMS_PER_PAGE);

  // Get current page data (12 items per page)
  const currentQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredQuizzes.slice(startIndex, endIndex);
  }, [filteredQuizzes, currentPage]);

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
        title='Quizzes'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      ></TeacherCustomHeader>

      <div className='bg-white rounded-2xl p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-20'>
          {loading && (
            <div className='flex justify-center items-center col-span-full py-12 h-80'>
              <LoadingSpinner size='lg' />
            </div>
          )}

          {!loading &&
            currentQuizzes &&
            currentQuizzes.length > 0 &&
            currentQuizzes.map((quizData) => (
              <QuizCard key={quizData.quizId} data={quizData} />
            ))}
        </div>

        {filteredQuizzes.length === 0 && !loading && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <CustomIcon
                name='assignmentsActive'
                className='w-13 h-15 mx-auto'
              />
            </div>
            <p className='text-gray-500 text-lg font-medium mb-2'>
              {searchValue
                ? `No quizzes found matching "${searchValue}"`
                : "No quizzes created yet"}
            </p>
            <p className='text-gray-400 text-sm'>
              {searchValue
                ? "Try searching with different keywords"
                : "Quizzes will appear here once they are created."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination - only show if there are students and more than one page */}
      {!loading && filteredQuizzes.length > 0 && totalPages > 1 && (
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

export default Quizzes;
