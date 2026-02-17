import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL;

const AuthForms = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [organizations, setOrganizations] = useState([]);

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ORG_ADMIN", // hidden role
    organization: "",
    secretCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoginLoading(true);

    const res = await axios.post(`${API}/api/auth/login`, {
      email: formData.email,
      password: formData.password,
    });

    const { accessToken, refreshToken, user, message } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success(message || "Login successful");

    if (user.role === "SUPER_ADMIN") {
      navigate("/super-admin");
    } else if (user.role === "ORG_ADMIN") {
      navigate("/org-admin");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Login failed"
    );
  } finally {
    setLoginLoading(false);
  }
};

  // ================= FETCH ORGS (NO TOKEN) =================
  const fetchOrganizations = async () => {
  try {
    setOrgLoading(true);

    const res = await axios.get(`${API}/api/orgs`);
    setOrganizations(res.data);

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to fetch organizations"
    );
  } finally {
    setOrgLoading(false);
  }
};


  useEffect(() => {
    if (!isLogin && step === 2) {
      fetchOrganizations();
    }
  }, [step, isLogin]);

  // ================= SIGNUP STEP 1 =================
  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // ================= SIGNUP FINAL =================
  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    setSignupLoading(true);

    const res = await axios.post(
      `${API}/api/auth/signup`,
      formData
    );

    toast.success(res.data.message || "Signup successful!");

    setIsLogin(true);
    setStep(1);

    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "ORG_ADMIN",
      organization: "",
      secretCode: "",
    });

  } catch (err) {
    toast.error(
      err.response?.data?.message || "Signup failed"
    );
  } finally {
    setSignupLoading(false);
  }
};


  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[400px] bg-white p-8 rounded-lg shadow-lg">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* ================= LOGIN UI (UNCHANGED STYLE) ================= */}
        {isLogin && (
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />

            <button
  type="submit"
  disabled={loginLoading}
  className={`py-2 rounded-md text-white flex items-center justify-center gap-2 ${
    loginLoading
      ? "bg-indigo-400"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
>
  {loginLoading && (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  Login
</button>

          </form>
        )}

        {/* ================= SIGNUP STEP 1 ================= */}
        {!isLogin && step === 1 && (
          <form onSubmit={handleNext} className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded-md"
            >
              Next
            </button>
          </form>
        )}

        {/* ================= SIGNUP STEP 2 ================= */}
        {!isLogin && step === 2 && (
          <form onSubmit={handleSignup} className="flex flex-col space-y-4">
            {orgLoading && (
                <p className="text-sm text-gray-500">Loading organizations...</p>
                )}
            <select
              name="organization"
              required
              value={formData.organization}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Select Organization</option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="secretCode"
              placeholder="Enter Secret Code"
              required
              value={formData.secretCode}
              onChange={handleChange}
              className="px-3 py-2 border rounded-md"
            />

            <button
  type="submit"
  disabled={signupLoading}
  className={`py-2 rounded-md text-white flex items-center justify-center gap-2 ${
    signupLoading
      ? "bg-green-400"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {signupLoading && (
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  Complete Signup
</button>

          </form>
        )}

        {/* TOGGLE */}
        <div className="flex justify-center mt-4 space-x-1 text-sm">
          <p>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setStep(1);
            }}
            className="text-indigo-600 font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
