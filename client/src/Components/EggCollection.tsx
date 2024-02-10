// An area that displays the user’s collection of currently active Eggs. 
// If there are too many Eggs to display on the screen at once and fit within
// the area, users should be able to scroll. When the user clicks on an Egg, 
// they are taken to the egg view.
// Among this collection should also be an option to add a new Egg.
// Optionally, a user should be able to see any alerts (in the form of 
// notification icons) for certain eggs in this component.

import React, { Component } from 'react';

interface Task {
  id: number;
  title: string;
  photoUrl: string;
}

interface TaskCollectionProps {
  tasks: Task[];
}

class TaskCollection extends Component<TaskCollectionProps> {
  render() {
    const { tasks } = this.props;

    return (
      <div>
        <h2>Task Collection</h2>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <div className="task-grid">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <img src={task.photoUrl} alt={task.title} />
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default TaskCollection;