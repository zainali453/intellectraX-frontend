import { useRef } from "react";
import CustomIcon from "../components/CustomIcon";
import useSidebarLinks from "../utils/utils";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarLinks = useSidebarLinks();
  // Get the active path from the URL
  const pathSegments = location.pathname.split("/");
  const activePath = pathSegments[2] || "";

  return (
    <div className="flex h-full w-full bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-66 bg-white flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pt-3 px-3 pb-15 scroll-optimized">
          <nav className="space-y-7">
            {sidebarLinks.map((link) => {
              const isActive = activePath === link.name.toLowerCase();
              return (
                <div
                  key={link.name}
                  onClick={() => navigate("/admin/" + link.path)}
                  className={`group flex items-center gap-4 px-5 rounded-lg cursor-pointer transition-colors duration-150 ease-out ${
                    isActive
                      ? "text-bgprimary font-medium"
                      : "text-[#ADB4D2] hover:text-bgprimary font-normal"
                  }`}
                >
                  <CustomIcon
                    name={isActive ? link.icon + "Active" : link.icon}
                    className={`${link.size || "w-5 h-5"} ${
                      !isActive ? "group-hover:hidden" : ""
                    }`}
                  />
                  {!isActive && (
                    <CustomIcon
                      name={(link.icon + "Active") as any}
                      className={`${
                        link.size || "w-5 h-5"
                      } hidden group-hover:block`}
                    />
                  )}
                  <span>{link.name}</span>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content area with proper layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto scroll-optimized">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
