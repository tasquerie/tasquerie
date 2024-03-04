import React, { Component } from 'react';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import TaskFolder from './pages/TaskFolder'
import About from './Components/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HowtoPg from './pages/HowtoPg';

export interface AppState {
  currentPage: string;
  userID: string;
  displayingEggId: number;
}

class App extends Component<{}, AppState> {
  example: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPage: 'login',
      userID: '', // You can set this to an initial value as needed
      displayingEggId: -1
    };
    // Bind switchState method to the class instance
    this.switchState = this.switchState.bind(this);
  }

  switchState(page: string) {
    this.setState({ currentPage: page });
    if(page !== "taskFolder") {
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

  setUserID(id: string) {
    this.setState({
      userID: id
    });
  }

  render() {
    // Use this.state.currentPage to check the current page
    if (this.state.currentPage === 'login') {
      return (
        <div>
          <Login updateState={
            (selected: string) => {
              this.switchState(selected);
            }}
            setUserID={
              (id: string) => {
                this.setUserID(id);
              }
            }
            />
        </div>
      )
    } else if (this.state.currentPage === 'signup') {
      return (
        <div>
          <SignUp updateState={
            (selected: string) => {
              this.switchState(selected);
            }}
            setUserID={
              (id: string) => {
                this.setUserID(id);
              }
            }
            />
        </div>
      )
    } else if (this.state.currentPage === 'home') {
      if (this.state.userID === '') {
        this.switchState('home');
      }
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
      if (this.state.userID === '') {
        this.switchState('home');
      }
      return (
        <div>
          <Profile updateState={(selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({ currentPage: selected });
          } } name={''} id={0}/>
        </div>
      );
    } else if (this.state.currentPage === 'archive') {
      if (this.state.userID === '') {
        this.switchState('home');
      }
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
      if (this.state.userID === '') {
        this.switchState('home');
      }
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
      if (this.state.userID === '') {
        this.switchState('home');
      }
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
    } else if (this.state.currentPage === 'about') {
      if (this.state.userID === '') {
        this.switchState('home');
      }
      return (
        <div>
          <About updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    }else if (this.state.currentPage === 'howto') {
      if (this.state.userID === '') {
        this.switchState('home');
      }
      return (
        <div>
          <HowtoPg updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    }
  }
}

export default App;
