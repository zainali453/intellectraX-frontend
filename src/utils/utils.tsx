/** @format */

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileQuestion,
  MessageSquare,
  Activity,
  DollarSign,
  Settings,
} from "lucide-react";
import { useUser } from "../context/UserContext"; // adjust path as needed
import { IconName } from "../components/CustomIcon";

const adminLinks: {
  name: string;
  icon: IconName;
  path: string;
  size?: string;
}[] = [
  {
    name: "Dashboard",
    icon: "dashboard",
    path: "dashboard",
    size: "w-[19px] h-5",
  },
  {
    name: "Verifications",
    icon: "verifications",
    path: "verifications",
    size: "w-[19px] h-5",
  },
  {
    name: "Classes",
    icon: "classes",
    path: "classes",
    size: "w-[19px] h-[18px]",
  },
  {
    name: "Students",
    icon: "students",
    path: "students",
    size: "w-[20px] h-[16px]",
  },
  {
    name: "Teachers",
    icon: "teachers",
    path: "teachers",
    size: "w-[21px] h-[17px]",
  },
  {
    name: "Parents",
    icon: "parents",
    path: "parents",
    size: "w-[19px] h-[20px]",
  },
  {
    name: "Assignments",
    icon: "assignments",
    path: "assignments",
    size: "w-[18px] h-[19px]",
  },
  {
    name: "Pairing",
    icon: "pairing",
    path: "pairing",
    size: "w-[17px] h-[19px]",
  },
  {
    name: "Quizzes",
    icon: "quizzes",
    path: "quizzes",
    size: "w-[17px] h-[19px]",
  },
  {
    name: "Messages",
    icon: "messages",
    path: "messages",
    size: "w-[19px] h-[19px]",
  },
  {
    name: "System Logs",
    icon: "systemLogs",
    path: "system-logs",
    size: "w-[17px] h-[19px]",
  },
  {
    name: "Earnings",
    icon: "earnings",
    path: "earnings",
    size: "w-[13px] h-[20px]",
  },
  {
    name: "Support Tickets",
    icon: "supportTickets",
    path: "support-tickets",
    size: "w-[17px] h-[19px]",
  },
  {
    name: "Settings",
    icon: "settings",
    path: "settings",
  },
];

const teacherLinks: {
  name: string;
  icon: IconName;
  path: string;
  size?: string;
}[] = [
  {
    name: "Dashboard",
    icon: "dashboard",
    path: "dashboard",
    size: "w-[19px] h-5",
  },
  {
    name: "Classes",
    icon: "classes",
    path: "classes",
    size: "w-[19px] h-[18px]",
  },
  {
    name: "Students",
    icon: "students",
    path: "students",
    size: "w-[21px] h-[16px]",
  },
  {
    name: "Assignments",
    icon: "assignments",
    path: "assignments",
    size: "w-[18px] h-[19px]",
  },
  {
    name: "Quizzes",
    icon: "quizzes",
    path: "quizzes",
    size: "w-[17px] h-[19px]",
  },
  {
    name: "Messages",
    icon: "messages",
    path: "messages",
    size: "w-[19px] h-[19px]",
  },
  {
    name: "Audio/Video Call",
    icon: "audioVideo",
    path: "messages",
    size: "w-[21px] h-[15px]",
  },
  {
    name: "Earnings",
    icon: "earnings",
    path: "earnings",
    size: "w-[13px] h-[20px]",
  },
  {
    name: "Settings",
    icon: "settings",
    path: "settings",
  },
];

const studentLinks: {
  name: string;
  icon: IconName;
  path: string;
  size?: string;
}[] = [
  {
    name: "Dashboard",
    icon: "dashboard",
    path: "dashboard",
    size: "w-[19px] h-5",
  },
  {
    name: "Classes",
    icon: "classes",
    path: "classes",
    size: "w-[19px] h-[18px]",
  },
  {
    name: "Teachers",
    icon: "students",
    path: "teachers",
    size: "w-[21px] h-[16px]",
  },
  {
    name: "Assignments",
    icon: "assignments",
    path: "assignments",
    size: "w-[18px] h-[19px]",
  },
  {
    name: "Quizzes",
    icon: "quizzes",
    path: "quizzes",
    size: "w-[17px] h-[19px]",
  },
  {
    name: "Messages",
    icon: "messages",
    path: "messages",
    size: "w-[19px] h-[19px]",
  },
  {
    name: "Audio/Video Call",
    icon: "audioVideo",
    path: "calls",
    size: "w-[21px] h-[15px]",
  },
  {
    name: "Payments",
    icon: "earnings",
    path: "earnings",
    size: "w-[13px] h-[20px]",
  },
  {
    name: "Settings",
    icon: "settings",
    path: "settings",
  },
  {
    name: "Subscription Plans",
    icon: "card",
    path: "subscription-plans",
    size: "w-[19px] h-[16px]",
  },
];
const parentLinks = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "dashboard" },
  { name: "Classes", icon: <ClipboardList />, path: "classes" },
  { name: "Teacher", icon: <Users />, path: "teachers" },
  { name: "Assignments", icon: <ClipboardList />, path: "assignments" },
  { name: "Quizzes", icon: <FileQuestion />, path: "quizzes" },
  { name: "Messages", icon: <MessageSquare />, path: "messages" },
  { name: "Audio/Video Call", icon: <Activity />, path: "setup-call" },
  { name: "Earnings", icon: <DollarSign />, path: "earnings" },
  { name: "Settings", icon: <Settings />, path: "settings" },
];

