import CustomDetailHeader from "@/components/CustomDetailHeader";
import CustomDetailCard from "@/components/CustomDetailCard";
import ConfirmClassEnrollmentModal from "@/components/ConfirmClassEnrollmentModal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatDate } from "@/services/teacher.service";
import { adminService } from "@/services/admin.service";
import user from "@/assets/icons/user.png";

const ParentDetails = () => {
  const parentId = useParams().id;

  const [loading, setLoading] = useState(true);
  const [parentDetails, setParentDetails] = useState<any>(null);
  const [imageError, setImageError] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!parentId) return;

      try {
        setLoading(true);

        const response = await adminService.getParentById(parentId);

        if (response && response.data) {
          setParentDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching parent details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [parentId, update]);

  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Parent Details Page'>
        <div className='flex flex-row gap-4'>
          <button className='bg-[#2F6769] text-white px-5 py-2 rounded-full'>
            Message
          </button>
        </div>
      </CustomDetailHeader>
      {loading ? (
        <div className='flex justify-center items-center h-140'>
          <LoadingSpinner size='lg' />
        </div>
      ) : parentDetails ? (
        <>
          <div className='mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='relative'>
              {!imageError && parentDetails.userId.profilePic ? (
                <img
                  src={parentDetails.userId.profilePic}
                  alt={parentDetails.userId.fullName || "Parent Name"}
                  className='w-full h-100 object-cover rounded-xl'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='w-full h-100 bg-[#4393961a] rounded-xl flex items-center justify-center p-2'>
                  <span className='text-bgprimary font-semibold text-7xl capitalize wrap-anywhere text-center'>
                    {parentDetails.userId.fullName || "Parent Name"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className='text-3xl text-textprimary font-semibold mt-6 mb-4'>
                {parentDetails.userId.fullName || "Parent Name"}
              </h2>
              <p className='text-gray-800 leading-relaxed mb-8'>
                {parentDetails.bio || "No bio available."}
              </p>

              {/* Detail Cards Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <CustomDetailCard
                  icon='studentStar'
                  label='Parent Of'
                  value={parentDetails.studentName || "N/A"}
                />
                <CustomDetailCard
                  icon='calender'
                  label='Joining Date'
                  value={
                    parentDetails.createdAt
                      ? formatDate(parentDetails.createdAt)
                      : "N/A"
                  }
                />
                <CustomDetailCard
                  icon='phone'
                  label='Contact Number'
                  value={parentDetails.userId.mobileNumber || "N/A"}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center h-140'>
          <p className='text-gray-500'>No Parent details found.</p>
        </div>
      )}
    </div>
  );
};

export default ParentDetails;
