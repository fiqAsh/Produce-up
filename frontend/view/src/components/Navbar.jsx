import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Loading from "./Loading";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/");
    } catch (error) {
      console.log("logout failed", error.response?.data);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="navbar justify-end space-x-4  bg-base-200 shadow-md">
      <button
        onClick={() => navigate("/home")}
        className="btn btn-ghost normal-case text-xl shadow "
      >
        Home
      </button>
      <button
        className="btn btn-ghost normal-case text-xl "
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
