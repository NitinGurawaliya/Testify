import React from 'react';
import AdminTestCard from '../components/AdminTestCard';
import AdminDashnav from "../components/AdminDashnav"

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16"> {/* Add padding top to offset fixed navbar */}
      <AdminDashnav />
      <div className="flex-1 p-4">
      <div className='flex font-bold text-3xl justify-center my-10'>
        Created Courses
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
       
          <AdminTestCard />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
