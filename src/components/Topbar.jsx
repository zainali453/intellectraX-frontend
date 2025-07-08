import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import intellectraxLogo from '../assets/IntellectraX.png';
import { Bell, LogOut } from 'lucide-react';
import AuthService from '../services/auth.service';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png'

export default function Topbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useUser();
  const [profileData, setProfileData] = useState(null);
  const isAuthenticated = Boolean(user?.token);


  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setShowModal(false);
    logout();
    navigate('/');
  };

  // Reset modal when auth status changes
  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(false);
    }
  }, [isAuthenticated]);

  return (
    <header className="bg-white px-6 py-2 flex items-center justify-between shadow-sm">
      <div>
        <img 
          src={intellectraxLogo} 
          alt="Logo"
          className="w-70 object-contain cursor-pointer" 
          onClick={handleLogoClick}
        />
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} strokeWidth={1.5} />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowModal(!showModal)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300"
            >
              <img 
                src={user?.picture || logo || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {showModal && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-[2]">
                <div className="px-4 py-2 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={user?.picture || profileData?.profileImage || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{profileData?.fullName || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-gray-50"
                >
                  <LogOut size={18} strokeWidth={1.5} />
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