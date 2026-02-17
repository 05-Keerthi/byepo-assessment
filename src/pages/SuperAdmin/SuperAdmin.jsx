import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL;

const SuperAdmin = () => {
  const token = localStorage.getItem("accessToken");

  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ================= FETCH =================
  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${API}/api/orgs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrganizations(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Fetch failed");
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/orgs`,
        { name, adminEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Created successfully");

      setName("");
      setAdminEmail("");
      setShowForm(false);
      fetchOrganizations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${API}/api/orgs/${editingId}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Updated successfully");

      setEditingId(null);
      setName("");
      setShowForm(false);
      fetchOrganizations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const confirmDelete = async (id) => {
    try {
      const res = await axios.delete(`${API}/api/orgs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Deleted successfully");
      setDeleteId(null);
      fetchOrganizations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ================= EDIT CLICK =================
  const handleEditClick = (org) => {
    setEditingId(org._id);
    setName(org.name);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setName("");
    setAdminEmail("");
    setShowForm(true);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

      {!showForm && (
        <button
          onClick={handleCreateClick}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md mb-6 hover:bg-indigo-700 transition"
        >
          + Create Organization
        </button>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 w-[400px] border">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Organization" : "Create Organization"}
          </h2>

          <input
            type="text"
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-3"
          />

          {!editingId && (
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-3"
            />
          )}

          <div className="flex gap-3">
            <button
              onClick={editingId ? handleUpdate : handleCreate}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {editingId ? "Update" : "Create"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= ORGANIZATION LIST ================= */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Organizations</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Secret Code</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org._id}>
                <td className="p-2 border">{org.name}</td>
                <td className="p-2 border">{org.secretCode}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEditClick(org)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  {deleteId === org._id ? (
                    <>
                      <button
                        onClick={() => confirmDelete(org._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteId(org._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdmin;
