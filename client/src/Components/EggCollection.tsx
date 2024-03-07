// An area that displays the user’s collection of currently active Eggs. 
// If there are too many Eggs to display on the screen at once and fit within
// the area, users should be able to scroll. When the user clicks on an Egg, 
// they are taken to the egg view.
// Among this collection should also be an option to add a new Egg.
// Optionally, a user should be able to see any alerts (in the form of 
// notification icons) for certain eggs in this component.

import React, { Component } from 'react';
import { EggCard } from './EggCard';
import { AddEggCard } from './AddEggCard';
import { AddEggWindow } from './AddEggWindow';
import { BackendWrapper } from '../BackendWrapper';
import AuthContext from '../Context/AuthContext';

interface EggCollectionProps {
  displayTaskFolder(folderName: string): void;
}

interface EggCollectionState {
  showingAddEggWindow: boolean;
  folders: any[];
}

class EggCollection extends Component<EggCollectionProps, EggCollectionState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: EggCollectionProps){
    super(props);
    this.state ={
      showingAddEggWindow: false,
      folders: []
    }
  }

  async componentDidMount() {
    // await this.loadTaskFolders();
    await this.loadTaskFoldersConvoluted();
  }

  async loadTaskFolders() {
    console.log('loading task folders');
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());

    // debug
    console.log("debug folders: start");
    try{
      let folders = await BackendWrapper.view("getAllTaskFolderInfo", args);
      // debug
      console.log("debug folders: " + folders);
      // assumes this gets back a list of folder OBJECTS
      // if not - TODO: change this to a loop where each folderName then
      // gets getTaskFolderInfo'd
      if (folders === null) {
        throw Error("STOP");
      }
      this.setState({
        folders: folders
      })
      // console.log('loaded task folders');
    } catch (e) {
      // debug
      console.log("debug folders: failed");
      console.log("Failure to load task folders");
    }
  }

  // backup for if the regular loadTaskFolders() doesn't work
  async loadTaskFoldersConvoluted() {
    console.log('loading task folders');
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());

    try{
      let userStr = await BackendWrapper.view("getUserInfo", args);
      let user = JSON.parse(userStr)
      // debug
      console.log("debug task folder user: " + JSON.stringify(user))
      let folder;
      let folders = [];
      let folderStr = user.taskFolderKeys;
      // debug
      console.log("debug task folder user After: " + folderStr);
      let folderNames:string[] = JSON.parse(folderStr);
      for (let folderName of folderNames) {
        // debug
        console.log("debug task folder start: ")
        args.set("folderName", folderName);
        folder = await BackendWrapper.view("getTaskFolderInfo", args);
        // debug
        console.log("debug task folder folder: " + folder)
        folders.push(folder);
      }
      // debug
      // console.log("debug task folder before set state: " + user)
      this.setState({
        folders: folders
      })
      // debug
      // console.log("debug task folder after set state: " + user)
    } catch (e) {
      console.log("debug task folder user: failed")
      console.log("Failure to load task folders");
    }
  }

  showAddEggWindow() {
    this.setState({showingAddEggWindow: true});
  }

  hideAddEggWindow() {
    this.setState({showingAddEggWindow: false});
  }

  forceReload() {
    this.forceUpdate();
  }

  render() {
    console.log("debug eggCol render")

    let eggs = [];
    for(let i = 0; i < this.state.folders.length; i++){
      console.log("debug eggCol render " + i)
      eggs.push(
        <button className="invisibleButton" key={this.state.folders[i].name}
          onClick={() => this.props.displayTaskFolder(this.state.folders[i].name)}>
          <EggCard
            folder={this.state.folders[i]}
          />
        </button>
      );
    }

    let addEggWindow;
    if (this.state.showingAddEggWindow) {
      // debug
      console.log("debug: state is true");
      addEggWindow = <AddEggWindow
      forceReload={() => this.forceReload()}
      closeBox = {() => this.hideAddEggWindow()}
    />
    } else {
      // debug
      console.log("debug: state is false");
      addEggWindow = '';
    }

    return (
      <div id="egg-collection">
        {addEggWindow}
        {eggs}
        <button 
          onClick={() => this.showAddEggWindow()}
          className="invisibleButton" 
          key={'yahaha'}
          ><AddEggCard/></button>
      </div>
    );
  }
}

export default EggCollection;