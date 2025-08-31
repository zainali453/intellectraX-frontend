import { useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import CustomDataTable from "../../components/CustomDataTable";
import CustomPagination from "../../components/CustomPagination";
import { adminService, VerificationData } from "../../services/admin.service";

type TabType = "pending" | "accepted" | "rejected";

// Extract filename from URL
const extractFileNameFromUrl = (url: string): string => {
  try {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 2];
    return fileName;
  } catch {
    return "Document";
  }
};

const Verifications = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VerificationData[]>([]);
  const [update, setUpdate] = useState(false);

  const handleVerification = async (
    teacherId: string,
    action: "accept" | "reject"
  ) => {
    try {
      setLoading(true);
      await adminService.verifyTeacher(teacherId, action);
      // Refresh the data after successful verification
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Verification failed:", error);
      // Handle error (show toast, alert, etc.)
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "updatedAt",
      title: "Date & Time",
      render: (value: string) =>
        new Date(value)
          .toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(" at ", " – "),
    },
    {
      key: "userId.fullName",
      title: "Name",
    },
    {
      key: "userId.email",
      title: "Email",
    },
    {
      key: "bio",
      title: "Experience & Bio",
      render: (value: string) => {
        if (value && value.length > 25)
          return <div>{value.slice(0, 25)}...</div>;
        else return <div>{value || "N/A"}</div>;
      },
    },
    {
      key: "governmentId",
      title: "Government ID",
      render: (value: string) => (
        <span className="text-bgprimary cursor-pointer hover:underline">
          {extractFileNameFromUrl(value)}
        </span>
      ),
    },
    {
      key: "degreeLinks",
      title: "Degree",
      render: (value: string[]) => (
        <div className="text-bgprimary cursor-pointer gap-2 flex flex-col">
          {value.map((link) => (
            <div className="hover:underline" key={link}>
              {extractFileNameFromUrl(link)}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (value: any, record: VerificationData) => (
        <div className="flex items-center space-x-2">
          <button className="p-1 text-bgprimary hover:text-teal-600 cursor-pointer">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          {activeTab !== "accepted" && (
            <button
              className="p-1 text-bgprimary hover:text-teal-600 cursor-pointer"
              onClick={() => handleVerification(record._id, "accept")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
          {activeTab !== "rejected" && (
            <button
              className="p-1 text-red-700 hover:text-red-800 cursor-pointer"
              onClick={() => handleVerification(record._id, "reject")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  const tabs = [
    { id: "pending" as TabType, label: "Pending", count: 0 },
    { id: "accepted" as TabType, label: "Accepted", count: 0 },
    { id: "rejected" as TabType, label: "Rejected", count: 0 },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setTotalPages(1);
    setUpdate((prev) => !prev);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setUpdate((prev) => !prev);
  };

  useEffect(() => {
    const fetchVerifications = async (tab: TabType, page: number = 1) => {
      setLoading(true);
      try {
        const response = await adminService.getTeachers(currentPage, tab);
        if (response.data) setData(response.data);
        if (response.meta) setTotalPages(response.meta.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching verifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifications(activeTab);
  }, [update]);

  return (
    <div className="px-8 py-6">
      <CustomHeader
        title="Verification's"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        placeholder="Search..."
      />

      {/* Tabs */}
      <div className="mb-10 bg-white rounded-2xl">
        <div>
          <nav className="mb-6 flex flex-row justify-between items-center px-10">
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
        <CustomDataTable columns={columns} data={data} loading={loading} />
      </div>

      {/* Pagination */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={loading}
      />
    </div>
  );
};

export default Verifications;
