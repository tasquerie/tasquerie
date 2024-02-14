import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { stringify } from 'querystring';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import * as mocks from './Mocks'
import { TaskType } from './Components/Task'
import TaskFolder from './pages/TaskFolder'

export interface AppState {
  currentPage: string;
  userID: number;
  displayingEggId: number;
}

class App extends Component<{}, AppState> {
  example: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPage: 'home',
      userID: 0, // You can set this to an initial value as needed
      displayingEggId: -1
    };
    this.example = 'home';
    // Bind switchState method to the class instance
    this.switchState = this.switchState.bind(this);
  }

  switchState(page: string) {
    this.setState({ currentPage: page });
    if(page != "taskFolder") {
      this.setState({displayingEggId : -1});
    }
  }

  displayTaskFolder(eggId: number) {
    // if id >= 0, display a page
    // id = -1 means no egg is being displayed
    this.setState({
      displayingEggId : eggId,
      currentPage : "taskFolder"
    });
  }

  render() {
    // Use this.state.currentPage to check the current page
    if (this.state.currentPage === 'home') {
      return (
        <div>
          <Home 
          displaytaskFolder={
            (eggId: number) => {
              this.displayTaskFolder(eggId);
            }
          }
          updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.switchState(selected);
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'profile') {
      return (
        <div>
          <Profile updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'archive') {
      return (
        <div>
          <Archive updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'settings') {
      return (
        <div>
          <Settings updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'taskFolder') {
      return (
        <div>
          <TaskFolder
          updateState = {
            (selected: string) => this.setState({currentPage : selected})
          }
          eggId = {
            this.state.displayingEggId
          }
          />
        </div>
      )
    }
  }
}

export default App;
