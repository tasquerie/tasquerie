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
import AuthContext from './Context/AuthContext';

export interface AppState {
  currentPage: string;
  userID: string;
  displayingFolder: string;
}

class App extends Component<{}, AppState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPage: 'login',
      userID: '', // You can set this to an initial value as needed
      displayingFolder: ''
    };
    // Bind switchState method to the class instance
    this.switchState = this.switchState.bind(this);
  }

  switchState(page: string) {
    this.setState({ currentPage: page });
    if(page !== "taskFolder") {
      this.setState({displayingFolder: ''});
    }
  }

  displayTaskFolder(folderName: string) {
    // if id >= 0, display a page
    // id = -1 means no egg is being displayed
    this.setState({
      displayingFolder: folderName,
      currentPage : "taskFolder"
    });
  }

  render() {
    let page;

    switch (this.state.currentPage) {
      case 'login':
        page = <div>
        <Login updateState={
          (selected: string) => {
            this.switchState(selected);
          }}
          />
      </div>;
        break;
      case 'signup':
        page = <div>
          <SignUp updateState={
            (selected: string) => {
              this.switchState(selected);
            }}
            />
        </div>;
        break;
      case 'home':
        page = <div>
        <Home
        displaytaskFolder={
          (folderName: string) => {
            this.displayTaskFolder(folderName);
          }
        }
        updateState={
          (selected: string) => {
            console.log(`switch page to ${selected}`);
            this.switchState(selected);
          }
        }/>
      </div>;
        break;
      case 'profile':
        page = <div>
        <Profile updateState={(selected: string) => {
          console.log(`switch page to ${selected}`);
          this.setState({ currentPage: selected });
        } } name={''} id={0}/>
      </div>;
        break;
      case 'archive':
        page = <div>
        <Archive updateState={
          (selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({currentPage: selected});
          }
        }/>
      </div>;
        break;
      case 'settings':
        page = <div>
        <Settings updateState={
          (selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({currentPage: selected});
          }
        }/>
      </div>;
        break;
      case 'taskFolder':
        page = <div>
        <TaskFolder
        folderName={this.state.displayingFolder}
        updateState = {
          (selected: string) => this.setState({currentPage : selected})
        }
        />
      </div>;
        break;
      case 'about':
        page = <div>
        <About updateState={
          (selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({currentPage: selected});
          }
        }/>
      </div>;
        break;
      case 'howto':
        page = <div>
          <HowtoPg updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>;
        break;
        default:
          // if user manages to break things enough to end up here...
          // you deserve this
          window.location.assign("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
          break;
    }

    return page;

    // if (this.state.currentPage === 'login') {
    //   return (
    //     <div>
    //       <Login updateState={
    //         (selected: string) => {
    //           this.switchState(selected);
    //         }}
    //         />
    //     </div>
    //   )
    // } else if (this.state.currentPage === 'signup') {
    //   return (
    //     <div>
    //       <SignUp updateState={
    //         (selected: string) => {
    //           this.switchState(selected);
    //         }}
    //         />
    //     </div>
    //   )
    // } else if (this.state.currentPage === 'home') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <Home
    //       displaytaskFolder={
    //         (folderName: string) => {
    //           this.displayTaskFolder(folderName);
    //         }
    //       }
    //       updateState={
    //         (selected: string) => {
    //           console.log(`switch page to ${selected}`);
    //           this.switchState(selected);
    //         }
    //       }/>
    //     </div>
    //   );
    // } else if (this.state.currentPage === 'profile') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <Profile updateState={(selected: string) => {
    //         console.log(`switch page to ${selected}`);
    //         this.setState({ currentPage: selected });
    //       } } name={''} id={0}/>
    //     </div>
    //   );
    // } else if (this.state.currentPage === 'archive') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <Archive updateState={
    //         (selected: string) => {
    //           console.log(`switch page to ${selected}`);
    //           this.setState({currentPage: selected});
    //         }
    //       }/>
    //     </div>
    //   );
    // } else if (this.state.currentPage === 'settings') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <Settings updateState={
    //         (selected: string) => {
    //           console.log(`switch page to ${selected}`);
    //           this.setState({currentPage: selected});
    //         }
    //       }/>
    //     </div>
    //   );
    // } else if (this.state.currentPage === 'taskFolder') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <TaskFolder
    //       folderName={this.state.displayingFolder}
    //       updateState = {
    //         (selected: string) => this.setState({currentPage : selected})
    //       }
    //       />
    //     </div>
    //   )
    // } else if (this.state.currentPage === 'about') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <About updateState={
    //         (selected: string) => {
    //           console.log(`switch page to ${selected}`);
    //           this.setState({currentPage: selected});
    //         }
    //       }/>
    //     </div>
    //   );
    // }else if (this.state.currentPage === 'howto') {
    //   if (this.state.userID === '') {
    //     this.switchState('home');
    //   }
    //   return (
    //     <div>
    //       <HowtoPg updateState={
    //         (selected: string) => {
    //           console.log(`switch page to ${selected}`);
    //           this.setState({currentPage: selected});
    //         }
    //       }/>
    //     </div>
    //   );
    // }
  }
}

export default App;
