import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskWindow } from '../Components/AddTaskWindow';
import * as mocks from '../Mocks'
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

interface TaskListProps {
  refreshFolder(): void;
  folderName: string;
  taskList: string[] // list of taskIDs from backend
}

interface TaskListState {
  showingAddTaskWindow: boolean;
}

export class TaskList extends Component<TaskListProps, TaskListState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: TaskListProps){
    super(props);
    this.state = {
      showingAddTaskWindow: false
    }
  }
  
  showAddTaskWindow() {
      this.setState({
          showingAddTaskWindow: true
      });
  }

  hideAddTaskWindow() {
      this.setState({
          showingAddTaskWindow: false
      })
  }

  render() {
    // refactor to use this.state.tasks
    let tasks = [];
    for(let i = 0; i < this.props.taskList.length; i++) {
      tasks.push(
        <Task
          folderName={this.props.folderName}
          taskID={this.props.taskList[i]}
          refreshFolder={() => {
            this.props.refreshFolder();
          }}
        />
      );
    }

    let addTaskWindow;
    if (this.state.showingAddTaskWindow) {
      addTaskWindow = <AddTaskWindow
      folderName={this.props.folderName}
      closeBox = {() => {
        this.hideAddTaskWindow();
      }}
    />;
    } else {
      addTaskWindow = '';
    }


    return (
      <div id="taskList">
        <div id="taskListHeader">
          <div id="taskListTitle">
            TASKS
          </div>
          {addTaskWindow}
          <button id="newTaskButton" className="invisibleButton" onClick={() => this.showAddTaskWindow()}>Add New Task</button>
        </div>
        {tasks.length == 0? <div>No Tasks - Add One To Get Started!</div> : tasks}
      </div>
    )
  }
}