export default function useSidebarLinks() {
  const { user } = useUser();

  let sidebarLinks: any[] = [];

  if (user.role === "teacher") {
    sidebarLinks = teacherLinks;
  } else if (user.role === "student") {
    sidebarLinks = studentLinks;
  } else if (user.role === "parent") {
    sidebarLinks = parentLinks;
  } else if (user.role === "admin") {
    sidebarLinks = adminLinks;
  }

  return sidebarLinks;
}

export const pricingPlans = [
  {
    id: "basic",
    title: "Basic Plan",
    credits: "5 Credits",
    price: 29,
  },
  {
    id: "standard",
    title: "Standard Plan",
    credits: "10 Credits",
    price: 49,
  },
  {
    id: "premium",
    title: "Premium Plan",
    credits: "20 Credits",
    price: 79,
  },
  {
    id: "advanced",
    title: "Advanced Plan",
    credits: "30 Credits",
    price: 99,
  },
  {
    id: "elite",
    title: "Elite Plan",
    credits: "Unlimited Credits",
    price: 129,
  },
];

// Dummy table columns (for TablePage, etc.)
export const subjectsColumns = [
  { name: "Subject Name", selector: (row) => row.name },
  { name: "Added Date", selector: (row) => row.date, sortable: true },
  { name: "Class", selector: (row) => row.class },
  { name: "Details", selector: (row) => row.details },
];

export const classColumns = [
  { name: "Class", selector: (row) => row.class },
  { name: "Student", selector: (row) => row.student },
  { name: "Parent", selector: (row) => row.parents },
  { name: "Teacher", selector: (row) => row.teacher },
  { name: "Date", selector: (row) => row.date, sortable: true },
  { name: "Class Time", selector: (row) => row.time, sortable: true },
  { name: "Amount", selector: (row) => row.amount, sortable: true },
  { name: "Status", selector: (row) => row.status },
];

// Memoized ProfileCell for use in DataTable columns
export const ProfileCell = (row) => (
  <div className='flex items-center justify-center'>
    <img
      src={
        row.profilePicture ||
        "https://via.placeholder.com/40x40/f0f0f0/999999?text=" +
          (row.name ? row.name.charAt(0) : "?")
      }
      alt={row.name}
      className='w-10 h-10 rounded-full object-cover border-2 border-gray-200'
      onError={(e) => {
        e.target.src =
          "https://via.placeholder.com/40x40/f0f0f0/999999?text=" +
          (row.name ? row.name.charAt(0) : "?");
      }}
    />
  </div>
);

export const studentColumns = [
  {
    name: "Profile",
    selector: (row) => row.profilePicture,
    cell: ProfileCell,
    center: true,
    maxWidth: "80px",
    minWidth: "80px",
  },
  { name: "Studen", selector: (row) => row.name },
  { name: "Parent", selector: (row) => row.parents },
  { name: "Teacher", selector: (row) => row.teacher },
  { name: "Joining Date", selector: (row) => row.date, sortable: true },
  { name: "Classes", selector: (row) => row.class },
];

// export const teacherColumns = [
//   { name: 'Teacher', selector: row => row.teacher },
//   { name: 'Student', selector: row => row.student },
//   { name: 'Parent', selector: row => row.parents },
//   { name: 'Joining Date', selector: row => row.date, sortable: true },
//   { name: 'Classes', selector: row => row.class },
//   { name: 'Status', selector: row => row.status },
// ];

