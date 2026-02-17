import { Outlet } from "react-router-dom";
import Header from "./Header";

const PrivateLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateLayout;
