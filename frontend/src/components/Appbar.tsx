import React, { useState } from "react";
import { Link, useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "./Tooltip";
import { useSearch } from "../context/search";

const AppBar: React.FC = ({}) => {
  const { auth, setAuth } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate: NavigateFunction = useNavigate();

  const handleLogout = (): void => {
    setAuth(null);
    localStorage.removeItem("auth");
    navigate("/");
    toast.success(`User ${auth?.user?.username} Logged out successfully`, {
      position: "bottom-left",
    });
  };
  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="text-white">
          Home
        </Link>
        <Link to={`/profile/${auth?.user?._id}`} className="text-white">
          Profile
        </Link>
        <Link to="#" onClick={handleLogout} className="text-white">
          Logout
        </Link>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 rounded-md"
        />
        <Tooltip text="Add todo">
          <FontAwesomeIcon
            onClick={() => navigate("/addTodo")}
            icon={faAdd}
            color="white"
            className="mt-1 cursor-pointer"
          />
        </Tooltip>
      </div>
      <Tooltip text={auth?.user?.username}>
        <img
          src={auth?.user?.profilePic}
          alt="Profile"
          className="rounded-full h-10 w-10 object-cover cursor-pointer"
        />
      </Tooltip>
    </div>
  );
};

export default AppBar;
