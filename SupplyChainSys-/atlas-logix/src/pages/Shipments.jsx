import { useState, useEffect } from 'react';
import { Badge, Modal } from '../components/ui';
import { Search, Filter, ChevronDown, FileText, User, PlusCircle } from 'lucide-react';
// Fallback local shipments if backend fails
import { shipments as initialShipments } from '../data/mockData';

export default function Shipments() {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [masterList, setMasterList] = useState(initialShipments);
  
  const [newShipment, setNewShipment] = useState({
    origin: '',
    destination: '',
    cargo: ''
  });

  // Fetch true DB shipments on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/shipments', {
       headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
       }
    })
    .then(res => res.json())
    .then(data => {
       if (data.success && data.data && data.data.length > 0) {
          // Transform DB object to match UI
          const formatted = data.data.map(s => ({
             id: s._id.slice(-6).toUpperCase(),
             originalId: s._id,
             destination: s.destination,
             driver: 'Auto Dispatch', 
             status: s.status,
             eta: s.route?.[0]?.estimatedArrival || 'TBD',
             risk: s.riskScore > 0.7 ? 'Severe' : s.riskScore > 0.4 ? 'High' : 'Low',
             cargo: s.origin + ' Cargo'
          }));
          setMasterList(formatted);
       }
    })
    .catch(err => console.log('Using mock shipments'));
  }, []);

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/shipments/create', {
        method: 'POST',
        headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          origin: newShipment.origin,
          destination: newShipment.destination,
          currentLocation: { lat: 34.05, long: -118.24 } // Default origin coords (LA)
        }),
      });
      const data = await res.json();
      if (data.success) {
         setMasterList([{
           id: data.data._id.slice(-6).toUpperCase(),
           destination: data.data.destination,
           driver: 'Pending Dispatch',
           status: data.data.status,
           eta: 'TBD',
           risk: 'Low',
           cargo: newShipment.cargo || 'General Freight'
         }, ...masterList]);
         setShowCreate(false);
         setNewShipment({ origin: '', destination: '', cargo: '' });
         alert("Shipment successfully tracked in the database.");
      } else {
         alert("Failed to create. Are you logged in?");
      }
    } catch (err) {
      alert("Error reaching backend. Note: Login to the database first through top right corner.");
    }
  };

  return (
    <div className="stagger-children max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
           <h1 className="text-3xl font-heading font-bold text-white tracking-wide">Master Shipments</h1>
           <p className="text-soft-gray mt-1">Global database of all active and scheduled logistics.</p>
        </div>
        <button className="btn-primary flex items-center" onClick={() => setShowCreate(true)}>
           <PlusCircle className="w-4 h-4 mr-2" /> Create Tracked Shipment
        </button>
      </header>

      {/* Database Controls */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
            <input 
              type="text" 
              placeholder="Search ID, destination, or driver..." 
              className="w-full bg-carbon border border-violet-support rounded-lg pl-10 pr-4 py-2.5 text-white focus-ring transition-colors focus:border-violet-electric"
            />
         </div>
      </div>

      {/* Master Data Table */}
      <div className="glass-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full data-table text-left border-collapse">
               <thead>
                 <tr className="bg-carbon-light/50 border-b border-violet-support text-soft-gray uppercase text-xs tracking-wider">
                   <th className="py-4 px-6 font-semibold">BOL ID</th>
                   <th className="py-4 px-6 font-semibold">Destination Corridor</th>
                   <th className="py-4 px-6 font-semibold">Driver / Asset</th>
                   <th className="py-4 px-6 font-semibold">Cargo</th>
                   <th className="py-4 px-6 font-semibold">ETA</th>
                   <th className="py-4 px-6 font-semibold">Status</th>
                 </tr>
               </thead>
               <tbody>
                  {masterList.map((s) => (
                    <tr 
                       key={s.id} 
                       className="border-b border-white/5 cursor-pointer hover:bg-violet-support/30 transition-colors"
                       onClick={() => setSelectedShipment(s)}
                    >
                      <td className="py-4 px-6 font-mono text-violet-electric font-medium">{s.id}</td>
                      <td className="py-4 px-6 font-medium text-white">{s.destination}</td>
                      <td className="py-4 px-6 flex items-center">
                          <div className="w-6 h-6 rounded-full bg-violet-hover flex items-center justify-center mr-2 text-[10px] font-bold">{s.driver.charAt(0)}</div>
                          {s.driver}
                      </td>
                      <td className="py-4 px-6 text-soft-gray">{s.cargo}</td>
                      <td className="py-4 px-6 text-soft-gray">{s.eta}</td>
                      <td className="py-4 px-6"><Badge variant={s.status}>{s.status}</Badge></td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Add Shipment Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Tracked Shipment">
         <form onSubmit={handleCreateShipment} className="space-y-4">
            <div>
               <label className="block text-soft-gray text-sm mb-1">Origin City/Hub</label>
               <input type="text" required value={newShipment.origin} onChange={e => setNewShipment({...newShipment, origin: e.target.value})} className="w-full bg-carbon border border-violet-support rounded px-3 py-2 text-white focus-ring" placeholder="e.g. LAX Hub" />
            </div>
            <div>
               <label className="block text-soft-gray text-sm mb-1">Destination City/Hub</label>
               <input type="text" required value={newShipment.destination} onChange={e => setNewShipment({...newShipment, destination: e.target.value})} className="w-full bg-carbon border border-violet-support rounded px-3 py-2 text-white focus-ring" placeholder="e.g. JFK Hub" />
            </div>
            <div>
               <label className="block text-soft-gray text-sm mb-1">Cargo Description</label>
               <input type="text" required value={newShipment.cargo} onChange={e => setNewShipment({...newShipment, cargo: e.target.value})} className="w-full bg-carbon border border-violet-support rounded px-3 py-2 text-white focus-ring" placeholder="e.g. Lithium Batteries" />
            </div>
            <button type="submit" className="btn-primary w-full mt-4">Save & Track on Database</button>
         </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedShipment} onClose={() => setSelectedShipment(null)} title="Shipment Details">
         {selectedShipment && (
            <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-mono text-violet-electric font-bold mb-1">{selectedShipment.id}</h4>
                    <p className="text-soft-gray">Bill of Lading: BOL-9948271</p>
                  </div>
                  <Badge variant={selectedShipment.status}>{selectedShipment.status}</Badge>
               </div>
               
               {/* Rest of the UI same as before */}
               <div className="grid grid-cols-2 gap-4">
                   <div className="glass-card p-4 bg-carbon-light/50">
                      <div className="flex items-center text-mint mb-2"><User className="w-4 h-4 mr-2" /> Driver</div>
                      <div className="font-semibold text-white text-lg">{selectedShipment.driver}</div>
                   </div>
                   <div className="glass-card p-4 bg-carbon-light/50">
                      <div className="flex items-center text-mint mb-2"><FileText className="w-4 h-4 mr-2" /> Cargo Spec</div>
                      <div className="font-semibold text-white text-lg">{selectedShipment.cargo}</div>
                   </div>
               </div>
            </div>
         )}
      </Modal>
    </div>
  );
}
