import React, { useState } from 'react';
import { Searchbar } from './SearchBar';
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon } from '@heroicons/react/24/outline'; // Import MenuIcon from Heroicons v2

const AdminDashnav = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logoutUser() {
    localStorage.removeItem("token");
    navigate("/signin");
  }

  return (
    <nav className="bg-gray-100 border-gray-200 flex justify-between items-center fixed top-0 left-0 right-0 p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black font-bold text-xl">Testify</div>
        <div className="flex flex-1 justify-center">
          <Searchbar />
        </div>
        <div className="hidden md:flex flex-1 justify-center items-center">
          <Link to={"/createcourse"}>
            <button className="font-bold text-xl">Create Test</button>
          </Link>
        </div>
        <div className="hidden md:flex p-4 bg-black text-white rounded-full">
          <button onClick={logoutUser}>Logout</button>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Bars3Icon className="h-6 w-6 text-black" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 w-full bg-gray-100 shadow-lg">
          <div className="flex flex-col items-center p-4">
            <Link to={"/createcourse"} className="w-full text-center py-2">
              <button className="font-bold text-xl w-full">Create Test</button>
            </Link>
            <button onClick={logoutUser} className="w-full text-center py-2 font-bold text-xl bg-black text-white rounded-full">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminDashnav;
  