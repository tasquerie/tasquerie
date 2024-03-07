import React, { Component } from 'react';
import { Task, TaskType } from './Task'
import { AddTaskCard } from './AddTaskCard';
import { AddTaskWindow } from '../Components/AddTaskWindow';
import { BackendWrapper } from '../BackendWrapper';
import {AuthContext} from '../Context/AuthContext';

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
    try {
      let tempList:string[] = []
      let list = await BackendWrapper.getAllTask(user.id);

      // check if you need to traverse the list and only input the ids to list
      let taskIDtoTask:Map<string,Task> = list.tasks;
      taskIDtoTask.forEach((value, key) => {
        tempList.push(key);
      });

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

  addTask(task: TaskType) {
    
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
