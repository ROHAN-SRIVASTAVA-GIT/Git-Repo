// src/pages/AuthPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { account, databases } from '../appwriteConfig';
import { ID, Query } from 'appwrite';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const teamName = location.state?.teamName || '';
  
  const [role, setRole] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamName) {
      navigate('/');
    } else {
      detectRole(teamName);
    }
  }, [teamName]);

  const detectRole = async (team) => {
    try {
      const lead = await databases.listDocuments(
        "68467c4f0003c6ee1aa8",
        "68467ff40019df767bbf",
        [Query.equal('team', team)]
      );
      if (lead.documents.length > 0) return setRole('lead');

      const admin = await databases.listDocuments(
        "68467c4f0003c6ee1aa8",
        "68468155003bb289b461",
        [Query.equal('team', team)]
      );
      if (admin.documents.length > 0) return setRole('admin');

      const user = await databases.listDocuments(
        "68467c4f0003c6ee1aa8",
        "68467e4d000f9df5adfc",
        [Query.equal('team', team)]
      );
      if (user.documents.length > 0) return setRole('user');

      setError('Team not found!');
    } catch (err) {
      setError('Error detecting role');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        const userId = ID.unique();
        await account.create(userId, form.email, form.password, form.name);

        const collectionId =
          role === 'admin'
            ? "68468155003bb289b461"
            : role === 'lead'
            ? "68467ff40019df767bbf"
            : "68467e4d000f9df5adfc";

        await databases.createDocument("68467c4f0003c6ee1aa8", collectionId, ID.unique(), {
          name: form.name,
          email: form.email,
          phone: form.phone,
          team: teamName,
          role: role,
        });

        await account.createEmailPasswordSession(form.email, form.password);
        sessionStorage.setItem('teamName', teamName);
        routeUser(role);
      } else {
        await account.createEmailPasswordSession(form.email, form.password);
        sessionStorage.setItem('teamName', teamName);
        routeUser(role);
      }
    } catch (err) {
      setError(err.message || 'Error in auth');
    }
  };

  const routeUser = (role) => {
    if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'lead') navigate('/lead-dashboard');
    else navigate('/user-dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Login'} ({role})</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {isSignup && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border mb-2 rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border mb-2 rounded"
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border mb-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 w-full rounded hover:bg-blue-700"
        >
          {isSignup ? 'Register' : 'Login'}
        </button>

        <p className="text-sm mt-4 text-center">
          {isSignup ? 'Already have an account?' : 'New user?'}{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}