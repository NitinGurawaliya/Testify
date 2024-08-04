import React, { useState } from 'react';
import { Searchbar } from './SearchBar';
import { Link, useNavigate } from "react-router-dom";

 const UserDashnav = () => {
  const navigate = useNavigate();

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
        
        <div className="p-4 bg-black text-white rounded-full">
          <button onClick={logoutUser}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default UserDashnav;
