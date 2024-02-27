import React, { Component } from 'react';
import { Egg, EggType } from './Egg';

interface EggCardProps {
    cardName: string;
    egg: EggType;
}

interface EggCardState {

}

export class EggCard extends Component<EggCardProps, EggCardState> {
    constructor(props: EggCardProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div className="card">
                <div className="cardName">{this.props.cardName}</div>
                <Egg egg={this.props.egg}/>
            </div>
        )
    }
}