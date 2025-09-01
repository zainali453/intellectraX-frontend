import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import AdminSideBar from "./AdminSideBar";

export default function MainLayout() {
  return (
    <div className="bg-gray-100 flex flex-col h-screen">
      <Topbar main={true} />
      <main className="bg-gray-200 flex-1 flex overflow-hidden">
        <AdminSideBar />
      </main>
    </div>
  );
}
