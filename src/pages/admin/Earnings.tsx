import CustomDataTable from "@/components/CustomDataTable";
import CustomHeader from "@/components/CustomHeader";
import CustomPagination from "@/components/CustomPagination";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useNavigate } from "react-router-dom";

const Earnings = () => {
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
    { key: "class", title: "Class" },
    { key: "student", title: "Student" },
    { key: "parent", title: "Parent" },
    { key: "monthlyDue", title: "Monthly Due" },
    { key: "paidOn", title: "Paid On" },
    { key: "amount", title: "Amount" },
    { key: "plan", title: "Subscription Plan" },
    { key: "status", title: "Status" },
    { key: "action", title: "Action" },
  ];

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        // const response = await adminService.getAllParents(currentPage);
        // if (response.data) {
        //   setData(response.data);
        //   setOriginalData(response.data);
        // }
        // if (response.meta) setTotalPages(response.meta.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching verifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [update]);

  useEffect(() => {
    if (search.trim() === "") {
      setData(originalData);
      return;
    }
    const filteredData = originalData;
    // .filter(
    //   (student) =>
    //     student.fullName.toLowerCase().includes(search.toLowerCase()) ||
    //     student.email.toLowerCase().includes(search.toLowerCase()) ||
    //     student.mobileNumber.toLowerCase().includes(search.toLowerCase()) ||
    //     student.subjects.some((subject: string) =>
    //       subject.toLowerCase().includes(search.toLowerCase())
    //     )
    // );
    setData(filteredData);
  }, [search]);

  return (
    <div className='px-8 py-6'>
      <CustomHeader
        title='Earnings'
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

export default Earnings;
