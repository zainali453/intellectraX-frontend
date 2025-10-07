import TeacherCustomHeader from "@/components/TeacherCustomHeader";
import { useEffect, useState, useMemo } from "react";
import CustomPagination from "@/components/CustomPagination";
import {
  teacherService,
  formatDate,
  QuizData,
  QuizDataForCards,
  getTimeString,
  calculateTimeLimit,
} from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CustomIcon from "@/components/CustomIcon";
import SuccessModal from "@/components/SuccessModal";
import EditQuizModal from "@/components/EditQuizModal";
import QuizCard, { QuizCardData } from "@/components/QuizCard";

const ITEMS_PER_PAGE = 12;

const tabs = [
  { id: "pending", label: "Pending Quizzes" },
  { id: "completed", label: "Completed Quizzes" },
];

const Quizzes = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [allQuizzes, setAllQuizzes] = useState<QuizCardData[]>([]);
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

  const handleSaveQuiz = async (quizData: QuizData) => {
    try {
      setUpdating(true);
      const response = await teacherService.createQuiz(quizData);
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
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getQuizzes(activeTab);
        if (response && response.data) {
          setAllQuizzes(
            response.data.map((quiz: QuizDataForCards) => ({
              quizId: quiz.quizId,
              subject: quiz.subject.replace(/^\w/, (c) => c.toUpperCase()),
              title: quiz.title,
              student: quiz.studentName,
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
              onClick: () => navigate(`/teacher/quizzes/${quiz.quizId}`),
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
  }, [refreshFlag, activeTab]);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className='px-8 py-6'>
      <TeacherCustomHeader
        title='Quizzes'
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      >
        <button
          onClick={openCreateModal}
          className='bg-bgprimary text-white text-sm px-4 py-2 rounded-full hover:bg-teal-600 transition flex flex-row items-center'
        >
          <CustomIcon name='add' className='w-[12px] h-[12px] mr-2' />
          Create Quiz
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
        <div className={`flex gap-2 flex-wrap pb-2 pl-2 ${loading ? " justify-center" : ""}`}>
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

      {/* Create/Edit Quiz Modal */}
      {isModalOpen && (
        <EditQuizModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveQuiz}
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

export default Quizzes;
