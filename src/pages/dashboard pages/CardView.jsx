import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight, CalendarDays, Search } from "lucide-react";
import StudyCard from "../../components/StudyCards";
import image from "../../assets/english.png";
import EditDialog from '../../components/EditDialog';
import AuthService from '../../services/auth.service';
import { useUser } from '../../context/UserContext';
import Modal from '../../components/Modal';
import ViewDetails from '../../components/ViewDetails';
import ViewDetailsActor from '../../components/ViewDetailsActor';

const sampleClasses = [
	{
		image: image,
		id: "123",
		subject: "English",
		student: "Steven Smith",
		title: "Building Better Sentences",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "123",
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Linear Equations Practice",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "456",
		subject: "Science",
		student: "Steven Smith",
		title: "Photosynthesis Worksheet",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "123",
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Geometry Basics Quiz",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "234",
		subject: "History",
		student: "Steven Smith",
		title: "World War II Timeline",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Friday, May 10, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "345",
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Algebra Review Sheet",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "123",
		subject: "English",
		student: "Steven Smith",
		title: "Building Better Sentences",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "123",
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Linear Equations Practice",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "456",
		subject: "Science",
		student: "Steven Smith",
		title: "Photosynthesis Worksheet",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Completed",
	},
	{
		image: image,
		id: "123",
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Geometry Basics Quiz",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "234",
		subject: "History",
		student: "Steven Smith",
		title: "World War II Timeline",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Friday, May 10, 2025",
		status: "Pending",
	},
	{
		image: image,
		id: "345",
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Algebra Review Sheet",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
	{
		image: image,
		subject: "Mathematics",
		student: "Steven Smith",
		title: "Algebra Review Sheet",
		assignedDate: "Wednesday, May 8, 2025",
		dueDate: "Thursday, May 9, 2025",
		status: "Pending",
	},
];

const ITEMS_PER_PAGE = 12;

const CardView = ({ title, data, userRole, activeTab, onTabChange }) => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [localActiveTab, setLocalActiveTab] = useState("pending");
	const [search, setSearch] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [tabLoading, setTabLoading] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalStatus, setModalStatus] = useState('success');
	const [modalMessage, setModalMessage] = useState('');
	const navigate = useNavigate();
	const { user } = useUser();
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [selectedActor, setSelectedActor] = useState(null);

	// Use activeTab prop if provided, otherwise use local state
	const currentActiveTab = activeTab || localActiveTab;

	// Determine which tabs to show based on userRole
	const isStudentView = userRole === 'student';
	const isTeacherView = userRole === 'teacher';
	const isClassesView = title?.toLowerCase() === 'classes';
	const isAssignmentOrQuiz = title?.toLowerCase().includes('assignment') || title?.toLowerCase().includes('quiz');

	// Fix: For assignments/quizzes, always use ['pending', 'completed'] tabs
	const tabOptions = isAssignmentOrQuiz
		? ["pending", "completed"]
		: isStudentView
			? ["your-teachers", "other-teachers"]
			: isTeacherView && title?.toLowerCase() === 'students'
				? ["your-students", "other-students"]
				: isClassesView
					? ["active"]
					: ["pending", "completed"];

	// Set default active tab based on userRole and assignment/quiz
	useEffect(() => {
		if (isAssignmentOrQuiz) {
			setLocalActiveTab("pending");
		} else if (isStudentView) {
			setLocalActiveTab("your-teachers");
		} else if (isTeacherView && title?.toLowerCase() === 'students') {
			setLocalActiveTab("your-students");
		} else if (isClassesView) {
			setLocalActiveTab("active");
		} else {
			setLocalActiveTab("pending");
		}
	}, [isAssignmentOrQuiz, isStudentView, isTeacherView, isClassesView, title]);

	// Handle tab change and call API if needed
	const handleTabChange = async (tab) => {
		setLocalActiveTab(tab);
		setCurrentPage(1); // Reset on filter
		
		// Call the onTabChange callback if provided (for API calls)
		if (onTabChange && typeof onTabChange === 'function') {
			setTabLoading(true);
			try {
				await onTabChange(tab);
			} finally {
				setTabLoading(false);
			}
		}
	};

	// Get the appropriate data based on active tab and userRole
	const getFilteredData = () => {
		if (isStudentView && data && typeof data === 'object' && data.yourTeachers && data.otherTeachers) {
			// Student view with separate teacher datasets
			const currentData = currentActiveTab === "your-teachers" ? data.yourTeachers : data.otherTeachers;
			return currentData.filter(item => 
				item.name?.toLowerCase().includes(search.toLowerCase()) ||
				item.email?.toLowerCase().includes(search.toLowerCase()) ||
				item.className?.toLowerCase().includes(search.toLowerCase())
			);
		} else if (isTeacherView && title?.toLowerCase() === 'students' && data && typeof data === 'object' && data.yourStudents && data.otherStudents) {
			// Teacher view with separate student datasets
			const currentData = currentActiveTab === "your-students" ? data.yourStudents : data.otherStudents;
			return currentData.filter(item => 
				item.name?.toLowerCase().includes(search.toLowerCase()) ||
				item.email?.toLowerCase().includes(search.toLowerCase()) ||
				item.className?.toLowerCase().includes(search.toLowerCase())
			);
		}
		// For assignments/quizzes, just return the array (optionally filter by heading/description if search is present)
		if (title?.toLowerCase().includes('assignment') || title?.toLowerCase().includes('quiz')) {
			const arr = Array.isArray(data) ? data : [];
			if (!search) return arr;
			return arr.filter(item =>
				(item.heading && item.heading.toLowerCase().includes(search.toLowerCase())) ||
				(item.description && item.description.toLowerCase().includes(search.toLowerCase()))
			);
		}
		// Regular view with status filtering for classes
		const regularData = Array.isArray(data) ? data : [];
		return regularData
			.filter(item =>
				item.subject?.toLowerCase().includes(search.toLowerCase()) &&
				(selectedSubject === "" || item.subject === selectedSubject)
			)
			.filter(item => {
				// For classes, only show active/completed
				if (title?.toLowerCase() === 'classes') {
					return item.status?.toLowerCase() === "active" || item.status?.toLowerCase() === "completed";
				}
				// For other items (assignments, quizzes), use the original logic
				return currentActiveTab === "pending"
					? item.status?.toLowerCase() === "pending"
					: item.status?.toLowerCase() === "completed";
			});
	};

	const filteredClasses = getFilteredData();
	console.log('CardView - filteredClasses:', filteredClasses);
	const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
	const paginatedData = filteredClasses.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handleNextPage = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	const handleViewSubmission = (item) => {
		// If this is a student or teacher card, show ViewDetailsActor
		let role = title;
		if (role.endsWith('s')) role = role.slice(0, -1);
		role = role.toLowerCase();
		if (isAssignmentOrQuiz) {
			setSelectedAssignment({
				email: item.email || item.studentEmail || item.teacherEmail || item.assignedTo || item.student, // fallback for email
				type: title.toLowerCase().includes('quiz') ? 'quiz' : 'assignment',
				data: item
			});
			setShowDetails(true);
		} else if (role === 'student' || role === 'teacher') {
			setSelectedActor({ email: item.email, role });
		} else {
			// fallback for other types (if needed)
		}
	};

	// Get tab display names
	const getTabDisplayName = (tab) => {
		if (isStudentView) {
			return tab === "your-teachers" ? "Your Teachers" : "Other Teachers";
		} else if (isTeacherView && title?.toLowerCase() === 'students') {
			return tab === "your-students" ? "Your Students" : "Other Students";
		} else if (title?.toLowerCase() === 'classes') {
			return "Classes";
		} else {
			return tab === "pending" ? "Pending Assignments" : "Completed Assignments";
		}
	};

	// Connect handler for students
	const handleConnect = async (teacher) => {
		if (!user?.email || !teacher?.email) {
			setModalStatus('error');
			setModalMessage('Missing student or teacher email');
			setModalOpen(true);
			return;
		}
		try {
			await AuthService.connectStudentToTeacher(user.email, teacher.email);
			setModalStatus('success');
			setModalMessage('Connection request sent!');
			setModalOpen(true);
		} catch (err) {
			setModalStatus('error');
			setModalMessage(err?.message || 'Failed to connect');
			setModalOpen(true);
		}
	};

	const isTeacherOrAdmin = user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'admin';
	const [createClassError, setCreateClassError] = useState('');

	const handleCardClick = (cardData) => {
		if (cardData.email) {
			// Convert title to singular and lowercase for role
			let role = title;
			if (role.endsWith('s')) role = role.slice(0, -1);
			role = role.toLowerCase();
			setSelectedActor({ email: cardData.email, role });
		}
	};

	const handleCloseDetails = () => {
		setShowDetails(false);
		setSelectedTeacher(null);
	};

	// Determine the mode for EditDialog based on title
	const getEditDialogMode = () => {
		const detectedMode = title?.toLowerCase().includes('assignment') ? 'create-assignment' :
			title?.toLowerCase().includes('quiz') ? 'create-quiz' :
			title?.toLowerCase().includes('class') ? 'create-class' : 'create-class';
		
		console.log('🎯 [CardView] Title:', title, 'Detected mode:', detectedMode);
		return detectedMode;
	};

	console.log("Assignments data:", data, "Paginated:", paginatedData, "Current tab:", currentActiveTab);

	if (selectedActor) {
		return (
			<ViewDetailsActor
				email={selectedActor.email}
				role={selectedActor.role}
				handleBack={() => setSelectedActor(null)}
			/>
		);
	}

	if (showDetails && selectedAssignment) {
		return (
			<ViewDetails
				email={selectedAssignment.email}
				type={selectedAssignment.type}
				data={selectedAssignment.data}
				handleBack={() => {
					setShowDetails(false);
					setSelectedAssignment(null);
				}}
			/>
		);
	}

	return (
		<div>
			<h1 className="text-4xl font-semibold my-6 mx-auto text-gray-600">
				{title}
			</h1>
			<div className="flex flex-wrap gap-4  justify-between mx-auto items-center mb-9">
				<div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
					<div className="flex bg-white items-center border gap-3 p-2 border-2 border-gray-200 rounded-3xl w-full md:w-[400px]">
						<Search className="text-teal-600 flex-shrink-0" />
						<input
							type="text"
							placeholder={isStudentView ? "Search by name, email, or class" : "Search by subject"}
							className="bg-white outline-none w-full"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{!isStudentView && (
						<select
							className="border border-gray-300 rounded-3xl px-4 py-2 text-gray-600"
							value={selectedSubject}
							onChange={(e) => {
								setSelectedSubject(e.target.value);
								setCurrentPage(1); // Reset on filter
							}}
						>
							<option value="">All Subjects</option>
							<option value="English">English</option>
							<option value="Mathematics">Mathematics</option>
							<option value="Science">Science</option>
							<option value="History">History</option>
						</select>
					)}
					<div className="flex items-center border border-gray-300 rounded-3xl px-2 py-2 bg-white hover:bg-teal-50 transition w-52">
						<CalendarDays className="flex-shrink-0 text-teal-600 mr-2" />
						<DatePicker
							selectsRange
							startDate={startDate}
							endDate={endDate}
							onChange={(dates) => {
								const [start, end] = dates;
								setStartDate(start);
								setEndDate(end);
								setCurrentPage(1);
							}}
							isClearable
							placeholderText="Select Date Range"
							className="outline-none bg-transparent cursor-pointer text-teal-700 font-semibold"
						/>
					</div>
					{isTeacherOrAdmin && (
						<button
							onClick={() => {
								console.log('🎯 [CardView] Create button clicked for title:', title);
								console.log('🎯 [CardView] User role:', user?.role);
								console.log('🎯 [CardView] Detected mode:', getEditDialogMode());
								setEditDialogOpen(true);
								setCreateClassError('');
							}}
							className="bg-teal-600 text-white font-semibold py-2 px-8 rounded-3xl hover:bg-teal-700 transition"
						>
							+ Create {title?.toLowerCase().includes('assignment') ? 'Assignment' : 
								title?.toLowerCase().includes('quiz') ? 'Quiz' : 
								title?.toLowerCase().includes('class') ? 'Class' : title}
						</button>
					)}
				</div>
			</div>

			{createClassError && (
				<div className="text-red-600 text-sm mt-2">{createClassError}</div>
			)}

			<div className="bg-white rounded-2xl mx-auto px-6 py-8 my-6 mx-auto">
				{/* Tabs - Only show for non-classes views */}
				{!isClassesView && (
					<div className="flex border-b border-gray-200 mb-6">
						{tabOptions.map((tab) => (
							<button
								key={tab}
								onClick={() => handleTabChange(tab)}
								className={`w-1/2 py-3 text-center font-bold transition ${currentActiveTab === tab
									? "border-b-4 border-teal-600 text-teal-600"
									: "text-gray-500 hover:text-teal-600"
									}`}
							>
								{getTabDisplayName(tab)}
							</button>
						))}
					</div>
				)}

				{/* Cards Grid */}
				{tabLoading ? (
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
							<p className="text-gray-600">Loading {getTabDisplayName(currentActiveTab).toLowerCase()}...</p>
						</div>
					</div>
				) : (
					<div className="flex gap-6 justify-evenly flex-wrap">
						{console.log('CardView - data paginated:', paginatedData, 'userRole:', userRole)}
						{paginatedData.map((cls, idx) => {
							const connectProps = (isStudentView && currentActiveTab === 'other-teachers')
								? { onConnect: () => handleConnect(cls) }
								: {};

							// Determine role for navigation
							let role = undefined;
							if (isStudentView && (currentActiveTab === "your-teachers" || currentActiveTab === "other-teachers")) {
								role = "teacher";
							} else if (isTeacherView && title?.toLowerCase() === "students") {
								role = "student";
							}

							return (
								<StudyCard
									key={idx}
									{...cls}
									{...(role ? { role } : {})}
									activeTab={currentActiveTab}
									userRole={userRole}
									onViewSubmission={() => handleViewSubmission(cls)}
									{...connectProps}
									onCardClick={handleCardClick}
								/>
							);
						})}
					</div>
				)}

				{/* Pagination */}
				{!tabLoading && totalPages > 1 && (
					<div className="flex justify-center mt-8 items-center gap-2">
						<button
							onClick={handlePrevPage}
							disabled={currentPage === 1}
							className={`p-2 rounded-full ${currentPage === 1
								? "text-gray-300"
								: "text-teal-600 hover:bg-teal-50"
								}`}
						>
							<ChevronLeft />
						</button>

						{[...Array(totalPages)].map((_, index) => {
							const page = index + 1;
							const isActive = page === currentPage;
							return (
								<button
									key={page}
									onClick={() => setCurrentPage(page)}
									className={`w-9 h-9 rounded-full font-semibold text-sm transition ${isActive
										? "bg-teal-600 text-white"
										: "text-teal-600 hover:bg-teal-100"
										}`}
								>
									{page}
								</button>
							);
						})}

						<button
							onClick={handleNextPage}
							disabled={currentPage === totalPages}
							className={`p-2 rounded-full ${currentPage === totalPages
								? "text-gray-300"
								: "text-teal-600 hover:bg-teal-50"
								}`}
						>
							<ChevronRight />
						</button>
					</div>
				)}
			</div>

			{/* EditDialog for Create Class */}
			<EditDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} mode={getEditDialogMode()} />

			<Modal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title={modalStatus === 'success' ? 'Success' : 'Error'}
				description={modalMessage}
				status={modalStatus}
			/>
		</div>
	);
};

export default CardView;
