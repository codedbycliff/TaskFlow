import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;