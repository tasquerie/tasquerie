import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskWindow } from '../Components/AddTaskWindow';
import * as mocks from '../Mocks'

interface TaskListProps {
  updateCredits(newAmount: number): void;
  eggId: number;
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

  render() {
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
    return (
      <div>
        <AddTaskWindow
          addTask = {(task: TaskType) => {
            this.addTask(task);
          }}
          closeBox = {() => {
            this.hideAddTaskWindow();
          }}
          visible={this.state.addTaskWindowState}
        />
        <button onClick={() => this.showAddTaskWindow()}>Add New Task</button>
        {tasks}
      </div>
    )
  }
}
