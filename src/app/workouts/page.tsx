'use client';

import { useState } from 'react';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: 'Morning Push',
      date: '2024-01-15',
      exercises: ['Push-ups', 'Squats', 'Plank'],
      duration: '30 mins'
    },
    {
      id: 2,
      name: 'Cardio Blast',
      date: '2024-01-14',
      exercises: ['Running', 'Jumping Jacks', 'Burpees'],
      duration: '45 mins'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Workouts</h1>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Add New Workout
          </button>
        </div>

        <div className="grid gap-6">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">{workout.name}</h2>
                <span className="text-gray-500">{workout.date}</span>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Exercises:</p>
                <div className="flex flex-wrap gap-2">
                  {workout.exercises.map((exercise, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {exercise}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">Duration: {workout.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}