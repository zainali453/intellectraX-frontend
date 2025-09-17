import CustomDetailHeader from "@/components/CustomDetailHeader";
import female from "../../assets/subjects/female.png";
import ClassesCards from "@/components/ClassesCards";
import english from "../../assets/subjects/english.png";
import mathematics from "../../assets/subjects/mathematics.png";

const upcomingClasses = [
  {
    id: "1",
    subject: "English",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "3:00 PM – 4:00 PM",
    image: english,
    onJoinClass: () => console.log("Joining English class"),
  },
  {
    id: "2",
    subject: "Mathematics",
    student: "Steven Smith",
    date: "Thursday, May 9, 2025",
    time: "4:00 PM – 5:00 PM",
    image: mathematics,
    onJoinClass: () => console.log("Joining Math class"),
  },
];

const StudentDetails = () => {
  return (
    <div className='px-8 py-6'>
      <CustomDetailHeader title='Teacher Details Page' />
      <div className='flex flex-row justify-between gap-8 mt-4 p-2'>
        <div className='w-[60%]'>
          <div className='flex flex-col justify-between gap-4 bg-white p-6 rounded-xl'>
            {/* Teacher Image */}
            <div className='w-auto h-auto max-h-[500px] overflow-hidden'>
              <img
                src={female}
                alt={"Student"}
                className='w-full h-full object-cover'
              />
            </div>
            <h2 className='ml-2 text-3xl font-semibold text-textprimary'>
              {"Zain Ali"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
