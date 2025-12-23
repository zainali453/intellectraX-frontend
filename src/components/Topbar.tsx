import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import intellectraxLogo from "../assets/IntellectraX.png";
import { Bell, LogOut, User } from "lucide-react";
import { useUser } from "../context/UserContext";
import logo from "../assets/logo.png";
import profile from "../assets/icons/user.png";

export default function Topbar({ main = false }: { main?: boolean }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useUser();
  const [profileData, setProfileData] = useState(null);
  const isAuthenticated = Boolean(user?.isAuthenticated);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const handleProfileClick = () => {
    setShowModal(false);
    navigate("/" + user.role + "/profile");
  };

  const handleLogout = () => {
    setShowModal(false);
    logout();
    navigate("/");
  };

  // Reset modal when auth status changes
  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(false);
    }
  }, [isAuthenticated]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <header
      className={
        "bg-white px-6 py-2 flex items-center justify-between sticky top-0 z-50" +
        (main ? "" : " shadow-sm")
      }
    >
      <div>
        <img
          src={intellectraxLogo}
          alt='Logo'
          className='w-40 object-contain cursor-pointer'
          onClick={handleLogoClick}
        />
      </div>

      {isAuthenticated && (
        <div className='flex items-center gap-4'>
          <button className='text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100'>
            <Bell size={20} strokeWidth={1.5} />
          </button>

          <div className='relative'>
            <button
              onClick={() => setShowModal(!showModal)}
              className='w-11 h-11 cursor-pointer rounded-full overflow-hidden border-1 border-gray-200 hover:border-gray-300'
            >
              <img
                src={user?.profilePic || logo}
                alt='Profile'
                className={
                  "w-full h-full " +
                  (user?.profilePic ? "object-cover" : "object-contain ")
                }
              />
            </button>

            {showModal && (
              <div
                ref={modalRef}
                className='absolute right-0 mt-2 w-auto bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-[2]'
              >
                <div className='px-4 py-2 flex items-center gap-3 border-b border-gray-100'>
                  <div className='w-12 h-12 rounded-full overflow-hidden min-w-12'>
                    {user.profilePic ? (
                      <img
                        src={user?.profilePic}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <img
                        src={profile}
                        alt='Profile'
                        className='w-9 h-9 object-cover mt-1'
                      />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-gray-800'>
                      {user?.fullName || "User"}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {user?.email || "No email"}
                    </p>
                  </div>
                </div>

                {user.role !== "admin" && (
                  <button
                    onClick={handleProfileClick}
                    className='w-full px-4 cursor-pointer py-2 flex items-center gap-2 text-gray-500 hover:bg-gray-50'
                  >
                    <User size={21} strokeWidth={2} />
                    <span>Profile</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className='w-full px-4 cursor-pointer py-2 flex items-center gap-2 text-red-700 hover:bg-gray-50'
                >
                  <LogOut size={18} strokeWidth={2} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
