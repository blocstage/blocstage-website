import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col h-full bg-[#F8F8F8] w-full px-4 sm:px-6 lg:px-8 pt-8">
        <DashboardHeader />

        {/* Main content area scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-10 pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
