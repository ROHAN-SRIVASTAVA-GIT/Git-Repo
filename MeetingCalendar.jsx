// src/components/Calendar.jsx
import { useEffect, useState } from 'react';
import { databases } from '../appwriteConfig';
import { Query } from 'appwrite';

export default function MeetingCalendar({ teamName }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const databaseId = "68467c4f0003c6ee1aa8";          
  const collectionId = "684682ba0001711a5989";               

  useEffect(() => {
    if (!teamName) return;

    const fetchMeetings = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.equal('teamNam', teamName)]
        );
        setMeetings(response.documents);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [teamName]);

  if (loading) return <p>Loading team meetings...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Meetings for Team: {teamName}</h2>

      {meetings.length === 0 ? (
        <p>No meetings scheduled.</p>
      ) : (
        <ul className="space-y-3">
          {meetings.map(meeting => (
            <li key={meeting.$id} className="bg-white p-4 shadow rounded-md">
              <p><strong>Room:</strong> {meeting.roomNam}</p>
              <p><strong>Start:</strong> {new Date(meeting.start).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(meeting.end).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Created by: {meeting.createdBy}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
