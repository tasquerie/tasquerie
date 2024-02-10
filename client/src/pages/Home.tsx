// The Home Page is what the user sees upon login. It is the topmost level 
// of functionality, and should contain four things in some way:
// Collection of Eggs
// Upcoming Tasks
// General Settings
// General Achievements/Streaks
// Task Basket

// Additionally, somewhere on the screen the user should be able to see how 
// many Universal Credits they have.

import React, { Component } from 'react';
import UpcomingTasks from '../Components/UpcomingTasks';
import '../Components/EggCollection';
import TaskCollection from '../Components/EggCollection';

class Home extends Component {
    state = { // change state once connected to backend
        tasks: [
            { id: 1, title: 'Task 1', deadline: '2024-02-15', dueDate: '2024-02-15' },
            { id: 2, title: 'Task 2', deadline: '2024-02-18', dueDate: '2024-02-18' },
        ]
    };

    render() {
        return (
                <div className="content">
                    <h1>Welcome to Tasquerie</h1>
                    <p>A brief description of Tasquerie goes here...</p>
                    <UpcomingTasks tasks={this.state.tasks} />
                    {/* <TaskCollection tasks={this.state.tasks} /> */}
                </div>
        );
    }
}

export default Home;
