import { useState } from 'react';
import { alerts } from '../data/mockData';
import { Badge } from '../components/ui';
import { MessageSquare, Send, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function CriticalAlerts() {
  const [selectedAlert, setSelectedAlert] = useState(alerts[0]);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  
  // Sorted by severity logic mock
  const sortedAlerts = [...alerts].sort((a,b) => a.severity === 'Critical' ? -1 : 1);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 stagger-children">
       {/* Alert Queue */}
       <div className="w-full lg:w-[400px] flex flex-col">
          <div className="flex justify-between items-end mb-4">
            <div>
               <h1 className="text-2xl font-heading font-bold text-white">Priority Queue</h1>
               <p className="text-sm text-soft-gray mt-1">Sorted by financial impact ($$)</p>
            </div>
            <Badge variant="critical">{alerts.length} Action Required</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
             {sortedAlerts.map(alert => (
                <div 
                   key={alert.id}
                   onClick={() => setSelectedAlert(alert)}
                   className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${selectedAlert?.id === alert.id ? 'bg-violet-support border-violet-electric shadow-[0_0_15px_rgba(104,60,228,0.2)]' : 'bg-carbon-light border-transparent hover:border-violet-support'}`}
                >
                   <div className={`absolute top-0 left-0 w-1.5 h-full ${alert.severity === 'Critical' ? 'bg-alert-red' : alert.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                   <div className="flex justify-between items-start mb-2 ml-1">
                      <span className="font-bold text-white text-lg leading-none">{alert.type}</span>
                      <span className="text-xs text-soft-gray">{alert.time}</span>
                   </div>
                   <div className="text-sm text-soft-gray mb-3 ml-1 line-clamp-2">{alert.message}</div>
                   <div className="flex justify-between items-center ml-1">
                      <span className="text-xs font-mono text-violet-electric">{alert.shipmentId}</span>
                      <Badge variant={alert.severity}>{alert.severity}</Badge>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Alert Details & Resolution */}
       {selectedAlert ? (
          <div className="flex-1 flex flex-col min-h-0 bg-carbon-light rounded-xl border border-violet-support overflow-hidden animate-slide-right">
             <div className="p-6 border-b border-violet-support bg-carbon/50">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-alert-red/20 flex items-center justify-center mr-4">
                         <AlertOctagon className="w-6 h-6 text-alert-red" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold text-white">{selectedAlert.type}</h2>
                         <div className="text-soft-gray mt-1 flex items-center space-x-3">
                           <span>ID: <strong className="text-white font-mono">{selectedAlert.id}</strong></span>
                           <span>•</span>
                           <span>Shipment: <strong className="text-violet-electric font-mono">{selectedAlert.shipmentId}</strong></span>
                         </div>
                      </div>
                   </div>
                   <button className="btn-primary flex items-center bg-mint text-carbon font-bold hover:bg-mint-dim shadow-[0_0_15px_rgba(83,230,212,0.3)]">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                   </button>
                </div>
                <div className="bg-alert-red/10 border border-alert-red/30 p-4 rounded-lg text-white">
                   {selectedAlert.message}
                </div>
             </div>

             <div className="flex-1 flex overflow-hidden">
                {/* Resolution Timeline */}
                <div className="w-1/2 p-6 overflow-y-auto border-r border-violet-support">
                   <h3 className="text-lg font-heading font-bold mb-6">Resolution Log</h3>
                   <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-violet-support before:to-transparent">
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-mint bg-mint-dim/20 text-mint absolute left-2.5 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 mt-1 shadow-[0_0_10px_rgba(83,230,212,0.4)]"></div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-lg glass-card text-sm">
                             <div className="font-bold text-white mb-1">AI Engine Triggered</div>
                             <div className="text-soft-gray text-xs">System detected anomaly based on weather feeds.</div>
                             <div className="text-violet-electric text-[10px] mt-2 font-mono">{selectedAlert.time}</div>
                          </div>
                      </div>
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-violet-support bg-carbon absolute left-2.5 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 mt-1"></div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-lg bg-carbon border border-violet-support text-sm">
                             <div className="font-bold text-soft-gray mb-1">Awaiting Dispatch...</div>
                          </div>
                      </div>
                   </div>
                </div>

                {/* Dispatch Chat */}
                <div className="w-1/2 flex flex-col bg-carbon/30">
                   <div className="p-4 border-b border-violet-support font-semibold text-white flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-violet-electric" /> Dispatch Portal
                   </div>
                   <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-soft-gray opacity-50 space-y-2">
                           <MessageSquare className="w-8 h-8" />
                           <p className="text-sm text-center">Communicate with driver or regional hub.<br/>Responses will appear here.</p>
                        </div>
                      ) : (
                        messages.map((msg, i) => (
                           <div key={i} className={`flex flex-col max-w-[80%] ${msg.sender === 'System' || msg.sender === 'Driver' ? 'mr-auto items-start' : 'ml-auto items-end'}`}>
                              <div className={`text-xs text-soft-gray mb-1 flex items-center space-x-2`}>
                                 <span>{msg.sender}</span>
                                 <span className="opacity-50">{msg.time}</span>
                              </div>
                              <div className={`p-3 rounded-xl text-sm ${msg.sender === 'System' || msg.sender === 'Driver' ? 'bg-carbon border border-violet-support text-white rounded-tl-none' : 'bg-violet-electric text-white rounded-tr-none'}`}>
                                 {msg.text}
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                   <div className="p-4 border-t border-violet-support bg-carbon-light/80">
                      <div className="relative flex items-center">
                         <input 
                           type="text" 
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter' && chatInput.trim()) {
                               const newMsg = { text: chatInput, sender: 'You', time: new Date().toLocaleTimeString() };
                               setMessages([...messages, newMsg]);
                               setChatInput('');
                               setTimeout(() => {
                                 setMessages(prev => [...prev, { text: "Copy that. Taking the secondary route. ETA delayed by 45 mins.", sender: 'Driver', time: new Date().toLocaleTimeString() }]);
                               }, 1500);
                             }
                           }}
                           placeholder="Type message to driver..."
                           className="w-full bg-carbon border border-violet-support rounded-full pl-5 pr-12 py-3 text-sm text-white focus-ring"
                         />
                         <button className="absolute right-2 p-2 bg-violet-electric text-white rounded-full hover:bg-violet-royal transition-colors" onClick={() => {
                             if (chatInput.trim()) {
                               const newMsg = { text: chatInput, sender: 'You', time: new Date().toLocaleTimeString() };
                               setMessages([...messages, newMsg]);
                               setChatInput('');
                               setTimeout(() => {
                                 setMessages(prev => [...prev, { text: "Copy that. Routing metrics updated.", sender: 'System', time: new Date().toLocaleTimeString() }]);
                               }, 1500);
                             }
                         }}>
                            <Send className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       ) : (
          <div className="flex-1 glass-card flex items-center justify-center text-soft-gray">
             Select an alert to view details and resolution workflow.
          </div>
       )}
    </div>
  );
}
