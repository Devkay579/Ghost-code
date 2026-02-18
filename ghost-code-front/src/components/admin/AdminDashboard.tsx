import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0, averageScore: 0, topScores: [] });

  useEffect(() => {
    adminService.getUsers().then(setUsers);
    adminService.getSessions().then(setSessions);
    adminService.getStats().then(setStats);
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400">Total Users</p>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400">Total Sessions</p>
          <p className="text-3xl">{stats.totalSessions}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400">Avg Score</p>
          <p className="text-3xl">{stats.averageScore.toFixed(1)}</p>
        </div>
      </div>

      <h2 className="text-2xl mb-4">Users</h2>
      <div className="bg-gray-900 rounded-lg overflow-x-auto mb-8">
        <table className="w-full text-left">
          <thead className="bg-green-900">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Games</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-green-800">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.isAdmin ? '✅' : '❌'}</td>
                <td className="p-3">{u.gameSessions.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl mb-4">Recent Sessions</h2>
      <div className="bg-gray-900 rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-green-900">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Score</th>
              <th className="p-3">Accuracy</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s: any) => (
              <tr key={s.id} className="border-t border-green-800">
                <td className="p-3">{s.user.username}</td>
                <td className="p-3 capitalize">{s.difficulty}</td>
                <td className="p-3">{s.score}</td>
                <td className="p-3">{s.accuracy?.toFixed(1)}%</td>
                <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;