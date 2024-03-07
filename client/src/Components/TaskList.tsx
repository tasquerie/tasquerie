import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskCard } from './AddTaskCard';
import { AddTaskWindow } from '../Components/AddTaskWindow';
import * as mocks from '../Mocks'

interface TaskListProps {
  //updateCredits(newAmount: number): void;
  tasks:TaskType[];
}

interface TaskListState {
  addTaskWindowState: string // 'hidden' or 'shown'
}

export class TaskList extends Component<TaskListProps, TaskListState> {
  constructor(props: TaskListProps){
    super(props);
    this.state = {
      addTaskWindowState: 'hidden',
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

  addTask(task: TaskType) {
      // mocks.tasksList[this.props.eggId].push(task);
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
        {addTaskWindow}
        <button id="newTaskButton" className="invisibleButton" onClick={() => this.showAddTaskWindow()}><AddTaskCard/>Add New Task</button>
        {/* {tasks.length == 0? <div>No Tasks - Add One To Get Started!</div> : tasks} */}
      </div>
    )
  }
}
