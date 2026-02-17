import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const token = localStorage.getItem("accessToken");

  const [features, setFeatures] = useState([]);
  const [featureKey, setFeatureKey] = useState("");
  const [result, setResult] = useState(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);

  // ================= GET ALL FEATURES =================
  const fetchFeatures = async () => {
    try {
      setLoadingList(true);

      const res = await axios.get(`${API}/api/features`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeatures(res.data);
    } catch (err) {
      toast.error("Failed to load features");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  // ================= CHECK FEATURE =================
  const handleCheck = async () => {
    if (!featureKey) {
      toast.error("Enter or select feature");
      return;
    }

    try {
      setLoadingCheck(true);
      setResult(null);

      const res = await axios.get(`${API}/api/features/check`, {
        params: { featureKey },
        headers: { Authorization: `Bearer ${token}` },
      });

      setResult(res.data);
      toast.success("Feature checked");
    } catch (err) {
      setResult(null);
      toast.error(err.response?.data?.message || "Check failed");
    } finally {
      setLoadingCheck(false);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">End User Dashboard</h1>

      <div className="bg-white p-8 rounded-xl shadow-lg w-[450px] border">
        <h2 className="text-xl font-semibold mb-4">Check Feature</h2>

        {/* DROPDOWN */}
        {loadingList ? (
          <div className="flex justify-center mb-4">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <select
            className="w-full px-3 py-2 border rounded-md mb-3"
            value={featureKey}
            onChange={(e) => setFeatureKey(e.target.value)}
          >
            <option value="">-- Select Feature --</option>
            {features.map((feature) => (
              <option key={feature._id} value={feature.featureKey}>
                {feature.name
                  ? `${feature.name} (${feature.featureKey})`
                  : feature.featureKey}
              </option>
            ))}
          </select>
        )}

        {/* MANUAL INPUT */}
        <input
          type="text"
          placeholder="Or Enter Feature Key"
          value={featureKey}
          onChange={(e) => setFeatureKey(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
        />

        {/* CHECK BUTTON */}
        <button
          onClick={handleCheck}
          disabled={loadingCheck}
          className={`w-full py-2 rounded-md text-white flex items-center justify-center gap-2 ${
            loadingCheck
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loadingCheck && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          Check Feature
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 text-center">
            <p className="mb-2 font-medium">
              Feature: {result.featureKey}
            </p>

            <span
              className={`px-4 py-2 rounded text-white text-sm ${
                result.enabled ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {result.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
