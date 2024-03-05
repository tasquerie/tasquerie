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
      // console.log('EggCollection componentdidmount');
      await this.loadTaskFolders();
  }

  async loadTaskFolders() {
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());

    try{
      let folders = await BackendWrapper.view("getAllTaskFolderInfo", args);
      // assumes this gets back a list of folder OBJECTS
      // if not - TODO: change this to a loop where each folderName then
      // gets getTaskFolderInfo'd
      this.setState({
        folders: folders
      })
    } catch (e) {
      console.log("Failure to load task folders");
    }
  }

  showAddEggWindow() {
    this.setState({showingAddEggWindow: true});
  }

  hideAddEggWindow() {
    this.setState({showingAddEggWindow: false});
  }

  render() {
    // refactor to use this.state.eggs later
    let eggs = [];
    for(let i = 0; i < this.state.folders.length; i++){
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
      addEggWindow = <AddEggWindow
      closeBox = {() => this.hideAddEggWindow()}
    />
    } else {
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