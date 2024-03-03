import React, { Component } from 'react';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import TaskFolder from './pages/TaskFolder'
import About from './Components/About';
import Howto from './Components/Howto';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

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
          <h1 className='color-settings'>How To</h1>
          <Howto updateState={(selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({ currentPage: selected });
          } } stepNumber={0} title={'Add Task'} description={'On the home page, click the box with the + and you will be prompted to enter a name and desciption. The task will be added with an egg and id assigned to your egg collection. '} />
          <Howto
            stepNumber={1} title={'Complete Tasks'} description={'To report progress on a tasl click the get associated with the task. You will then be prompted to click a box of completeion. Once completed, the completed egg will move to egg archive and you will recieve credits.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } } />
          <Howto
            stepNumber={2} title={'Local Credits'} description={'The form of currency used by Tasquerie. Credits can be used to interact with Eggs and unlock Accessories or even Eggs in the Egg Library. In most cases, Egg-Specific Credits are used to pay. If a user doesn’t have enough Egg-Specific Credits for an action but has an amount of Universal Credits that makes up for the difference between the Egg-Specific Credits required and the amount the user has, the action will go through, taking both Egg-Specific Credits and Universal Credits. Unlocks in the Egg Library require only Universal Credits. If a user attempts an action with insufficient Credits then the action does not go through.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } }          />
            <Howto
            stepNumber={3} title={'Universal Credits'} description={'Can be gained by completing miscellaneous tasks in the Task Basket, and as well as completing general achievements and streaks.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } } />
            <Howto
            stepNumber={4} title={'Egg-Spcific Credits'} description={'Can be gained by completing tasks within a task folder, and as well as completing general achievements and streaks. Egg-Specific Credits are specific to each Egg, meaning each Egg can have a different amount of Egg-Specific Credits. Even two instances of the same Egg Type can have a different amount.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } } />
            <button className='fa fa-angle-left' onClick={() => this.setState({currentPage: 'settings'})}> Back to Settings</button>
        </div>
      );
    }
  }
}

export default App;
