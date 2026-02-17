import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/");
  };

  return (
    <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">
       Welcome 
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
