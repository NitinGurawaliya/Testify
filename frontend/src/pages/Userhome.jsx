import React from 'react';
import UserTestCard from '../components/UserTestCard';
import UserDashnav from "../components/UserDashnav"
import { Heading } from '../components/Heading';

const UserDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16"> {/* Add padding top to offset 
    fixed navbar */}
      <UserDashnav />
      <div className='flex font-bold text-3xl justify-center my-10'>
        User Courses
      </div>
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UserTestCard />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
