import CustomHeader from "@/components/CustomHeader";
import CustomIcon from "@/components/CustomIcon";

const statCardsData = [
  {
    label: "Total Classes",
    value: "50",
    Icon: "bookOpen",
    iconBg: "bg-[#5F63F20D]",
    iconClass: "w-7 h-6",
  },
  {
    label: "Total Users",
    value: "150",
    Icon: "totalUsers",
    iconBg: "bg-[#FF69A50D]",
    iconClass: "w-7 h-6",
  },
  {
    label: "Total Earnings",
    value: "$2,500",
    Icon: "dollar",
    iconBg: "bg-[#38BB6D0D]",
    iconClass: "w-4 h-7",
  },
];

const StatCard = ({ label, value, Icon, iconBg, iconClass }) => {
  return (
    <div className='flex justify-between items-center bg-white rounded-2xl px-4 py-3 w-full'>
      <div>
        <p className='text-[#8E97A4] font-medium text-base mb-1'>{label}</p>
        <h2 className='text-xl font-semibold text-gray-800'>{value}</h2>
      </div>
      <div
        className={`${iconBg} w-[60px] h-[60px] flex justify-center items-center rounded-full`}
      >
        <CustomIcon name={Icon} className={iconClass} />
      </div>
    </div>
  );
};

const DashMain = ({ title }) => {
  return (
    <div className='px-8 py-6'>
      <CustomHeader title={title} />
      <div className='flex flex-row justify-between mb-10 space-x-6 '>
        {statCardsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            Icon={stat.Icon}
            iconBg={stat.iconBg}
            iconClass={stat.iconClass}
          />
        ))}
      </div>
    </div>
  );
};

export default DashMain;
