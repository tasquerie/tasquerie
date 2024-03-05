import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskWindow } from '../Components/AddTaskWindow';
import * as mocks from '../Mocks'
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

interface TaskListProps {
  folderName: string;
}

interface TaskListState {
  showingAddTaskWindow: boolean;
  // tasks: TaskType[];
  taskIDs: string[]; // list of taskIDs that can be gotten from backend
}

export class TaskList extends Component<TaskListProps, TaskListState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: TaskListProps){
    super(props);
    this.state = {
      showingAddTaskWindow: false,
      taskIDs: []
    }
  }

  async componentDidMount() {
      await this.getTasks();
  }

  /**
   * Gets all of user's tasks from backend API
   */
  async getTasks() {
    // do some calls ig
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());
    args.set("folderName", this.props.folderName);

    try{
      let taskFolderInfo = await BackendWrapper.view("getTaskInfo", args);
      // check if response is "empty"
      let taskList: string[] = taskFolderInfo.taskIDs;
      // TODO: right now taskIDtoTasks is a Map which is bad news
      // tomorrow changes will be made to get a list, so assume that right now
      // might become an endpoint too
      this.setState({
        taskIDs: taskList
      });
    } catch (e) {
      console.log("Couldn't retrieve tasks of this folder");
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
    for(let i = 0; i < this.state.taskIDs.length; i++) {
      tasks.push(
        <Task
          folderName={this.props.folderName}
          taskID={this.state.taskIDs[i]}
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
