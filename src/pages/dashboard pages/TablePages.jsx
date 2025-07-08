import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Search, CalendarDays, Plus, Trash, Edit, Eye } from "lucide-react"; // <-- Add icons
import DatePicker from "react-datepicker";
import ProfileView from "./ProfileView";
import ViewDetailsActor from "../../components/ViewDetailsActor";
import ViewDetails from '../../components/ViewDetails';
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../../services/auth.service";
import Modal from "../../components/Modal";

// Subject images mapping
const subjectImages = {
    "English": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=60&fit=crop&crop=center",
    "Mathematics": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=60&h=60&fit=crop&crop=center",
    "Science": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=60&h=60&fit=crop&crop=center",
    "History": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=60&h=60&fit=crop&crop=center",
    "Geography": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop&crop=center",
    "Physics": "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=60&h=60&fit=crop&crop=center",
    "Chemistry": "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=60&h=60&fit=crop&crop=center",
    "Biology": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop&crop=center"
};

// Enhanced Subject Cell Component
const SubjectCell = ({ subject, showImage = true }) => {
    const imageUrl = subjectImages[subject] || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=60&h=60&fit=crop&crop=center";

    return (
        <div className="flex items-center gap-3 py-1">
            {showImage && (
                <img
                    src={imageUrl}
                    alt={subject}
                    className="w-10  rounded-2xl object-cover border-2 border-gray-200"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40x40/f0f0f0/999999?text=" + (subject ? subject.charAt(0) : "?");
                    }}
                />
            )}
            <span className="font-medium text-gray-800">{subject}</span>
        </div>
    );
};

