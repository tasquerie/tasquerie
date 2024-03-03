import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskWindow } from '../Components/AddTaskWindow';
import * as mocks from '../Mocks'
import AuthContext from '../Context/AuthContext';

interface TaskListProps {
  updateCredits(newAmount: number): void;
  eggId: number;
}

interface TaskListState {
  addTaskWindowState: string // 'hidden' or 'shown'
  tasks: TaskType[];
  // tasks: string[]; // list of taskIDs that can be gotten from backend
}

export class TaskList extends Component<TaskListProps, TaskListState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: TaskListProps){
    super(props);
    this.state = {
      addTaskWindowState: 'hidden',
      tasks: []
    }
  }

  async componentDidMount() {
      this.getTasks();
  }

  toggleCompletion(taskId: number, rewardCredits: number) {
      mocks.tasksList[this.props.eggId][taskId].isComplete = !(mocks.tasksList[this.props.eggId][taskId].isComplete);
      mocks.specificCredits[this.props.eggId] += rewardCredits;
      this.props.updateCredits(mocks.specificCredits[this.props.eggId]);
      // this.setState({eggCredits: mocks.specificCredits[this.props.eggId]});
      // mocks.tasksList[this.props.eggId][taskId].isComplete = true;
  }

  showAddTaskWindow() {
      this.setState({
          addTaskWindowState: 'shown'
      });
  }

  hideAddTaskWindow() {
      this.setState({
          addTaskWindowState: 'hidden'
      })
  }

  addTask(task: TaskType) {
      mocks.tasksList[this.props.eggId].push(task);
  }

  /**
   * Gets all of user's tasks from backend API
   */
  async getTasks() {
    // do some calls ig
    let taskList: TaskType[] = [];
    this.setState({
      tasks: taskList
    })
  }

  render() {
    // refactor to use this.state.tasks
    let tasks = [];
    for(let i = 0; i < mocks.tasksList[this.props.eggId].length; i++) {
      let task: TaskType = mocks.tasksList[this.props.eggId][i];
      tasks.push(
        <Task
          toggleCompletion={() => this.toggleCompletion(i, task.creditReward)}
          task={task}
        />
      );
    }

    let addTaskWindow;
    if (this.state.addTaskWindowState == 'shown') {
      addTaskWindow = <AddTaskWindow
      addTask = {(task: TaskType) => {
        this.addTask(task);
      }}
      closeBox = {() => {
        this.hideAddTaskWindow();
      }}
      visible={this.state.addTaskWindowState}
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
