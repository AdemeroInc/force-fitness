'use client';

import { useState } from 'react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Lose 10 pounds',
      target: 10,
      current: 3,
      unit: 'lbs',
      deadline: '2024-03-01'
    },
    {
      id: 2,
      title: 'Run 5K',
      target: 5,
      current: 2.5,
      unit: 'km',
      deadline: '2024-02-15'
    }
  ]);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Goals</h1>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Add New Goal
          </button>
        </div>

        <div className="grid gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{goal.title}</h2>
                <span className="text-gray-500">Due: {goal.deadline}</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-1">
                  {calculateProgress(goal.current, goal.target).toFixed(1)}% complete
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}