import React, { Component } from 'react';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import Navbar from './Components/Navbar';
import About from './Components/About';
import Howto from './Components/Howto';
import Login from './pages/Login';

export interface AppState {
  currentPage: string;
  userID: number;
}

class App extends Component<{}, AppState> {
  example: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPage: 'login',
      userID: 0
    };
    // Bind switchState method to the class instance
    this.switchState = this.switchState.bind(this);
  }

  switchState(page: string) {
    this.setState({ currentPage: page });
  }

  // displayTaskList(userID: string) {
  //   // if id >= 0, display a page
  //   // id = -1 means no egg is being displayed
  //   this.setState({
  //     currentPage : "taskFolder"
  //   });
  // }

  render() {
    // Use this.state.currentPage to check the current page
    if (this.state.currentPage === 'login') {
      return (
        <div>
          <Login updateState={
            (selected: string) => {
              this.switchState(selected);
            }
          }/>
        </div>
      )
    } else if (this.state.currentPage === 'home') {
      return (
        <div>
          <Navbar />
          <Home
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
          <Profile updateState={(selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({ currentPage: selected });
          } } name={''} id={0}/>
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
    // } else if (this.state.currentPage === 'taskFolder') {
    //   return (
    //     <div>
    //       <TaskFolder
    //       updateState = {
    //         (selected: string) => this.setState({currentPage : selected})
    //       }
    //       />
    //     </div>
    //   )
    } else if (this.state.currentPage === 'about') {
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
