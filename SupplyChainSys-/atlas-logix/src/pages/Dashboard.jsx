import { kpiData, shipments, alerts } from '../data/mockData';
import { Badge } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Truck, AlertTriangle, Activity } from 'lucide-react';

export default function Dashboard() {
  const chartData = shipments.map((s, i) => ({ name: s.id.slice(-4), risk: s.risk === 'Severe' ? 95 : s.risk === 'High' ? 80 : s.risk === 'Medium' ? 50 : 20 }));

  return (
    <div className="stagger-children max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-wide">Mission Control</h1>
          <p className="text-soft-gray mt-1">Real-time overview of your global logistics network.</p>
        </div>
        <button 
           className="btn-primary"
           onClick={async () => {
              try {
                 const res = await fetch('http://localhost:5000/api/shipments/import-live', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                 });
                 if (res.ok) alert("Live maritime data imported to DB!");
                 else alert("Failed to import. Have you generated a token?");
              } catch (e) {
                 alert("Backend error on import.");
              }
           }}
        >
          Import Live Data
        </button>
      </header>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => {
          const icons = [<Package />, <AlertTriangle />, <Activity />, <Truck />];
          return (
            <div key={kpi.id} className="glass-card glass-card-hover p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-soft-gray font-medium">{kpi.label}</span>
                <span className={`p-2 rounded-lg ${kpi.status === 'warning' ? 'bg-alert-red/10 text-alert-red' : 'bg-violet-electric/10 text-mint'}`}>
                   {icons[i]}
                </span>
              </div>
              <div className="text-3xl font-bold text-white">{kpi.value}</div>
              <div className={`text-sm mt-2 font-medium ${kpi.status === 'warning' ? 'text-alert-red' : 'text-mint'}`}>
                {kpi.change} from last week
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col">
          <h2 className="text-xl font-bold font-heading mb-6">Shipment Risk Profiles</h2>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#EBEBED" opacity={0.5} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(75, 64, 89, 0.4)' }}
                  contentStyle={{ backgroundColor: '#1A1F23', border: '1px solid #4B4059', borderRadius: '8px' }}
                />
                <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.risk > 70 ? '#EF4444' : entry.risk > 40 ? '#F59E0B' : '#53E6D4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Alerts Feed */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading">Actionable Alerts</h2>
            <Badge variant="critical">{alerts.length} Critical</Badge>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {alerts.map(alert => (
              <div key={alert.id} className="p-4 rounded-xl bg-carbon relative overflow-hidden border border-violet-support hover:border-alert-red/30 transition-colors">
                <div className={`absolute top-0 left-0 w-1 h-full ${alert.severity === 'Critical' ? 'bg-alert-red' : alert.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-white">{alert.type}</span>
                  <span className="text-xs text-soft-gray">{alert.time}</span>
                </div>
                <p className="text-sm text-soft-gray mb-3">{alert.message}</p>
                <div className="flex space-x-2">
                  <button className="btn-primary text-xs py-1.5 px-3">View Route</button>
                  {alert.severity !== 'Medium' && <button className="btn-ghost text-xs py-1.5 px-3 uppercase tracking-wider">Approve Reroute</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Tracking Table */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold font-heading mb-4">Live Tracking</h2>
        <div className="overflow-x-auto">
          <table className="w-full data-table text-left border-collapse">
            <thead>
              <tr className="text-soft-gray border-b border-violet-support">
                <th className="pb-3 font-medium px-4">Shipment ID</th>
                <th className="pb-3 font-medium px-4">Destination</th>
                <th className="pb-3 font-medium px-4">Status</th>
                <th className="pb-3 font-medium px-4">ETA</th>
                <th className="pb-3 font-medium px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {shipments.slice(0, 5).map(s => (
                <tr key={s.id} className="border-b border-white/5 cursor-pointer">
                  <td className="py-4 px-4 font-mono font-medium">{s.id}</td>
                  <td className="py-4 px-4">{s.destination}</td>
                  <td className="py-4 px-4"><Badge variant={s.status}>{s.status}</Badge></td>
                  <td className="py-4 px-4 text-soft-gray">{s.eta}</td>
                  <td className="py-4 px-4"><Badge variant={s.risk}>{s.risk}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
