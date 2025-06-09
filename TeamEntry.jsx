// src/pages/TeamEntryPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../appwriteConfig';
import conf from '../conf.js';
import { Query } from 'appwrite';

export default function TeamEntry() {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkTeamExists = async () => {
    setLoading(true);
    setError('');

    try {
      const checkCollections = [
        "68468155003bb289b461",
        "68467ff40019df767bbf",
        "68467e4d000f9df5adfc",
      ];

      for (const collectionId of checkCollections) {
        const res = await databases.listDocuments(
          "68467c4f0003c6ee1aa8",
          collectionId,
          [Query.equal('team', teamName)]
        );
        if (res.documents.length > 0) {
          navigate('/auth', { state: { teamName } });
          return;
        }
      }

      setError('Team not found. Please check your team name.');
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Enter Your Team Name</h1>

        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. MERN"
          className="w-full p-3 border rounded mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={checkTeamExists}
          disabled={loading || !teamName}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}