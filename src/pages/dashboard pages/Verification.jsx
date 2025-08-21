import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Eye,
  X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditDialog from "../../components/EditDialog";
import AuthService from "../../services/auth.service";
import Modal from "../../components/Modal";

export default function VerificationsPage() {
  const [activeTab, setActiveTab] = useState("Teachers");
  const [subTab, setSubTab] = useState("Pending");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  // Modal states
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    buttonText: "",
    status: "success",
    showIcon: true,
    onConfirm: null,
  });

  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Map subTab to API status parameter
  const getStatusForAPI = (subTab) => {
    switch (subTab) {
      case "Pending":
        return "pending";
      case "Accepted":
        return "verified";
      case "Rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  // Fetch teachers based on current tab and pagination
  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const status = getStatusForAPI(subTab);
      console.log("**calling getUser from Verification**");
      const response = await AuthService.getUser(
        status,
        rowsPerPage,
        page,
        "Teacher"
      );

      if (response.success && response.users) {
        // Transform the API data to match our table structure
        const transformedData = response.users.map((user) => ({
          id: user._id,
          date: new Date(user.joiningDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          name: user.name || "Unknown",
          email: user.email,
          bio: user.bio || "No bio provided",
          govId: user.profilePicture ? "Profile Picture" : "Not provided",
          degree:
            user.qualifications && user.qualifications.length > 0
              ? `${user.qualifications.length} qualification(s)`
              : "No qualifications",
          profilePicture: user.profilePicture,
          qualifications: user.qualifications || [],
          verified: user.verified,
          joiningDate: user.joiningDate,
        }));

        setTeachers(transformedData);
        setTotalPages(
          response.totalPages || Math.ceil((response.total || 0) / rowsPerPage)
        );
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
  };

  // Fetch teachers when component mounts, tab changes, page changes, or refresh is triggered
  useEffect(() => {
    fetchTeachers(currentPage);
  }, [subTab, currentPage, refreshTrigger]);

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [subTab]);

  // Filter data based on search and date range (client-side filtering)
  const getFilteredData = () => {
    let filtered = teachers.filter((teacher) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.bio.toLowerCase().includes(searchLower);

      // Add date filtering if dates are selected
      let matchesDate = true;
      if (startDate && endDate) {
        const teacherDate = new Date(teacher.joiningDate);
        matchesDate = teacherDate >= startDate && teacherDate <= endDate;
      }

      return matchesSearch && matchesDate;
    });

    return filtered;
  };

  const filteredData = getFilteredData();

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleView = (row) => {
    console.log("Viewing teacher profile:", row);
    navigate(`/dashboard/teachers/${row.email}/Teacher`);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setEditDialogOpen(true);
  };

  // Handle opening profile picture in new tab
  const handleProfilePictureClick = (profilePictureUrl) => {
    if (profilePictureUrl) {
      window.open(profilePictureUrl, "_blank");
    }
  };

  // Handle opening qualifications in new tab
  const handleQualificationsClick = (qualifications) => {
    if (qualifications && qualifications.length > 0) {
      // Open the first qualification file in new tab
      const firstQualification = qualifications[0];
      if (firstQualification.fileUrl) {
        window.open(firstQualification.fileUrl, "_blank");
      }
    }
  };

  const handleVerifyClick = (teacher) => {
    console.log("Opening verify modal for teacher:", teacher);
    setSelectedTeacher(teacher);
    setModalConfig({
      isOpen: true,
      title: "Verify Teacher",
      description:
        "Are you sure you want to verify this teacher? This action will approve their profile and allow them to start teaching.",
      buttonText: "Verify",
      status: "success",
      showIcon: true,
      onConfirm: () => confirmVerify(teacher),
    });
  };

  // Handle reject teacher
  const handleRejectClick = (teacher) => {
    console.log("Opening reject modal for teacher:", teacher);
    setSelectedTeacher(teacher);
    setModalConfig({
      isOpen: true,
      title: "Reject Teacher",
      description:
        "Are you sure you want to reject this teacher? This action will deny their profile and they will need to reapply.",
      buttonText: "Reject",
      status: "error",
      showIcon: true,
      onConfirm: () => confirmReject(teacher),
    });
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalConfig({
      isOpen: false,
      title: "",
      description: "",
      buttonText: "",
      status: "success",
      showIcon: true,
      onConfirm: null,
    });
    setSelectedTeacher(null);
  };

  // Show success modal
  const showSuccessModal = (title, description) => {
    setModalConfig({
      isOpen: true,
      title: title,
      description: description,
      buttonText: "OK",
      status: "success",
      showIcon: true,
      onConfirm: null,
    });
  };

  // Show error modal
  const showErrorModal = (title, description) => {
    setModalConfig({
      isOpen: true,
      title: title,
      description: description,
      buttonText: "OK",
      status: "error",
      showIcon: true,
      onConfirm: null,
    });
  };

  // Confirm verify teacher
  const confirmVerify = async (teacherData) => {
    const teacher = teacherData || selectedTeacher;
    try {
      console.log("Verifying teacher:", teacher);

      if (!teacher) {
        showErrorModal("Error", "No teacher data found. Please try again.");
        return;
      }

      // Close the confirmation modal first
      handleModalClose();

      // Call the API to verify teacher
      const response = await AuthService.TeacherVerification(
        teacher.email,
        "verified"
      );

      if (response.success) {
        // Show success modal
        showSuccessModal(
          "Teacher Verified Successfully!",
          `${teacher.name} has been verified and can now start teaching.`
        );

        // Trigger refresh to reload current page data
        setRefreshTrigger((prev) => prev + 1);
      } else {
        showErrorModal(
          "Verification Failed",
          response.message || "Failed to verify the teacher. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying teacher:", error);
      showErrorModal(
        "Verification Failed",
        error.message ||
          "An error occurred while verifying the teacher. Please try again."
      );
    }
  };

  // Confirm reject teacher
  const confirmReject = async (teacherData) => {
    const teacher = teacherData || selectedTeacher;
    try {
      console.log("Rejecting teacher:", teacher);

      if (!teacher) {
        showErrorModal("Error", "No teacher data found. Please try again.");
        return;
      }

      // Close the confirmation modal first
      handleModalClose();

      // Call the API to reject teacher
      const response = await AuthService.TeacherVerification(
        teacher.email,
        "rejected"
      );

      if (response.success) {
        // Show success modal (but with different messaging)
        showSuccessModal(
          "Teacher Rejected",
          `${teacher.name} has been rejected and will need to reapply.`
        );

        // Trigger refresh to reload current page data
        setRefreshTrigger((prev) => prev + 1);
      } else {
        showErrorModal(
          "Rejection Failed",
          response.message || "Failed to reject the teacher. Please try again."
        );
      }
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      showErrorModal(
        "Rejection Failed",
        error.message ||
          "An error occurred while rejecting the teacher. Please try again."
      );
    }
  };

  // Handle tab change
  const handleTabChange = (newTab) => {
    setSubTab(newTab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Move columns array here so it can access handleView
  const columns = [
    {
      name: "Date & Time",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Experience & Bio",
      selector: (row) => row.bio,
    },
    {
      name: "Government ID",
      cell: (row) => (
        <span
          className={`${
            row.profilePicture
              ? "text-teal-600 underline cursor-pointer hover:text-bgprimary"
              : "text-gray-500"
          }`}
          onClick={() =>
            row.profilePicture && handleProfilePictureClick(row.profilePicture)
          }
        >
          {row.govId}
        </span>
      ),
    },
    {
      name: "Degree",
      cell: (row) => (
        <span
          className={`${
            row.qualifications && row.qualifications.length > 0
              ? "text-teal-600 underline cursor-pointer hover:text-bgprimary"
              : "text-gray-500"
          }`}
          onClick={() =>
            row.qualifications &&
            row.qualifications.length > 0 &&
            handleQualificationsClick(row.qualifications)
          }
        >
          {row.degree}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="space-x-2 text-lg">
          <button
            className="text-teal-600 hover:text-bgprimary"
            onClick={() => handleView(row)}
            title="View Profile"
          >
            <Eye className="w-5 h-5" />
          </button>
          {subTab === "Pending" && (
            <>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleVerifyClick(row)}
                title="Verify Teacher"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRejectClick(row)}
                title="Reject Teacher"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between my-6 items-center mb-6">
        <h2 className="text-4xl font-semibold text-gray-600">Verification's</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-white items-center border gap-3 p-2 border-2 border-gray-200 rounded-3xl w-full md:w-[400px]">
            <Search className="text-teal-600 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, or bio"
              className="bg-white outline-none w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
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
              }}
              isClearable
              placeholderText="Select Date Range"
              className="outline-none bg-transparent cursor-pointer text-bgprimary font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Wrap the rest in a div with a white background */}
      <div className="bg-white p-6 rounded-2xl">
        {/* Sub Tabs */}
        <div className="flex pb-2 justify-center w-full">
          {["Pending", "Accepted", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleTabChange(status)}
              className={`pb-2 flex-1 text-center border-b ${
                subTab === status
                  ? "border-teal-600 border-b-4 font-bold text-teal-600 font-medium"
                  : "border-gray-300 font-bold text-gray-500"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-teal-600">Loading teachers...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">{error}</div>
              <button
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={filteredData}
                pagination={false} // disable default pagination
                customStyles={{
                  table: {
                    style: {
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb", // light gray border
                      overflow: "hidden",
                    },
                  },
                  headCells: {
                    style: {
                      backgroundColor: "#f3f4f6", // Tailwind's gray-100
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
                      borderBottom: "1px solid #e5e7eb", // light gray border on rows
                    },
                  },
                }}
              />

              {/* Custom Pagination */}
              {totalPages > 0 && (
                <div className="flex justify-between items-center mt-8">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                    {Math.min(currentPage * rowsPerPage, totalTeachers)} of{" "}
                    {totalTeachers} teachers
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-teal-600 hover:bg-teal-50"
                      }`}
                    >
                      <ChevronLeft />
                    </button>

                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                      let page;
                      if (totalPages <= 5) {
                        page = index + 1;
                      } else {
                        if (currentPage <= 3) {
                          page = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + index;
                        } else {
                          page = currentPage - 2 + index;
                        }
                      }

                      const isActive = page === currentPage;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-full font-semibold text-sm transition ${
                            isActive
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
                      className={`p-2 rounded-full ${
                        currentPage === totalPages
                          ? "text-gray-300"
                          : "text-teal-600 hover:bg-teal-50"
                      }`}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              )}

              {filteredData.length === 0 && !loading && !error && (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    No teachers found for the selected criteria
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Use your EditDialog and pass data as prop */}
        <EditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          data={editData}
        />

        {/* Custom Modal with Confirm Action */}
        <Modal
          isOpen={modalConfig.isOpen}
          onClose={modalConfig.onConfirm ? handleModalClose : handleModalClose}
          title={modalConfig.title}
          description={modalConfig.description}
          buttonText={modalConfig.buttonText}
          status={modalConfig.status}
          showIcon={modalConfig.showIcon}
          onConfirm={modalConfig.onConfirm}
        />
      </div>
    </div>
  );
}
