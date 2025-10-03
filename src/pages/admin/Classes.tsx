import CustomDataTable from "@/components/CustomDataTable";
import CustomHeader from "@/components/CustomHeader";
import CustomPagination from "@/components/CustomPagination";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useNavigate } from "react-router-dom";
import {
  formatDate,
  formatDisplayTime,
  getOriginalDateUTC,
  getOriginalTimeUTC,
} from "@/services/teacher.service";

const Teachers = () => {
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
    {
      key: "subject",
      title: "Class",
      render: (value: string) => (
        <span>{value.replace(/^\w/, (c) => c.toUpperCase())}</span>
      ),
    },
    {
      key: "date",
      title: "Date",
      render: (value: string) => <span>{value}</span>,
    },
    {
      key: "time",
      title: "Time",
      render: (value: string) => <span>{value}</span>,
    },
    { key: "teacher", title: "Teacher Name" },
    { key: "student", title: "Student Name" },
  ];

  useEffect(() => {
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        const response = await adminService.getAllClasses(currentPage);
        if (response.data) {
          const processedData = response.data.map((item: any) => {
            const utcStartTime = getOriginalDateUTC(
              item.date,
              item.timeSlot.startTime
            );
            const utcEndTime = getOriginalDateUTC(
              item.date,
              item.timeSlot.endTime
            );

            return {
              classId: item._id,
              subject: item.subject.replace(/^\w/, (c) => c.toUpperCase()),
              date: formatDate(utcStartTime),
              time: `${formatDisplayTime(
                getOriginalTimeUTC(utcStartTime)
              )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
              student: item.studentName,
              teacher: item.teacherName,
            };
          });

          setData(processedData);
          setOriginalData(processedData);
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

  // add search functionality locally by filtering the allStudents data
  useEffect(() => {
    if (search.trim() === "") {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter(
      (student) =>
        student.subject.toLowerCase().includes(search.toLowerCase()) ||
        student.date.toLowerCase().includes(search.toLowerCase()) ||
        student.time.toLowerCase().includes(search.toLowerCase()) ||
        student.student.toLowerCase().includes(search.toLowerCase()) ||
        student.teacher.toLowerCase().includes(search.toLowerCase())
    );
    setData(filteredData);
  }, [search]);

  return (
    <div className='px-8 py-6'>
      <CustomHeader
        title='Classes'
        searchValue={search}
        onSearchChange={setSearch}
      />

      <CustomDataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(row) => navigate(`/admin/classes/${row.classId}`)}
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
