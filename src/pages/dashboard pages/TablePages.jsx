import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Search, CalendarDays, Plus, Trash, Edit, Eye } from "lucide-react"; // <-- Add icons
import DatePicker from "react-datepicker";
import ViewDetailsActor from "../../components/ViewDetailsActor";
import ViewDetails from "../../components/ViewDetails";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../../services/auth.service";
import Modal from "../../components/Modal";

// Subject images mapping
const subjectImages = {
  English:
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=60&fit=crop&crop=center",
  Mathematics:
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=60&h=60&fit=crop&crop=center",
  Science:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=60&h=60&fit=crop&crop=center",
  History:
    "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=60&h=60&fit=crop&crop=center",
  Geography:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop&crop=center",
  Physics:
    "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=60&h=60&fit=crop&crop=center",
  Chemistry:
    "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=60&h=60&fit=crop&crop=center",
  Biology:
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=60&h=60&fit=crop&crop=center",
};

// Enhanced Subject Cell Component
const SubjectCell = ({ subject, showImage = true }) => {
  const imageUrl =
    subjectImages[subject] ||
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=60&h=60&fit=crop&crop=center";

  return (
    <div className="flex items-center gap-3 py-1">
      {showImage && (
        <img
          src={imageUrl}
          alt={subject}
          className="w-10  rounded-2xl object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/40x40/f0f0f0/999999?text=" +
              (subject ? subject.charAt(0) : "?");
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
  showSubjectImages = true,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  // Generate dummy data based on the title
  const generateDummyData = () => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("teacher")) {
      return [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@example.com",
          bio: "Experienced mathematics teacher with 15+ years of teaching experience. Specializes in algebra and calculus for high school students.",
          degree: "PhD in Mathematics",
          verified: "verified",
          date: "January 15, 2024, 10:30 AM",
          joiningDate: "2024-01-15",
          profilePicture:
            "https://images.unsplash.com/photo-1494790108755-2616b85771e3?w=100&h=100&fit=crop&crop=face",
          subject: "Mathematics",
          qualifications: ["PhD Mathematics", "Teaching Certificate"],
        },
        {
          id: 2,
          name: "Mr. James Wilson",
          email: "james.wilson@example.com",
          bio: "Passionate English literature teacher who loves helping students discover the beauty of language and storytelling.",
          degree: "Master's in English Literature",
          verified: "pending",
          date: "February 3, 2024, 2:15 PM",
          joiningDate: "2024-02-03",
          profilePicture:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          subject: "English",
          qualifications: ["Master's English Literature", "TESOL Certificate"],
        },
        {
          id: 3,
          name: "Ms. Emily Chen",
          email: "emily.chen@example.com",
          bio: "Science enthusiast dedicated to making chemistry and physics accessible and exciting for all students through hands-on experiments.",
          degree: "Master's in Chemistry",
          verified: "verified",
          date: "March 8, 2024, 9:45 AM",
          joiningDate: "2024-03-08",
          profilePicture:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          subject: "Chemistry",
          qualifications: ["Master's Chemistry", "Lab Safety Certificate"],
        },
        {
          id: 4,
          name: "Dr. Michael Brown",
          email: "michael.brown@example.com",
          bio: "History professor with expertise in world history and social studies. Believes in connecting past events to current affairs.",
          degree: "PhD in History",
          verified: "rejected",
          date: "March 22, 2024, 4:20 PM",
          joiningDate: "2024-03-22",
          profilePicture:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          subject: "History",
          qualifications: ["PhD History", "Research Certificate"],
        },
        {
          id: 5,
          name: "Mrs. Lisa Rodriguez",
          email: "lisa.rodriguez@example.com",
          bio: "Biology teacher passionate about environmental science and helping students understand the natural world around them.",
          degree: "Master's in Biology",
          verified: "verified",
          date: "April 5, 2024, 11:00 AM",
          joiningDate: "2024-04-05",
          profilePicture:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
          subject: "Biology",
          qualifications: [
            "Master's Biology",
            "Environmental Science Certificate",
          ],
        },
      ];
    } else if (titleLower.includes("student")) {
      return [
        {
          id: 1,
          name: "Alex Thompson",
          email: "alex.thompson@student.com",
          parents: "Robert & Mary Thompson",
          teacher: "Dr. Sarah Johnson",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 10",
          profilePicture:
            "https://images.unsplash.com/photo-1539571696857-7a4bb0a9e67e?w=100&h=100&fit=crop&crop=face",
          subject: "Mathematics",
        },
        {
          id: 2,
          name: "Sophie Martinez",
          email: "sophie.martinez@student.com",
          parents: "Carlos & Elena Martinez",
          teacher: "Mr. James Wilson",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 9",
          profilePicture:
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face",
          subject: "English",
        },
        {
          id: 3,
          name: "David Kim",
          email: "david.kim@student.com",
          parents: "Jin & Hye Kim",
          teacher: "Ms. Emily Chen",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 11",
          profilePicture:
            "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
          subject: "Chemistry",
        },
        {
          id: 4,
          name: "Emma Johnson",
          email: "emma.johnson@student.com",
          parents: "Paul & Jennifer Johnson",
          teacher: "Dr. Michael Brown",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 10",
          profilePicture:
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face",
          subject: "History",
        },
        {
          id: 5,
          name: "Ryan Patel",
          email: "ryan.patel@student.com",
          parents: "Raj & Priya Patel",
          teacher: "Mrs. Lisa Rodriguez",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 12",
          profilePicture:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          subject: "Biology",
        },
      ];
    } else if (titleLower.includes("parent")) {
      return [
        {
          id: 1,
          parents: "Robert & Mary Thompson",
          student: "Alex Thompson",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 10",
          status: "Active",
          email: "robert.thompson@parent.com",
        },
        {
          id: 2,
          parents: "Carlos & Elena Martinez",
          student: "Sophie Martinez",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 9",
          status: "Active",
          email: "carlos.martinez@parent.com",
        },
        {
          id: 3,
          parents: "Jin & Hye Kim",
          student: "David Kim",
          date: "September 1, 2024, 8:00 AM",
          joiningDate: "2024-09-01",
          class: "Grade 11",
          status: "Active",
          email: "jin.kim@parent.com",
        },
      ];
    } else if (titleLower.includes("class")) {
      return [
        {
          id: 1,
          class: "Mathematics - Grade 10",
          student: "Alex Thompson",
          parents: "Robert & Mary Thompson",
          teacher: "Dr. Sarah Johnson",
          date: "August 30, 2025, 2:00 PM",
          time: "2:00 PM - 3:00 PM",
          amount: "$45.00",
          status: "Scheduled",
          subject: "Mathematics",
        },
        {
          id: 2,
          class: "English Literature - Grade 9",
          student: "Sophie Martinez",
          parents: "Carlos & Elena Martinez",
          teacher: "Mr. James Wilson",
          date: "August 30, 2025, 3:00 PM",
          time: "3:00 PM - 4:00 PM",
          amount: "$40.00",
          status: "In Progress",
          subject: "English",
        },
        {
          id: 3,
          class: "Chemistry Lab - Grade 11",
          student: "David Kim",
          parents: "Jin & Hye Kim",
          teacher: "Ms. Emily Chen",
          date: "August 30, 2025, 4:00 PM",
          time: "4:00 PM - 5:30 PM",
          amount: "$55.00",
          status: "Completed",
          subject: "Chemistry",
        },
      ];
    } else if (titleLower.includes("subject")) {
      return [
        {
          id: 1,
          name: "Mathematics",
          date: "January 10, 2024",
          class: "Grades 9-12",
          details: "Algebra, Geometry, Calculus, Statistics",
          subject: "Mathematics",
        },
        {
          id: 2,
          name: "English",
          date: "January 10, 2024",
          class: "Grades 9-12",
          details: "Literature, Grammar, Writing, Speaking",
          subject: "English",
        },
        {
          id: 3,
          name: "Science",
          date: "January 10, 2024",
          class: "Grades 9-12",
          details: "Physics, Chemistry, Biology",
          subject: "Science",
        },
        {
          id: 4,
          name: "History",
          date: "January 10, 2024",
          class: "Grades 9-12",
          details: "World History, Ancient Civilizations",
          subject: "History",
        },
      ];
    } else if (titleLower.includes("assignment")) {
      return [
        {
          id: 1,
          date: "August 28, 2025, 10:00 AM",
          details: "Mathematics Homework - Quadratic Equations",
          assignedTo: "Alex Thompson",
          teacher: "Dr. Sarah Johnson",
          subject: "Mathematics",
          status: "Pending",
          dueDate: "August 30, 2025",
        },
        {
          id: 2,
          date: "August 27, 2025, 2:00 PM",
          details: "English Essay - Shakespeare Analysis",
          assignedTo: "Sophie Martinez",
          teacher: "Mr. James Wilson",
          subject: "English",
          status: "Submitted",
          dueDate: "August 29, 2025",
        },
        {
          id: 3,
          date: "August 26, 2025, 9:00 AM",
          details: "Chemistry Lab Report - Acid-Base Reactions",
          assignedTo: "David Kim",
          teacher: "Ms. Emily Chen",
          subject: "Chemistry",
          status: "Graded",
          dueDate: "August 28, 2025",
        },
      ];
    } else if (titleLower.includes("quiz")) {
      return [
        {
          id: 1,
          date: "August 29, 2025, 1:00 PM",
          details: "Biology Quiz - Cell Structure",
          assignedTo: "Ryan Patel",
          teacher: "Mrs. Lisa Rodriguez",
          subject: "Biology",
          status: "Scheduled",
          duration: "30 minutes",
        },
        {
          id: 2,
          date: "August 28, 2025, 11:00 AM",
          details: "History Quiz - World War II",
          assignedTo: "Emma Johnson",
          teacher: "Dr. Michael Brown",
          subject: "History",
          status: "Completed",
          duration: "45 minutes",
        },
      ];
    } else {
      // Default data for other types (System Logs, Earnings, Support Tickets)
      return [
        {
          id: 1,
          date: "August 30, 2025, 9:00 AM",
          details: `${title} entry - Sample data for testing the table design and functionality`,
        },
        {
          id: 2,
          date: "August 29, 2025, 3:30 PM",
          details: `${title} entry - Another sample entry to demonstrate table structure`,
        },
        {
          id: 3,
          date: "August 28, 2025, 2:15 PM",
          details: `${title} entry - Third sample entry for comprehensive testing`,
        },
      ];
    }
  };

  // Set dummy data on component mount
  React.useEffect(() => {
    const dummyData = generateDummyData();
    setTeachers(dummyData);
    setTotalTeachers(dummyData.length);
    setTotalPages(Math.ceil(dummyData.length / rowsPerPage));
  }, [title]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    title: "",
    description: "",
    status: "success",
  });
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
  };
  const handleEdit = (row) => {
    navigate(`/dashboard/teachers/${row.email}/${title}`);
  };
  const handleView = (row) => {
    if (
      title.toLowerCase().includes("assignment") ||
      title.toLowerCase().includes("quiz")
    ) {
      setSelectedItem({
        email:
          row.email ||
          row.studentEmail ||
          row.teacherEmail ||
          row.assignedTo ||
          row.student,
        type: title.toLowerCase().includes("quiz") ? "quiz" : "assignment",
        data: row,
      });
      setShowDetails(true);
    } else if (title.toLowerCase().includes("class")) {
      setSelectedItem(row);
      setShowDetails(true);
    } else {
      setEditData(row);
      setShowProfileView(true);
    }
  };
  const handleBackaction = async () => {
    setEditData(null);
    setShowProfileView(false);
  };
  const handleDelete = async (row) => {
    try {
      const response = await AuthService.deleteUser(row.email);
      console.log("Delete response:", response);
      setResultModal({
        isOpen: true,
        title: response.success ? "Teacher Deleted" : "Delete Failed",
        description:
          response.message ||
          (response.success
            ? "Teacher deleted successfully."
            : "Failed to delete teacher."),
        status: response.success ? "success" : "error",
      });
      console.log("**calling fetchTeacher from handledelete true**");
      await fetchTeachers(currentPage);
    } catch (error) {
      console.error("Delete error:", error);
      setResultModal({
        isOpen: true,
        title: "Delete Failed",
        description: error.message || "Failed to delete teacher.",
        status: "error",
      });
      console.log("**calling fetchTeacher from handledelete false**");
      await fetchTeachers(currentPage);
    }
  };
  // const fetchTeachers = useCallback(
  //   async (page = 1) => {
  //     try {
  //       setLoading(true);
  //       setError("");

  //       const status = true;
  //       console.log("**calling getUser from TablePages**");
  //       const response = await AuthService.getUser(
  //         status,
  //         rowsPerPage,
  //         page,
  //         title
  //       );

  //       if (response.success && response.users) {
  //         // Transform the API data to match our table structure
  //         const transformedData = response.users.map((user) => ({
  //           id: user._id,
  //           date: new Date(user.joiningDate).toLocaleDateString("en-US", {
  //             year: "numeric",
  //             month: "long",
  //             day: "numeric",
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           }),
  //           name: user.name || "Unknown",
  //           email: user.email,
  //           bio: user.bio || "No bio provided",
  //           govId: user.profilePicture ? "Profile Picture" : "Not provided",
  //           degree:
  //             user.qualifications && user.qualifications.length > 0
  //               ? `${user.qualifications.length} qualification(s)`
  //               : "No qualifications",
  //           profilePicture: user.profilePicture,
  //           qualifications: user.qualifications || [],
  //           verified: user.verified,
  //           joiningDate: user.joiningDate,
  //         }));

  //         setTeachers(transformedData);
  //         setTotalPages(
  //           response.totalPages ||
  //             Math.ceil((response.total || 0) / rowsPerPage)
  //         );
  //         setTotalTeachers(response.total || 0);
  //         console.log("Fetched teachers:", transformedData);
  //       } else {
  //         setError("Failed to fetch teachers data");
  //         setTeachers([]);
  //         setTotalPages(0);
  //         setTotalTeachers(0);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching teachers:", error);
  //       setError(error.message || "Failed to fetch teachers");
  //       setTeachers([]);
  //       setTotalPages(0);
  //       setTotalTeachers(0);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [title, rowsPerPage]
  // );
  // useEffect(() => {
  //   console.log("**calling fetchTeacher from useEffect**");
  //   fetchTeachers(currentPage);
  // }, [title, currentPage, fetchTeachers]);

  // Reset to first page when title changes (route changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [title]);

  // Enhanced columns with image support
  const enhancedColumns = useMemo(
    () => [
      ...columns.map((column) => {
        const selectorString =
          typeof column.selector === "string" ? column.selector : "";
        const nameString = typeof column.name === "string" ? column.name : "";

        if (
          showSubjectImages &&
          (column.selector === subjectColumn ||
            nameString.toLowerCase().includes("subject") ||
            selectorString.toLowerCase().includes("subject"))
        ) {
          return {
            ...column,
            cell: (row) => (
              <SubjectCell
                subject={row[column.selector] || row.subject || row.name}
                showImage={showSubjectImages}
              />
            ),
            width: "200px",
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
                className="text-bgprimary"
                title="View"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => handleEdit(row)}
              className="text-bgprimary"
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
      },
    ],
    [columns, showSubjectImages, subjectColumn, title]
  );

  // Filter data based on search and filters
  const filteredData = useMemo(
    () =>
      teachers.filter((item) => {
        const matchesSearch =
          search === "" ||
          Object.values(item).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(search.toLowerCase())
          );

        const matchesSubject =
          selectedSubject === "" ||
          item.subject === selectedSubject ||
          item[subjectColumn] === selectedSubject ||
          item.name === selectedSubject ||
          (item.details &&
            item.details.toLowerCase().includes(selectedSubject.toLowerCase()));

        const matchesGeneric =
          selectedGeneric === "" ||
          item.teacher === selectedGeneric ||
          item.student === selectedGeneric ||
          item.parent === selectedGeneric ||
          item.name === selectedGeneric ||
          item.parents === selectedGeneric;

        // Add date filtering logic here if needed
        const matchesDateRange =
          !startDate ||
          !endDate ||
          (new Date(item.joiningDate || item.date) >= startDate &&
            new Date(item.joiningDate || item.date) <= endDate);

        return (
          matchesSearch && matchesSubject && matchesGeneric && matchesDateRange
        );
      }),
    [
      teachers,
      search,
      selectedSubject,
      selectedGeneric,
      startDate,
      endDate,
      subjectColumn,
    ]
  );

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6 mx-auto">
      {showDetails &&
        (title.toLowerCase().includes("assignment") ||
          title.toLowerCase().includes("quiz")) &&
        selectedItem && (
          <ViewDetails
            email={selectedItem.email}
            type={selectedItem.type}
            data={selectedItem.data}
            handleBack={handleCloseDetails}
          />
        )}
      {showDetails && title.toLowerCase().includes("class") && selectedItem && (
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Class Details</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(selectedItem, null, 2)}
          </pre>
          <button
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg"
            onClick={handleCloseDetails}
          >
            Close
          </button>
        </div>
      )}
      {!showDetails &&
        (showProfileView ? (
          <ViewDetailsActor
            email={editData.email}
            role={title}
            handleBack={handleBackaction}
          />
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
                    placeholder={`Search ${title.toLowerCase()}...`}
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
                {!["teachers", "students", "parents"].includes(
                  title.toLowerCase()
                ) && (
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
                      className="outline-none bg-transparent cursor-pointer text-bgprimary font-semibold"
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
                  <div className="text-gray-500">
                    Loading {title.toLowerCase()}...
                  </div>
                </div>
              }
              noDataComponent={
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">
                    {error
                      ? `Error: ${error}`
                      : `No ${title.toLowerCase()} found`}
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
        description={`Are you sure you want to delete this ${title
          .toLowerCase()
          .slice(0, -1)}? This action cannot be undone.`}
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
