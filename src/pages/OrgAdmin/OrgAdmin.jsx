import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL;

const OrgAdmin = () => {
  const token = localStorage.getItem("accessToken");

  // ================= TAB STATE =================
  const [activeTab, setActiveTab] = useState("features"); // features | users

  // ================= FEATURE STATES =================
  const [features, setFeatures] = useState([]);
  const [featureKey, setFeatureKey] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= USER STATES =================
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  // ================= FETCH FEATURES =================
  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${API}/api/features`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeatures(res.data);
    } catch (err) {
      toast.error("Fetch features failed");
    }
  };

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Fetch users failed");
    }
  };

  useEffect(() => {
    fetchFeatures();
    fetchUsers();
  }, []);

  // ================= FEATURE CRUD =================
  const handleCreate = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      `${API}/api/features`,
      { featureKey, enabled },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "Feature created successfully");

    setFeatureKey("");
    setEnabled(true);
    setShowForm(false);
    fetchFeatures();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};


  const handleUpdate = async () => {
  try {
    setLoading(true);

    const res = await axios.put(
      `${API}/api/features/${editingId}`,
      { enabled },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "Feature updated successfully");

    setEditingId(null);
    setShowForm(false);
    fetchFeatures();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Update failed"
    );
  } finally {
    setLoading(false);
  }
};


  const confirmDelete = async (id) => {
  try {
    setLoading(true);

    const res = await axios.delete(
      `${API}/api/features/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "Deleted successfully");

    fetchFeatures();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Delete failed"
    );
  } finally {
    setLoading(false);
  }
};


  const handleEditClick = (feature) => {
    setEditingId(feature._id);
    setFeatureKey(feature.featureKey);
    setEnabled(feature.enabled);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFeatureKey("");
    setEnabled(true);
    setShowForm(true);
  };

  // ================= USER CRUD =================
  const handleUserSubmit = async () => {
  try {
    setUserLoading(true);

    let res;

    if (editingUserId) {
      res = await axios.put(
        `${API}/api/users/${editingUserId}`,
        {
          name: userName,
          email: userEmail,
          password: userPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      res = await axios.post(
        `${API}/api/users/create-end-user`,
        {
          name: userName,
          email: userEmail,
          password: userPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    toast.success(res.data.message || "Operation successful");

    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setEditingUserId(null);
    fetchUsers();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Operation failed"
    );
  } finally {
    setUserLoading(false);
  }
};



  const handleDeleteUser = async (id) => {
  try {
    setUserLoading(true);

    const res = await axios.delete(
      `${API}/api/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "User deleted");

    fetchUsers();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Delete failed"
    );
  } finally {
    setUserLoading(false);
  }
};


  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setUserName(user.name);
    setUserEmail(user.email);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* ================= RIGHT SIDE MENU ================= */}
      <div className="w-64 bg-white shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Menu</h2>

        <button
          onClick={() => setActiveTab("features")}
          className={`w-full py-2 rounded ${
            activeTab === "features"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Feature Flag
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`w-full py-2 rounded ${
            activeTab === "users"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          User Management
        </button>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 p-10">

        {/* ================= FEATURE SECTION ================= */}
        {activeTab === "features" && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              Feature Flag Management
            </h2>

            {!showForm && (
              <button
                onClick={handleCreateClick}
                className="bg-indigo-600 text-white px-5 py-2 rounded mb-6"
              >
                + Create Feature
              </button>
            )}

            {showForm && (
              <div className="bg-gray-50 p-6 rounded border mb-8 w-[400px]">
                {!editingId && (
                  <input
                    type="text"
                    placeholder="Feature Key"
                    value={featureKey}
                    onChange={(e) => setFeatureKey(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4"
                  />
                )}

                <div className="flex items-center gap-3 mb-4">
                  <label>Enabled</label>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                  />
                </div>

               <button
  onClick={editingId ? handleUpdate : handleCreate}
  disabled={loading}
  className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
    loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {loading && (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  {editingId ? "Update" : "Create"}
</button>

              </div>
            )}

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">Feature Key</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature._id}>
                    <td className="p-3 border">{feature.featureKey}</td>
                    <td className="p-3 border">
                      {feature.enabled ? "Enabled" : "Disabled"}
                    </td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => handleEditClick(feature)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(feature._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= USER SECTION ================= */}
        {activeTab === "users" && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              User Management
            </h2>

            {/* Form */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="border px-3 py-2 rounded"
              />
             <button
  onClick={handleUserSubmit}
  disabled={userLoading}
  className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
    userLoading
      ? "bg-indigo-400"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {userLoading && (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  {editingUserId ? "Update" : "Create"}
</button>

            </div>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border">{user.role}</td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
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
  );
};

export default OrgAdmin;
