import React, { Component } from 'react';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

export interface InteractionType {
    name: string;
    cost: number;
    rewardExp: number;
}

interface InteractionProps {
    interaction: InteractionType;
}

export class Interaction extends Component<InteractionProps> {
    constructor(props: any){
        super(props);
    }

    render() {
        return(
            <div className="interaction" style={{position: 'relative'}}>
                <div className="interactionName">{this.props.interaction.name}</div>
                <div className="interactionInfo">
                    <div>Cost: {this.props.interaction.cost}</div>
                    <div>+ {this.props.interaction.rewardExp} EXP</div>
                </div>
            </div>
        )
    }
}