import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-carbon">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
