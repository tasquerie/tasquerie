// Upcoming Tasks displays the most pressing tasks that the user has. They 
// are ordered by deadline, with most recent at the top. The amount of 
// upcoming tasks displayed may or may not be variable. When a task here is 
// clicked on, the user should be brought to the Egg that the task belongs to 
// (or the Task Basket if the task does not belong to an Egg).
import React from 'react';

interface Task {
  id: number;
  title: string;
  deadline: string;
}

interface UpcomingTasksProps {
  tasks: Task[];
}

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks }) => {
  return (
    <div>
      <h2>Upcoming Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - Deadline: {task.deadline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingTasks;
