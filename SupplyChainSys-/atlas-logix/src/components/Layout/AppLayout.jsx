import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-transparent relative">
      {/* Ambient background effects */}
      <div className="ambient-bg" />
      <div className="grid-overlay" />

      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
