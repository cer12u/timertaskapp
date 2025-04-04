"use client";

import React, { useState, useEffect, useRef } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  timeSpent: number;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "タスク1", completed: false, timeSpent: 0 },
    { id: 2, title: "タスク2", completed: false, timeSpent: 0 },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      timeSpent: 0
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTaskTime = (taskId: number, timeSpent: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, timeSpent } : task
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">タスク一覧</h2>
        
        <div className="flex">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="新しいタスクを入力"
            className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            追加
          </button>
        </div>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {tasks.map(task => (
          <li key={task.id} className="py-4">
            <TaskItem 
              task={task} 
              onToggle={toggleTaskCompletion} 
              onTimeUpdate={(time) => updateTaskTime(task.id, time)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onTimeUpdate: (time: number) => void;
}

export function TaskItem({ task, onToggle, onTimeUpdate }: TaskItemProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span className={`ml-3 text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatTime(timeSpent)}
        </div>
        <button
          onClick={toggleTimer}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isRunning 
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100' 
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-100'
          }`}
        >
          {isRunning ? '停止' : '開始'}
        </button>
      </div>
    </div>
  );
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}
