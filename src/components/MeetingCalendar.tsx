import { useState, useEffect } from 'react'; // Fix: Added useEffect import
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// TypeScript interface to define our data structure
interface Meeting {
  id: number;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Declined';
}

const MeetingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // 1. DATA PERSISTENCE: Load saved data from the browser's memory
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('nexus_meetings');
    return saved ? JSON.parse(saved) : [];
  });

  const [availableTimes, setAvailableTimes] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexus_slots');
    return saved ? JSON.parse(saved) : ["09:00 AM", "11:00 AM", "02:00 PM"];
  });

  const [newSlot, setNewSlot] = useState("");

  // 2. AUTO-SAVE: Save to memory whenever meetings or slots change
  useEffect(() => {
    localStorage.setItem('nexus_meetings', JSON.stringify(meetings));
    
    // Custom Event to update the dashboard "Pending" count
    const pendingCount = meetings.filter(m => m.status === 'Pending').length;
    window.dispatchEvent(new CustomEvent('update-pending-count', { detail: pendingCount }));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('nexus_slots', JSON.stringify(availableTimes));
  }, [availableTimes]);

  // 3. MODIFY SLOTS LOGIC (Milestone 2 Requirement)
  const addSlot = () => {
    if (newSlot.trim() !== "" && !availableTimes.includes(newSlot)) {
      setAvailableTimes([...availableTimes, newSlot]);
      setNewSlot("");
    }
  };

  const deleteSlot = (timeToDelete: string) => {
    setAvailableTimes(availableTimes.filter(t => t !== timeToDelete));
  };

  // 4. MEETING ACTIONS
  const requestMeeting = (time: string) => {
    const newMeeting: Meeting = {
      id: Date.now(),
      date: selectedDate.toDateString(),
      time: time,
      status: 'Pending'
    };
    setMeetings([...meetings, newMeeting]);
  };

  const updateStatus = (id: number, newStatus: 'Confirmed' | 'Declined') => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const confirmedMeetings = meetings.filter(m => m.status === 'Confirmed');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ADD/MODIFY SLOTS SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Manage Availability</h2>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="Add time (e.g. 05:00 PM)"
            className="flex-1 border border-slate-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={addSlot} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Slot
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTimes.map(time => (
            <div key={time} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
              <span className="text-sm font-semibold">{time}</span>
              <button onClick={() => deleteSlot(time)} className="hover:text-red-500 font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CALENDAR & SCHEDULING */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Select a Date</h2>
          <Calendar 
            onChange={(d) => setSelectedDate(d as Date)} 
            value={selectedDate}
            className="w-full border-none"
          />
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Available Times</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableTimes.map(time => (
                <button 
                  key={time} 
                  onClick={() => requestMeeting(time)}
                  className="p-2 text-sm border border-slate-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-all"
                >
                  Request {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONFIRMED MEETINGS DASHBOARD (Milestone 2 Requirement) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-green-700 mb-4">Confirmed Meetings</h2>
          <div className="space-y-3">
            {confirmedMeetings.length > 0 ? (
              confirmedMeetings.map(m => (
                <div key={m.id} className="p-4 bg-green-50 border border-green-100 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-green-900">{m.date}</p>
                    <p className="text-sm text-green-700">{m.time}</p>
                  </div>
                  <div className="bg-green-200 text-green-800 text-[10px] px-2 py-1 rounded font-black">CONFIRMED</div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic text-center py-10">No confirmed meetings yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* PENDING REQUESTS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">All Meeting Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100">
                <th className="pb-3">Details</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {meetings.map(m => (
                <tr key={m.id}>
                  <td className="py-4">
                    <div className="font-medium text-slate-700">{m.date}</div>
                    <div className="text-slate-500 text-xs">{m.time}</div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      m.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                      m.status === 'Declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    {m.status === 'Pending' && (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => updateStatus(m.id, 'Confirmed')} className="text-green-600 hover:font-bold">Accept</button>
                        <button onClick={() => updateStatus(m.id, 'Declined')} className="text-red-600 hover:font-bold">Decline</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MeetingCalendar;