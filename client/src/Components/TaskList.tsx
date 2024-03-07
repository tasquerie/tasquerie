import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskCard } from './AddTaskCard';
import { AddTaskWindow } from '../Components/AddTaskWindow';
import { BackendWrapper } from '../BackendWrapper';
import {AuthContext} from '../Context/AuthContext';
import { element } from 'prop-types';

interface TaskListProps {
  //updateCredits(newAmount: number): void;
  // contains the ids of the tasks
  // tasks:string[];
}

interface TaskListState {
  addTaskWindowState: string; // 'hidden' or 'shown'
  tasks:string[];
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
      await this.loadTaskList();
  }

  async loadTaskList() {
    const user = this.context.getUser();  
    console.log(user);
    try {
      let tempList:string[] = []
      console.log(user.uid);
      let list = await BackendWrapper.getAllTask(user.uid);
      tempList.push(JSON.stringify(list));
      this.setState({tasks:tempList});
    } catch (err){
      console.error("Failure to load the task folders");
    }
  }

  // toggleCompletion(taskId: number, rewardCredits: number) {
  //     mocks.tasksList[this.props.eggId][taskId].isComplete = !(mocks.tasksList[this.props.eggId][taskId].isComplete);
  //     mocks.specificCredits[this.props.eggId] += rewardCredits;
  //     this.props.updateCredits(mocks.specificCredits[this.props.eggId]);
  //     // this.setState({eggCredits: mocks.specificCredits[this.props.eggId]});
  //     // mocks.tasksList[this.props.eggId][taskId].isComplete = true;
  // }

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

  async addTask(task:TaskType) {
    let user = this.context.getUser();
    let args = {name:task.name, description:task.description, isComplete:task.isComplete, startDate:task.startDate, endDate:task.endDate};
    try {
      console.log('addTask');
      // console.log(user.id);
      // console.log(args);
      const success = await BackendWrapper.addTask(user.uid, args);
      console.log(success);
      await this.loadTaskList();
    } catch (err) {
      console.error("Failure to add Task");
    }
  }

  addHere() {
    {this.state.tasks.length === 0 ? (
      <div>No Tasks - Add One To Get Started!</div>
    ) : (
      this.state.tasks.map(task => (
        <div key={"name"} className="taskCard">
          <div className="taskName">{"task.name"}</div>
          {/* Render more task details here if needed */}
        </div>
      ))
      )}
  }

  render() {
    // let tasks = [];
    // for(let i = 0; i < mocks.tasksList[this.props.eggId].length; i++) {
    //   let task: TaskType = mocks.tasksList[this.props.eggId][i];
    //   tasks.push(
    //     <Task
    //       toggleCompletion={() => this.toggleCompletion(i, task.creditReward)}
    //       task={task}
    //     />
    //   );
    // }

    let addTaskWindow;
    if (this.state.addTaskWindowState == 'shown') {
      addTaskWindow = <AddTaskWindow
      addTask = {(task:TaskType) => {
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
        {addTaskWindow}
        {/*add here */}
        <button id="newTaskButton" className="invisibleButton" onClick={() => this.showAddTaskWindow()}><AddTaskCard/>Add New Task</button>
      </div>
    )
  }
}
