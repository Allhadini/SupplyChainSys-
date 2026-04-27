import { useState } from 'react';
import { completedShipments, auditLogs } from '../data/mockData';
import { Badge } from '../components/ui';
import { Clock, CheckSquare, Search } from 'lucide-react';

export default function History() {
  const [activeTab, setActiveTab] = useState('shipments'); // 'shipments' or 'audit'

  return (
    <div className="max-w-7xl mx-auto space-y-6 stagger-children">
      <header>
        <h1 className="text-3xl font-heading font-bold text-white tracking-wide">Historical Archive</h1>
        <p className="text-soft-gray mt-1">Review past logistics execution and system audit logs.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-carbon-light p-1 rounded-lg w-max border border-violet-support">
         <button 
           onClick={() => setActiveTab('shipments')}
           className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'shipments' ? 'bg-violet-support text-white shadow' : 'text-soft-gray hover:text-white'}`}
         >
            Completed Shipments
         </button>
         <button 
           onClick={() => setActiveTab('audit')}
           className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'audit' ? 'bg-violet-support text-white shadow' : 'text-soft-gray hover:text-white'}`}
         >
            Audit Logs
         </button>
      </div>

      <div className="glass-card animate-fade-in">
        {/* search bar generic */}
        <div className="p-4 border-b border-violet-support flex items-center justify-between">
           <div className="relative w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
              <input type="text" placeholder="Search archive..." className="w-full bg-carbon border border-violet-support rounded text-sm pl-9 pr-3 py-2 text-white focus-ring" />
           </div>
        </div>

        {activeTab === 'shipments' && (
           <div className="overflow-x-auto">
             <table className="w-full data-table text-left border-collapse opacity-90">
               <thead>
                 <tr className="bg-carbon-light/30 border-b border-violet-support text-soft-gray text-xs tracking-wider uppercase">
                   <th className="py-4 px-6">Date</th>
                   <th className="py-4 px-6">BOL ID</th>
                   <th className="py-4 px-6">Destination Hub</th>
                   <th className="py-4 px-6">Performance</th>
                   <th className="py-4 px-6">Docs</th>
                 </tr>
               </thead>
               <tbody>
                 {completedShipments.map(s => (
                   <tr key={s.id} className="border-b border-white/5">
                     <td className="py-4 px-6 font-mono text-soft-gray">{s.date}</td>
                     <td className="py-4 px-6 text-white font-medium">{s.id}</td>
                     <td className="py-4 px-6 text-soft-gray">{s.destination}</td>
                     <td className="py-4 px-6"><Badge variant={s.delivered}>{s.delivered}</Badge></td>
                     <td className="py-4 px-6"><button className="text-violet-electric text-sm hover:underline hover:text-mint transition-colors flex items-center"><CheckSquare className="w-4 h-4 mr-1"/> Proof</button></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {activeTab === 'audit' && (
           <div className="overflow-x-auto">
             <table className="w-full data-table text-left border-collapse">
               <thead>
                 <tr className="bg-carbon-light/30 border-b border-violet-support text-soft-gray text-xs tracking-wider uppercase">
                   <th className="py-4 px-6">Timestamp</th>
                   <th className="py-4 px-6">Action</th>
                   <th className="py-4 px-6">Initiated By</th>
                 </tr>
               </thead>
               <tbody className="font-mono text-sm">
                 {auditLogs.map(log => (
                   <tr key={log.id} className="border-b border-white/5">
                     <td className="py-4 px-6 text-soft-gray flex items-center"><Clock className="w-3 h-3 mr-2" />{log.timestamp}</td>
                     <td className={`py-4 px-6 ${log.action.includes('Alert') ? 'text-alert-red' : log.action.includes('Optimized') ? 'text-mint' : 'text-white'}`}>{log.action}</td>
                     <td className="py-4 px-6 text-violet-electric">{log.user}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
}
