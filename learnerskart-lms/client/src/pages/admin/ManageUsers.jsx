import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Search, Shield, Ban, CheckCircle, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
        setFiltered(res.data.users);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load user directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...users];

    if (search.trim() !== '') {
      result = result.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== 'All') {
      result = result.filter(u => u.role === roleFilter);
    }

    setFiltered(result);
  }, [search, roleFilter, users]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${id}`, { role: newRole });
      if (res.data.success) {
        toast.success(`Role updated successfully to ${newRole}`);
        setUsers(prev => 
          prev.map(u => u._id === id ? { ...u, role: newRole } : u)
        );
      }
    } catch (err) {
      toast.error('Failed to update role.');
    }
  };

  const handleToggleSuspend = async (id, isSuspended) => {
    try {
      const res = await api.patch(`/admin/users/${id}`, { isSuspended: !isSuspended });
      if (res.data.success) {
        toast.success(!isSuspended ? 'Account suspended.' : 'Account activated.');
        setUsers(prev => 
          prev.map(u => u._id === id ? { ...u, isSuspended: !isSuspended } : u)
        );
      }
    } catch (err) {
      toast.error('Operation failed.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left select-none">
        <h1 className="text-2xl font-black text-slate-800">User Management</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Configure account access permissions, verify coaches, or suspend logins.</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-sm select-none">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl w-full md:w-85">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-700 w-full placeholder:text-slate-400 font-medium"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-200 px-3 py-2 text-xs font-bold rounded-xl outline-none bg-white text-slate-600 w-full md:w-fit"
        >
          <option value="All">All Roles</option>
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* USER LIST TABLE */}
      {loading ? (
        <div className="p-16 flex justify-center bg-white border border-slate-100 rounded-panel">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 bg-white border border-slate-100 rounded-panel text-slate-400 text-center">
          <ShieldAlert size={42} className="mx-auto text-slate-200 mb-2" />
          <h3 className="font-extrabold text-slate-700 text-sm">No accounts found matching filters</h3>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-panel shadow-sm overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500">
              <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-100 select-none">
                <tr>
                  <th className="px-5 py-3">Account Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">System Role</th>
                  <th className="px-5 py-3">Access Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-bold text-slate-700">{u.name}</td>
                    <td className="px-5 py-4 text-slate-400">{u.email}</td>
                    <td className="px-5 py-4 select-none">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="border border-slate-250 bg-white text-slate-700 px-2 py-1 rounded-md text-[11px] font-semibold outline-none"
                      >
                        <option value="learner">Learner</option>
                        <option value="instructor">Instructor</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 select-none">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase tracking-wider ${
                        u.isSuspended 
                          ? 'bg-red-50 text-red-500 border border-red-100' 
                          : 'bg-success/15 text-success'
                      }`}>
                        {u.isSuspended ? 'Suspended 🚫' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right select-none">
                      <button
                        onClick={() => handleToggleSuspend(u._id, u.isSuspended)}
                        className={`text-[10px] font-bold hover:underline ${
                          u.isSuspended ? 'text-success' : 'text-red-500'
                        }`}
                      >
                        {u.isSuspended ? 'Activate Account' : 'Suspend Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
