import { useEffect } from "react";
import  useSidebarLinks  from "../utils/utils";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
   const sidebarLinks = useSidebarLinks(); 

  // Get the active path from the URL
  const pathSegments = location.pathname.split("/");
  const activePath = pathSegments[2] || "";

  useEffect(() => {
    // Redirect to dashboard main if no specific path is provided
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleNavigation = (linkPath) => {
    if (linkPath === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${linkPath}`);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-66 bg-white p-4">
        <nav className="space-y-2">
          {sidebarLinks.map((link) => {
            const linkPath = link.path || link.name.toLowerCase();
            const isActive = (linkPath === "dashboard" && activePath === "") || activePath === linkPath;

            return (
              <div
                key={link.name}
                onClick={() => handleNavigation(linkPath)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer font-bold transition-colors ${isActive
                    ? "text-teal-600 bg-teal-50"
                    : "text-gray-500 hover:bg-teal-100 hover:text-teal-600"
                  }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}