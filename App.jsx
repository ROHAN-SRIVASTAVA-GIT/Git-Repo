import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamEntry from './pages/TeamEntry';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import LeadDashboard from './pages/Dashboard/LeadDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeamEntry />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/lead-dashboard" element={<LeadDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

