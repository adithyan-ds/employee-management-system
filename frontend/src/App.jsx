import { useState, useEffect } from 'react';

 
// This tells React to use the .env variable, but provides a fallback just in case
const API_URL = import.meta.env.VITE_API_URL ;

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', position: '', salary: '', department: '' });
  const [editingId, setEditingId] = useState(null);
  
  // UX States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [searchQuery, setSearchQuery] = useState('');

  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 3000); 
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setEmployees(data.employees); 
    } catch (err) {
      showNotification('error', 'Failed to fetch employees. Is the backend running?');
      console.error(err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save employee');

      setFormData({ name: '', position: '', salary: '', department: '' });
      setEditingId(null);
      await fetchEmployees(); 
      
      showNotification('success', editingId ? 'Employee updated successfully!' : 'Employee added successfully!');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to save employee. Please try again.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
      department: employee.department
    });
    setEditingId(employee._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

 
  const requestDelete = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

 
  const confirmDelete = async () => {
    if (!deleteModal.employee) return;
    
    const id = deleteModal.employee._id;
    setDeletingId(id); 
    setDeleteModal({ isOpen: false, employee: null }); 

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete employee');
      await fetchEmployees();
      showNotification('success', 'Employee deleted successfully!');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to delete employee.');
    } finally {
      setDeletingId(null); 
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              Are you sure you want to remove <span className="font-bold text-gray-900">{deleteModal.employee?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModal({ isOpen: false, employee: null })}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 relative">
        
        {notification.message && (
          <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-all duration-300 z-50 flex items-center gap-2 ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            {notification.message}
          </div>
        )}

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Employee Management System
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Manage your team directory, roles, and compensation.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden relative">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]"></div>
          )}
          
          <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? 'Edit Employee Details' : 'Add New Employee'}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" name="name" placeholder="e.g. Adithyan DS" 
                    value={formData.name} onChange={handleInputChange} required 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input 
                    type="text" name="position" placeholder="e.g. Web Developer" 
                    value={formData.position} onChange={handleInputChange} required 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($)</label>
                  <input 
                    type="number" name="salary" placeholder="40000" min="0"
                    value={formData.salary} onChange={handleInputChange} required 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input 
                    type="text" name="department" placeholder="e.g. Engineering" 
                    value={formData.department} onChange={handleInputChange} required 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center gap-2
                    ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                    </>
                  ) : (
                    editingId ? 'Save Changes' : 'Add Employee'
                  )}
                </button>
                {editingId && !isSubmitting && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({ name: '', position: '', salary: '', department: '' }); }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">Team Directory</h2>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                {filteredEmployees.length} Members
              </span>
            </div>
            
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          {isInitialLoading ? (
            <div className="p-12 flex flex-col justify-center items-center">
               <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <p className="text-gray-500 font-medium">Loading directory...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-10 text-center text-gray-500 flex flex-col items-center">
               <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p>No employees found. Add one above to get started!</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-10 text-center text-gray-500 flex flex-col items-center">
               <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No employees matched your search "<strong>{searchQuery}</strong>".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm outline-none"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {emp.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${emp.salary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(emp)} 
                          disabled={deletingId === emp._id}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        {/* CHANGED: Now calls requestDelete(emp) instead of handleDelete */}
                        <button 
                          onClick={() => requestDelete(emp)} 
                          disabled={deletingId === emp._id}
                          className="text-red-600 hover:text-red-900 transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                        >
                          {deletingId === emp._id ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Deleting...
                            </>
                          ) : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default App;