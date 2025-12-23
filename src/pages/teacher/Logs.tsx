import CustomDataTable from "@/components/CustomDataTable";
import CustomHeader from "@/components/CustomHeader";
import CustomPagination from "@/components/CustomPagination";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Logs = () => {
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
    { key: "date", title: "Date" },
    {
      key: "studentName",
      title: "Student Name",
    },
    {
      key: "hours",
      title: "Hours",
    },
    {
      key: "subject",
      title: "Subject Name",
    },
    {
      key: "earning",
      title: "Earning",
    },
  ];

  useEffect(() => {
    // const fetchVerifications = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await adminService.getAllStudents(currentPage);
    //     if (response.data) {
    //       setData(response.data);
    //       setOriginalData(response.data);
    //     }
    //     if (response.meta) setTotalPages(response.meta.pagination.totalPages);
    //   } catch (error) {
    //     console.error("Error fetching verifications:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchVerifications();
  }, [update]);

  // add search functionality locally by filtering the allStudents data
  useEffect(() => {
    if (search.trim() === "") {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter(
      (student) =>
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.mobileNumber.toLowerCase().includes(search.toLowerCase()) ||
        student.subjects.some((subject: string) =>
          subject.toLowerCase().includes(search.toLowerCase())
        )
    );
    setData(filteredData);
  }, [search]);

  return (
    <div className='px-8 py-6'>
      <CustomHeader
        title='Logs'
        searchValue={search}
        onSearchChange={setSearch}
      />

      <CustomDataTable columns={columns} data={data} loading={loading} />

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

export default Logs;
