import React, { Component } from 'react';
import { Interaction } from './Interaction'
import * as mocks from '../Mocks'
import { AlertBox } from './AlertBox';

interface InteractionListProps {
  refreshFolder(): void;
  interactionList: string[];
  folderName: string;
}

interface InteractionListState {
  showingWarnWindow: boolean
}

export class InteractionList extends Component<InteractionListProps, InteractionListState> {
  constructor(props: InteractionListProps){
    super(props);
    this.state = {
      showingWarnWindow: false,
    }
  }

  showWarning(){
    this.setState({showingWarnWindow: true});
  }

  closeWarning(){
    this.setState({showingWarnWindow: false});
  }

  render() {
    let interactions = [];
    let interaction;
    for(let i = 0; i < this.props.interactionList.length; i++){
        interaction = 
            <Interaction 
            refreshFolder={() => {this.props.refreshFolder();}}
            showAlert={() => {this.showWarning();}}
            folderName={this.props.folderName}
            interactionName={this.props.interactionList[i]}/>
        interactions.push(interaction);
    }
    return (
      <div>
        <AlertBox
            close={() => this.closeWarning()}
            title="lmao ur poor"
            message="You don't have enough credits to apply that interaction."
        />
        {interactions.length == 0? <div>No Interactions</div> : interactions}
      </div>
    )
  }
}
