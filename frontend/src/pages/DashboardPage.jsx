import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-transparent lg:flex-row">
      <Sidebar />

      <div className="animate-page-in flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
