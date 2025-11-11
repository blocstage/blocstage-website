import { Bell } from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col h-full bg-[#F8F8F8] w-full px-4 sm:px-6 lg:px-8 pt-8">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold md:text-2xl">Event</h2>
          <div className="bg-[#E4F0FC] p-2 rounded-md cursor-pointer">
            <Bell className="w-5 h-4 sm:w-6 sm:h-5 text-[#092C4C]" />
          </div>
        </header>

        {/* Main content area scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-10 pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
