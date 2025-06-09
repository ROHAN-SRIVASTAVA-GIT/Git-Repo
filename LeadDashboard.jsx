import { useState } from 'react';
import MeetingCalendar from '../../components/MeetingCalendar';

export default function LeadDashboard() {
  const [events, setEvents] = useState([]);

  const handleAddMeeting = () => {
    // Trigger modal or form (not implemented here)
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Team Lead Dashboard</h2>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleAddMeeting}
      >
        Add Meeting
      </button>
      <MeetingCalendar events={events} onSelectEvent={(event) => console.log(event)} />
    </div>
  );
}