const TablePage = ({
    title,
    columns,
    data,
    createButtonLabel,
    subjectColumn = "subject",
    showSubjectImages = true
}) => {
    const [search, setSearch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedGeneric, setSelectedGeneric] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [editData, setEditData] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [resultModal, setResultModal] = useState({ isOpen: false, title: '', description: '', status: 'success' });
    const [showProfileView, setShowProfileView] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const rowsPerPage = 10;
    // Action handlers (customize as needed)
    const onCreateClick = (row) => {
        setEditData(row);
        setEditDialogOpen(true);
    }
    const handleEdit = (row) => {
        navigate(`/dashboard/teachers/${row.email}/${title}`);
    };
    const handleView = (row) => {
        if (title.toLowerCase().includes('assignment') || title.toLowerCase().includes('quiz')) {
            setSelectedItem({
                email: row.email || row.studentEmail || row.teacherEmail || row.assignedTo || row.student,
                type: title.toLowerCase().includes('quiz') ? 'quiz' : 'assignment',
                data: row
            });
            setShowDetails(true);
        } else if (title.toLowerCase().includes('class')) {
            setSelectedItem(row);
            setShowDetails(true);
        } else {
            setEditData(row);
            setShowProfileView(true);
        }
    };
    const handleBackaction = async () =>{
        setEditData(null);
        setShowProfileView(false);
    }
    const handleDelete = async (row) => {
        try {
            const response = await AuthService.deleteUser(row.email);
            console.log("Delete response:", response);
            setResultModal({
                isOpen: true,
                title: response.success ? 'Teacher Deleted' : 'Delete Failed',
                description: response.message || (response.success ? 'Teacher deleted successfully.' : 'Failed to delete teacher.'),
                status: response.success ? 'success' : 'error'
            });
            console.log("**calling fetchTeacher from handledelete true**")
            await fetchTeachers(currentPage);
        } catch (error) {
            console.error("Delete error:", error);
            setResultModal({
                isOpen: true,
                title: 'Delete Failed',
                description: error.message || 'Failed to delete teacher.',
                status: 'error'
            });
            console.log("**calling fetchTeacher from handledelete false**")
            await fetchTeachers(currentPage);
        }
    };
    const fetchTeachers = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const status = true
            console.log("**calling getUser from TablePages**")
            const response = await AuthService.getUser(status, rowsPerPage, page, title);

            if (response.success && response.users) {
                // Transform the API data to match our table structure
                const transformedData = response.users.map(user => ({
                    id: user._id,
                    date: new Date(user.joiningDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    name: user.name || "Unknown",
                    email: user.email,
                    bio: user.bio || "No bio provided",
                    govId: user.profilePicture ? "Profile Picture" : "Not provided",
                    degree: user.qualifications && user.qualifications.length > 0
                        ? `${user.qualifications.length} qualification(s)`
                        : "No qualifications",
                    profilePicture: user.profilePicture,
                    qualifications: user.qualifications || [],
                    verified: user.verified,
                    joiningDate: user.joiningDate
                }));

                setTeachers(transformedData);
                setTotalPages(response.totalPages || Math.ceil((response.total || 0) / rowsPerPage));
                setTotalTeachers(response.total || 0);
                console.log("Fetched teachers:", transformedData);
            } else {
                setError("Failed to fetch teachers data");
                setTeachers([]);
                setTotalPages(0);
                setTotalTeachers(0);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            setError(error.message || "Failed to fetch teachers");
            setTeachers([]);
            setTotalPages(0);
            setTotalTeachers(0);
        } finally {
            setLoading(false);
        }
    }, [title, rowsPerPage]);
    useEffect(() => {
        console.log("**calling fetchTeacher from useEffect**")
        fetchTeachers(currentPage);
    }, [title, currentPage, fetchTeachers]);

    // Reset to first page when title changes (route changes)
    useEffect(() => {
        setCurrentPage(1);
    }, [title]);

    // Enhanced columns with image support
    const enhancedColumns = useMemo(() => [
        ...columns.map(column => {
            const selectorString = typeof column.selector === 'string' ? column.selector : '';
            const nameString = typeof column.name === 'string' ? column.name : '';

            if (showSubjectImages && (
                column.selector === subjectColumn ||
                nameString.toLowerCase().includes('subject') ||
                selectorString.toLowerCase().includes('subject')
            )) {
                return {
                    ...column,
                    cell: (row) => (
                        <SubjectCell
                            subject={row[column.selector] || row.subject || row.name}
                            showImage={showSubjectImages}
                        />
                    ),
                    width: '200px'
                };
            }
            return column;
        }),
        {
            name: "Action",
            width: "150px",
            cell: (row) => (
                <div className="space-x-2 text-lg">
                    {title !== "Subjects" && (
                        <button
                            onClick={() => handleView(row)}
                            className="text-teal-700"
                            title="View"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-teal-700"
                        title="Edit"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                            setTeacherToDelete(row);
                            setIsDeleteModalOpen(true);
                        }}
                        title="Delete"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                    {/* Only show Eye button if title is NOT "Subjects" */}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ], [columns, showSubjectImages, subjectColumn, title]);

    // Filter data based on search and filters
    const filteredData = useMemo(() => teachers.filter(item => {
        const matchesSearch = search === "" ||
            Object.values(item).some(value =>
                value && value.toString().toLowerCase().includes(search.toLowerCase())
            );

        const matchesSubject = selectedSubject === "" ||
            item.subject === selectedSubject ||
            item[subjectColumn] === selectedSubject;

        const matchesGeneric = selectedGeneric === "" ||
            item.teacher === selectedGeneric ||
            item.student === selectedGeneric ||
            item.parent === selectedGeneric;

        // Add date filtering logic here if needed
        const matchesDateRange = (!startDate || !endDate) || 
            (new Date(item.joiningDate) >= startDate && new Date(item.joiningDate) <= endDate);

        return matchesSearch && matchesSubject && matchesGeneric && matchesDateRange;
    }), [teachers, search, selectedSubject, selectedGeneric, startDate, endDate, subjectColumn]);

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedItem(null);
    };

    return (
        <div className="p-6 mx-auto">
            {showDetails && (title.toLowerCase().includes('assignment') || title.toLowerCase().includes('quiz')) && selectedItem && (
                <ViewDetails
                    email={selectedItem.email}
                    type={selectedItem.type}
                    data={selectedItem.data}
                    handleBack={handleCloseDetails}
                />
            )}
            {showDetails && title.toLowerCase().includes('class') && selectedItem && (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Class Details</h2>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">{JSON.stringify(selectedItem, null, 2)}</pre>
                    <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg" onClick={handleCloseDetails}>Close</button>
                </div>
            )}
            {!showDetails && (showProfileView ? (
                <ViewDetailsActor email={editData.email} role={title} handleBack={handleBackaction}  />
            ) : (
            <div className="p-3">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-600">
                        {title}
                    </h1>

                    {/* Right-side controls */}
                    <div className="flex flex-wrap gap-4 items-center justify-end">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by subject"
                                className="pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-3xl outline-none w-full md:w-[400px] focus:ring-2 focus:ring-teal-500"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Subjects Dropdown */}
                        <select
                            className="border border-gray-300 rounded-3xl px-4 py-2 outline-none text-gray-600 focus:ring-2 focus:ring-teal-500"
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Subjects</option>
                            <option value="English">English</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="History">History</option>
                            <option value="Geography">Geography</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                        </select>

                        {/* Generic Dropdown */}
                        {title.toLowerCase() !== "subjects" && (
                            <select
                                className="border border-gray-300 rounded-3xl px-4 py-2 outline-none text-gray-600 focus:ring-2 focus:ring-teal-500"
                                value={selectedGeneric}
                                onChange={(e) => {
                                    setSelectedGeneric(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">
                                    {title.toLowerCase() === "students"
                                        ? "All Students"
                                        : title.toLowerCase() === "parents"
                                            ? "All Parents"
                                            : "All Teachers"}
                                </option>
                                <option value="English">English</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                            </select>
                        )}

                        {/* Date Range Picker */}
                        {!["teachers", "students", "parents"].includes(title.toLowerCase()) && (
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
                        )}

                        {/* Create Button */}
                        <button
                            className="flex items-center bg-teal-600 text-white font-semibold py-2 px-6 rounded-3xl hover:bg-teal-700 transition"
                            onClick={onCreateClick}
                        >
                            <Plus className="mr-2 w-5 h-5" />
                            Create {title}
                        </button>
                    </div>
                </div>


                {/* Data Table */}
               <DataTable
    columns={enhancedColumns}
    data={filteredData}
    responsive
    pagination={false}
    striped
    progressPending={loading}
    progressComponent={
        <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading teachers...</div>
        </div>
    }
    noDataComponent={
        <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">
                {error ? `Error: ${error}` : 'No teachers found'}
            </div>
        </div>
    }
    customStyles={{
        table: {
            style: {
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
            },
        },
        headCells: {
            style: {
                backgroundColor: "#f3f4f6",
                fontSize: "16px",
                fontWeight: "600",
            },
        },
        cells: {
            style: {
                fontSize: "15px",
                paddingTop: "16px",
                paddingBottom: "16px",
            },
        },
        rows: {
            style: {
                borderBottom: "1px solid #e5e7eb",
                minHeight: "60px",
            },
        },
    }}
/>
            </div>
            ))}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={`Delete ${title}`}
                description={`Are you sure you want to delete this ${title.toLowerCase().slice(0, -1)}? This action cannot be undone.`}
                buttonText="Delete"
                status="error"
                onConfirm={async () => {
                    if (teacherToDelete) {
                        await handleDelete(teacherToDelete);
                        setIsDeleteModalOpen(false);
                        setTeacherToDelete(null);
                    }
                }}
            />
            <Modal
                isOpen={resultModal.isOpen}
                onClose={() => setResultModal({ ...resultModal, isOpen: false })}
                title={resultModal.title}
                description={resultModal.description}
                buttonText="OK"
                status={resultModal.status}
            />
        </div>
    );
};

export default TablePage;