export const teacherColumns = [
  {
    name: "Profile",
    selector: (row) => row.profilePicture,
    cell: ProfileCell,
    center: true,
    maxWidth: "80px",
    minWidth: "80px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    grow: 1,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    grow: 2,
  },
  {
    name: "Bio",
    selector: (row) => row.bio,
    cell: (row) => (
      <div className='py-2' title={row.bio}>
        <div className='line-clamp-2 text-sm text-gray-600'>
          {row.bio || "No bio provided"}
        </div>
      </div>
    ),
    grow: 2,
  },
  {
    name: "Qualifications",
    selector: (row) => row.degree,
    sortable: true,
    grow: 1,
  },
  {
    name: "Joining Date",
    selector: (row) => row.date,
    sortable: true,
    grow: 1,
  },
  {
    name: "Status",
    selector: (row) => row.verified,
    cell: (row) => {
      const getStatusConfig = (status) => {
        switch (status) {
          case "verified":
            return {
              bg: "bg-green-100",
              text: "text-green-800",
              label: "Verified",
            };
          case "rejected":
            return {
              bg: "bg-red-100",
              text: "text-red-800",
              label: "Rejected",
            };
          case "pending":
          default:
            return {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
              label: "Pending",
            };
        }
      };

      const config = getStatusConfig(row.verified);
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.text}`}
        >
          {config.label}
        </span>
      );
    },
    sortable: true,
    center: true,
    grow: 0.5,
  },
];

export const parentColumns = [
  { name: "Parent", selector: (row) => row.parents },
  { name: "Student", selector: (row) => row.student },
  { name: "Joining Date", selector: (row) => row.date, sortable: true },
  { name: "Classes", selector: (row) => row.class },
  { name: "Status", selector: (row) => row.status },
];

export const logsColumns = [
  { name: "Date and Time", selector: (row) => row.date, sortable: true },
  { name: "Details", selector: (row) => row.details },
];

// Dummy data for tables
export const defaultData = [
  {
    id: 1,
    name: "John Doe",
    date: "2024-05-01",
    class: "JSS1",
    details: "Top student",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2024-05-02",
    class: "JSS2",
    details: "Excellent in English",
  },
];

// Utility arrays and functions
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const moneyData = [
  { date: "2 May", money: 120 },
  { date: "3 May", money: 200 },
  { date: "4 May", money: 150 },
  { date: "5 May", money: 300 },
  { date: "6 May", money: 250 },
  { date: "7 May", money: 400 },
];

// Utility to parse "2 May" to a Date object (current year)
export function parseDate(str) {
  const [day, month] = str.split(" ");
  return new Date(
    new Date().getFullYear(),
    months.indexOf(month),
    parseInt(day)
  );
}

export function getStepContent(step, role = "teacher") {
  if (role?.toLowerCase() === "teacher" || role?.toLowerCase() === "parent") {
    switch (step) {
      case 1:
        return {
          title: "Bio & Qualifications",
          description:
            "Please provide the following information to set up your Teacher Portal account.",
        };
      case 2:
        return {
          title: "Class & Subjects",
          description:
            "Please provide the following information to set up your Teacher Portal account.",
        };
      case 3:
        return {
          title: "Availability Schedule",
          description:
            "Please provide your availability and preferred teaching schedule.",
        };
      case 4:
        return {
          title: "Bank Details",
          description: "Enter your session rate and bank details for payment.",
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  } else if (role?.toLowerCase() === "student") {
    switch (step) {
      case 1:
        return {
          title: "Level of Study",
          description:
            "Please provide the following information to set up your Student Portal account.",
        };
      case 2:
        return {
          title: "Class & Subjects",
          description:
            "Please provide the following information to set up your Student Portal account.",
        };
      case 3:
        return {
          title: "Parent Account",
          description:
            "Enter parent details to invite them via email or invitation code.",
        };
      case 4:
        return {
          title: "Payment",
          description: "Please Proceed to Payment of your selected plan.",
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  }

  return {
    title: "",
    description: "",
  };
}

export function isStepValid(onboardingData, currentStep, role = "teacher") {
  if (role?.toLowerCase() === "teacher" || role?.toLowerCase() === "parent") {
    switch (currentStep) {
      case 1: {
        const hasProfilePicture = Boolean(onboardingData.profilePic);
        const hasGovernmentId = Boolean(onboardingData.governmentId);
        const hasCertificates =
          onboardingData.certificateLinks &&
          onboardingData.certificateLinks.length > 0;
        const hasDegrees =
          onboardingData.degreeLinks && onboardingData.degreeLinks.length > 0;
        const hasQualifications = hasCertificates || hasDegrees;
        const hasBio = Boolean(onboardingData.bio);
        return (
          hasProfilePicture && hasGovernmentId && hasQualifications && hasBio
        );
      }
      case 2: {
        const hasClasses =
          onboardingData.classes && onboardingData.classes.length > 0;
        const hasZeroPrice = onboardingData.classes?.some((cls) =>
          cls.subjects?.some((sub) => sub.price === 0)
        );
        if (hasZeroPrice) return false;
        return hasClasses;
      }
      case 3: {
        const hasAvailability =
          onboardingData.availability && onboardingData.availability.length > 0;
        return hasAvailability;
      }
      case 4: {
        const hasAllRequired =
          onboardingData.pricingFName &&
          onboardingData.pricingLName &&
          onboardingData.pricingSortCode &&
          onboardingData.pricingAccountNumber;

        return hasAllRequired;
      }
      default:
        return true;
    }
  } else if (role?.toLowerCase() === "student") {
    switch (currentStep) {
      case 1: {
        return onboardingData.level && onboardingData.plan;
      }
      case 2: {
        return onboardingData.subjects && onboardingData.subjects.length > 0;
      }
      case 3: {
        return onboardingData.parentEmail && onboardingData.parentContactNumber;
      }
      case 4: {
        return true;
      }
      default:
        return true;
    }
  }

  return false;
}
