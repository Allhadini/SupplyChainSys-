import { financialKPIs, predictiveTrendsData } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Analytics() {
  const pieData = [
    { name: 'North America', value: 400, color: '#683CE4' },
    { name: 'Europe', value: 300, color: '#53E6D4' },
    { name: 'Asia Pacific', value: 300, color: '#6045F4' },
    { name: 'Latin America', value: 200, color: '#3BC4B3' },
  ];

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Atlas-Logix Predictive Trends Report Data", 14, 15);
    
    const tableData = predictiveTrendsData.map(d => [d.month, d.delays, d.onTime]);

    doc.autoTable({
        startY: 20,
        head: [['Month', 'Delays', 'On-Time']],
        body: tableData,
    });
    
    doc.save(`atlas_logix_analytics_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="stagger-children max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-heading font-bold text-white tracking-wide">Performance Analytics</h1>
           <p className="text-soft-gray mt-1">Financial overview and predictive AI models.</p>
        </div>
        <button onClick={handleDownloadReport} className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export Report
        </button>
      </header>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {financialKPIs.map((kpi, idx) => (
            <div key={idx} className="glass-card p-6 relative overflow-hidden group">
               <div className="absolute -right-6 -top-6 text-violet-support/20 group-hover:text-violet-support/40 transition-colors">
                  <DollarSign className="w-32 h-32" />
               </div>
               <h3 className="text-soft-gray font-medium mb-2 relative z-10">{kpi.metric}</h3>
               <div className="text-4xl font-bold text-white mb-2 relative z-10">{kpi.value}</div>
               <div className={`text-sm font-semibold flex items-center relative z-10 ${kpi.change.startsWith('+') ? 'text-alert-red' : 'text-mint'}`}>
                   {kpi.change.startsWith('+') ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 rotate-180" />}
                   {kpi.change} YoY
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Line/Area Chart */}
         <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-xl font-bold font-heading mb-6">Predictive Trends (On-Time vs Delay)</h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer>
                    <AreaChart data={predictiveTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#53E6D4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#53E6D4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#EBEBED" opacity={0.5} tickLine={false} axisLine={false} />
                        <YAxis stroke="#EBEBED" opacity={0.5} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#342844" vertical={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1A1F23', border: '1px solid #4B4059', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="onTime" stroke="#53E6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorOnTime)" />
                        <Area type="monotone" dataKey="delays" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDelay)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Doughnut Chart */}
         <div className="glass-card p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold font-heading mb-2 w-full text-left">Regional Performance</h2>
            <div className="h-[250px] w-full">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={pieData}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1A1F23', border: '1px solid #4B4059', borderRadius: '8px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
               {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                     <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                     <span className="text-soft-gray">{item.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
