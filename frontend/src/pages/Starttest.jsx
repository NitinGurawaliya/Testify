import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from "../config";

const StartTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state;
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleOptionChange = (questionNumber, optionNumber) => {
    setResponses({ ...responses, [questionNumber]: optionNumber });
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when starting submission
    try {
      const requestBody = {
        testId: test.id,
        responses: Object.entries(responses).map(([questionNumber, optionNumber]) => ({
          questionNumber: parseInt(questionNumber, 10),
          optionNumber: parseInt(optionNumber, 10),
        })),
      };

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/test/${test.id}/submit`,
        requestBody,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setResult(res.data.result);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting the test", error.message);
    } finally {
      setLoading(false); // Set loading to false when request is done
    }
  };

  const handleBackToDashboard = () => {
    navigate('/userDashboard'); // Change this to the correct route if different
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div> {/* Add loader styling here */}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Test Submitted</h1>
        <p className="text-lg mb-4">Your score is {result.score}</p>
        <p className="text-lg mb-4">Test Title: {test.title}</p>
        <p className="text-lg mb-4">Number of Questions: {test.questions.length}</p>
        <button
          onClick={handleBackToDashboard}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 rounded-lg shadow-xl mt-20">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">{test.title}</h1>
        <p className="text-lg mb-4">{test.description}</p>
        <p className="text-lg mb-8">Scheduled At: {new Date(test.scheduledAt).toLocaleString()}</p>

        {test.questions.map((question) => (
          <div key={question.id} className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{question.questionText}</h2>
            {question.options.map((option) => (
              <div key={option.id} className="mb-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.questionNumber}`}
                    value={option.optionNumber}
                    onChange={() => handleOptionChange(question.questionNumber, option.optionNumber)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{option.optionText}</span>
                </label>
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default StartTest;
