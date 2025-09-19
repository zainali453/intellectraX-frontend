import CustomDataTable from "@/components/CustomDataTable";
import CustomHeader from "@/components/CustomHeader";
import CustomPagination from "@/components/CustomPagination";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useNavigate } from "react-router-dom";

const Teachers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setUpdate((prev) => !prev);
  };

  const columns = [
    { key: "fullName", title: "Student Name" },
    {
      key: "email",
      title: "Email",
      render: (value: string) => (
        <span className='text-[#4A6CF7]'>{value}</span>
      ),
    },
    { key: "mobileNumber", title: "Contact Number" },
    {
      key: "subjects",
      title: "Subjects",
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
  ];

  useEffect(() => {
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllStudents(currentPage);
        if (response.data) {
          setData(response.data);
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

  return (
    <div className='px-8 py-6'>
      <CustomHeader title='Students' />

      <CustomDataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(row) => navigate(`/admin/students/${row.studentId}`)}
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

export default Teachers;
