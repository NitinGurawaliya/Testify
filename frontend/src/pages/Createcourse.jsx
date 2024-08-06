import React, { useState } from 'react';
import { AuthButton } from '../components/Buttons';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import {useNavigate} from "react-router-dom"

const CreateTestForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', options: [{ optionText: '', isCorrect: false }] }]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Move useNavigate outside of handlers

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index][name] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const { name, value, type, checked } = event.target;
    const updatedQuestions = [...questions];
    if (type === 'checkbox') {
      updatedQuestions[qIndex].options[oIndex][name] = checked;
    } else {
      updatedQuestions[qIndex].options[oIndex][name] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [{ optionText: '', isCorrect: false }] }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push({ optionText: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = {
      title,
      description,
      scheduledAt,
      questions: questions.map((question) => ({
        questionText: question.questionText,
        options: question.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      })),
    };

    console.log('Sending payload:', JSON.stringify(formData, null, 2));

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/admin/test`, formData, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`, // Added 'Bearer ' prefix
        },
      });
      console.log('Test created:', response.data);
      navigate("/adminDashboard");
    } catch (error) {
      console.error('Error response:', error.response);
      setError(error.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Create New Test</h1>
      {error && <div className="text-red-600 mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">{error}</div>}
      <form className="space-y-8">
        <div className="flex flex-col space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              placeholder="Test Title"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              placeholder="Test Description"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Scheduled At</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="block w-full border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border border-gray-300 p-6 rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Question {questionIndex + 1}</h2>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(questionIndex)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                Remove Question
              </button>
            </div>
            <input
              type="text"
              name="questionText"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
              className="block w-full border-gray-300 rounded-lg shadow-sm mb-4 p-4 bg-gray-50 border focus:ring-2 focus:ring-blue-500"
              placeholder="Question Text"
              required
            />
            <div className="space-y-4">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <input
                    type="text"
                    name="optionText"
                    value={option.optionText}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                    className="block w-full rounded-lg shadow-sm mr-4 p-3 bg-gray-50 border border-blue-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="Option Text"
                    required
                  />
                  <input
                    type="checkbox"
                    name="isCorrect"
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Correct</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                    className="text-red-500 ml-4 hover:text-red-700"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddOption(questionIndex)}
                className="text-blue-500 hover:text-blue-700 text-lg"
              >
                Add Option
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="text-blue-500 hover:text-blue-700 text-lg"
        >
          Add Question
        </button>

        <AuthButton onClick={handleSubmit} label={"Upload test"} />
      </form>
    </div>
  );
};

export default CreateTestForm;
