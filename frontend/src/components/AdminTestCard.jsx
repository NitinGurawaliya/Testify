import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../config";
import { useNavigate } from 'react-router-dom';

const AdminTestCard = () => {
  const navigate = useNavigate();
  const [tests, setTest] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/admin/bulk`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then(res => {
      setTest(res.data);
    })
    .catch(error => {
      console.log("Error fetching the tests", error.message);
    });
  }, []);

  return (
    <>
      {Array.isArray(tests) && tests.length > 0 ? (
        tests.map(test => (
          <div key={test.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">{test.title}</h2>
              <p className="text-gray-600 text-base">{test.description}</p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div className="flex flex-wrap">
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 mr-2 mb-2">
                  Scheduled: {new Date(test.scheduledAt).toLocaleDateString()}
                </span>
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 mb-2">
                  Created: {new Date(test.createdAt).toLocaleDateString()}
                </span>
              </div>
              <ExploreButton 
                onClick={async function(){
                  
                }} 
                label="Edit Test" 
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No tests available</p>
      )}
    </>
  );
}

function ExploreButton({ onClick, label }) {
  return (
    <button 
      onClick={onClick} 
      type="button" 
      className="bg-blue-500 justify-between text-white rounded-full py-2 px-6 text-sm font-semibold shadow-md hover:bg-blue-600 transition-colors">
      {label}
    </button>
  );
}

export default AdminTestCard;
