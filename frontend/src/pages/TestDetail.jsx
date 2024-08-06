import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const TestDetail = () => {
  const navigate = useNavigate()
  const { testId } = useParams();
  const [test, setTest] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/admin/test/${testId}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then(res => {
      setTest(res.data);
    })
    .catch(error => {
      console.log("Error fetching the test details", error.message);
    });
  }, [testId]);

  if (!test) {
    return <p>Loading...</p>;
  }

  const handleBackToDashboard = ()=>{
    navigate("/adminDashboard")

  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">{test.title}</h1>
      <p className="mb-6 text-gray-600">{test.description}</p>
      <p className="mb-6 text-gray-600">Scheduled At: {new Date(test.scheduledAt).toLocaleString()}</p>

      <div className="space-y-6">
        {test.questions.map((question, index) => (
          <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{question.questionText}</h2>
            <ul className="space-y-2">
              {question.options.map((option, idx) => (
                <li key={idx} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${option.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-gray-700">{option.optionText}</span>
                </li>
              ))}
            </ul>
            <div>
              
            </div>
            
          </div>
          
        ))}
      </div>
      <div className='flex justify-center'>
      <button
          onClick={handleBackToDashboard}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition mt-6"
        >
          Back to Dashboard
        </button>
        </div>

    </div>
  );
};

export default TestDetail;
