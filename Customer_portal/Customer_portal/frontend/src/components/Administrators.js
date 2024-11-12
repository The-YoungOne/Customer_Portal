import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the custom api instance
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', idNumber: '', username: '', accountNumber: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editAdminId, setEditAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch all admins from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/user/admins'); // Using api.get
        setAdmins(response.data);
      } catch (error) {
        setError('Failed to fetch admins. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  // Add a new admin
  const handleAddAdmin = async () => {
    if (isEditing) {
      handleEditAdmin();
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post('/api/user/admins', newAdmin);
      setAdmins([...admins, response.data.admin]);
      setNewAdmin({ name: '', idNumber: '', username: '', accountNumber: '', password: '' });
      setSubmitStatus('Admin added successfully.');
      setShowForm(false);
    } catch (error) {
      setError('Failed to add admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit an existing admin
  const handleEditAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(`/api/user/admins/${editAdminId}`, newAdmin);
      setAdmins(
        admins.map((admin) =>
          admin._id === editAdminId ? { ...admin, ...response.data.admin } : admin
        )
      );
      setNewAdmin({ name: '', idNumber: '', username: '', accountNumber: '', password: '' });
      setSubmitStatus('Admin updated successfully.');
      setIsEditing(false);
      setEditAdminId(null);
      setShowForm(false);
    } catch (error) {
      setError('Failed to update admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare the form for editing an admin
  const handleEditClick = (admin) => {
    setNewAdmin(admin);
    setIsEditing(true);
    setEditAdminId(admin._id);
    setShowForm(true);
  };

  // Delete an admin
  const handleDeleteAdmin = async (adminId) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/user/admins/${adminId}`);
      setAdmins(admins.filter((admin) => admin._id !== adminId));
      setSubmitStatus('Admin deleted successfully.');
    } catch (error) {
      setError('Failed to delete admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administrator Management</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setNewAdmin({ name: '', idNumber: '', username: '', accountNumber: '', password: '' });
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Admin
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && <div className="text-blue-500 mb-4">Loading...</div>}

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {submitStatus && <div className="text-green-500 mb-4">{submitStatus}</div>}

      <div className="rounded-md border border-gray-200 overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.idNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(admin)}
                      className="inline-flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm transition-colors"
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conditionally render the form only when adding or editing */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Admin' : 'Add New Admin'}</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newAdmin.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={newAdmin.idNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={newAdmin.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={newAdmin.accountNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
            )}
            <button
              type="button"
              onClick={isEditing ? handleEditAdmin : handleAddAdmin}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              {isEditing ? 'Update Admin' : 'Add Admin'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
