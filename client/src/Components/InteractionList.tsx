import React, { Component } from 'react';
import { Interaction, InteractionType } from './Interaction'
import * as mocks from '../Mocks'
import { AlertBox } from './AlertBox';

interface InteractionListProps {
  updateCredits(newAmount: number): void;
  eggId: number;
}

interface InteractionListState {
  warnWindowState: string // 'hidden' or 'shown'
}

export class InteractionList extends Component<InteractionListProps, InteractionListState> {
  constructor(props: InteractionListProps){
    super(props);
    this.state = {
      warnWindowState: 'hidden',
    }
  }

  applyInteraction(interaction: InteractionType){
    if(mocks.specificCredits[this.props.eggId] - interaction.cost < 0){
        this.showWarning();
    }
    else{
        mocks.specificCredits[this.props.eggId] -= interaction.cost;
        mocks.eggCollection[this.props.eggId].exp += interaction.rewardExp;
    }
    this.props.updateCredits(mocks.specificCredits[this.props.eggId]);
    // this.setState({eggCredits: mocks.specificCredits[this.props.eggId]});
  }

  showWarning(){
    this.setState({warnWindowState: 'shown'});
  }

  closeWarning(){
    this.setState({warnWindowState: 'hidden'});
  }

  render() {
    let interactions = [];
    let button;
    for(let i = 0; i < mocks.interactionsList[this.props.eggId].length; i++){
        button = <button
            className="invisibleButton interactionButton"
            onClick={() => this.applyInteraction(mocks.interactionsList[this.props.eggId][i])}
        >
            <Interaction interaction={mocks.interactionsList[this.props.eggId][i]}/>
        </button>
        interactions.push(button);
    }
    return (
      <div>
        <AlertBox
            close={() => this.closeWarning()}
            title="lmao ur poor"
            message="You don't have enough credits to apply that interaction."
            visible={this.state.warnWindowState}
        />
        {interactions}
      </div>
    )
  }
}
