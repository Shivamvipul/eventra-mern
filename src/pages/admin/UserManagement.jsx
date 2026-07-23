import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = (params = {}) => adminService.getUsers(params).then((res) => setUsers(res.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const toggleActive = async (u) => {
    try {
      await adminService.updateUser(u._id, { isActive: !u.isActive });
      toast.success('User updated');
      load({ search });
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">User Management</h1>
      <div className="mb-4 max-w-sm">
        <SearchBar placeholder="Search users..." onSearch={(s) => { setSearch(s); load({ search: s }); }} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50 dark:border-paper/10 dark:text-paper/50">
              <th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink/5 dark:border-paper/5">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role.replace('_', ' ')}</td>
                <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => toggleActive(u)} className="text-primary-500 hover:underline">
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
