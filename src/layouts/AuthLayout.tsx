import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function AuthLayout() {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Topbar />
      <main className="bg-gray-100 flex-1 flex justify-center items-center min-h-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
