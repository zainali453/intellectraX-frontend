import CustomDataTable from "@/components/CustomDataTable";
import CustomHeader from "@/components/CustomHeader";
import CustomPagination from "@/components/CustomPagination";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useNavigate } from "react-router-dom";

const Parents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setUpdate((prev) => !prev);
  };

  const columns = [
    { key: "parentName", title: "Parent" },
    {
      key: "email",
      title: "Email",
      render: (value: string) => (
        <span className='text-[#4A6CF7]'>{value}</span>
      ),
    },
    { key: "studentName", title: "Student" },
    {
      key: "subjects",
      title: "Classes",
      render: (subjects: string[]) => (
        <div className='flex flex-row gap-1'>
          {subjects?.map((subject) => (
            <div key={subject} className='px-2 py-1 bg-[#F5F7FA] rounded-md'>
              <span className='text-[#5C6AC4]'>{subject}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-md ${
            status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  useEffect(() => {
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllParents(currentPage);
        if (response.data) {
          setData(response.data);
          setOriginalData(response.data);
        }
        if (response.meta) setTotalPages(response.meta.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching verifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifications();
  }, [update]);

  useEffect(() => {
    if (search.trim() === "") {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter(
      (parent) =>
        parent.parentName.toLowerCase().includes(search.toLowerCase()) ||
        parent.email.toLowerCase().includes(search.toLowerCase()) ||
        parent.studentName.toLowerCase().includes(search.toLowerCase()) ||
        parent.subjects.some((subject: string) =>
          subject.toLowerCase().includes(search.toLowerCase())
        )
    );
    setData(filteredData);
  }, [search]);

  return (
    <div className='px-8 py-6'>
      <CustomHeader
        title='Parents'
        searchValue={search}
        onSearchChange={setSearch}
      />

      <CustomDataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(row) => navigate(`/admin/parents/${row.parentId}`)}
      />

      <div className='mt-4'>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Parents;
