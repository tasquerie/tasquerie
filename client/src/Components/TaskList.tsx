import React, { useState } from 'react';

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    deadline: string; // Add the deadline property here
  }
  

const TaskList: React.FC = () => { // Subject to change with data
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Task 1', description: 'Description for Task 1', completed: false , deadline: '12-23-2024'},
    { id: 2, title: 'Task 2', description: 'Description for Task 2', completed: false , deadline: '12-24-2024'},
  ]);

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: `Task ${tasks.length + 1}`,
      description: `Description for Task ${tasks.length + 1}`,
      deadline: 'deadline format month-day-year',
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (taskId: number) => { // TaskID subject to change
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const sortTasksByTitle = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    setTasks(sortedTasks);
  };

  const sortTasksByCompletion = () => {
    const sortedTasks = [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    setTasks(sortedTasks);
  };

  return ( // Also need add task page
    <div>
      <h2>Task List</h2>
      <button onClick={addTask}>Add New Task</button> 
      <button onClick={sortTasksByTitle}>Sort by Title</button>
      <button onClick={sortTasksByCompletion}>Sort by Completion</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }} onClick={() => toggleTaskCompletion(task.id)}>
            {task.title} - {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
