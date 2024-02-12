import React, { Component } from 'react';
import { Accessory, dressEgg } from './Accessory';

interface EggProps {
    imgUrl : string;
    activeAccessories : Accessory[];
}

export class Egg extends Component<EggProps> {
    constructor(props: any){
        super(props);
    }

    dressEgg(accessUrl: string, accessLocation: [number, number], accessScale: number): JSX.Element {
        console.log('dressEgg called');
        console.log(`accessLocation [${accessLocation[0]}, ${accessLocation[1]}]`);
        return (
            <div>
                <img
                className="accessory"
                src={accessUrl}
                style={{
                    position: 'absolute', 
                    top: `${accessLocation[0]}px`, 
                    left: `${accessLocation[1]}px`,
                    transform: `scale(${accessScale}, ${accessScale})`
                }}
                >
                </img>
            </div>
        )
    }

    render() {

        let accessories : JSX.Element[] = [];
        for(let i = 0; i < this.props.activeAccessories.length; i++){
            accessories.push(dressEgg(this.props.activeAccessories[i]));
        }

        return(
            <div className="egg" style={{position: 'relative'}}>
                <img
                id="eggImg"
                key={this.props.imgUrl}
                style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0%'
                }}
                src={this.props.imgUrl}></img>
                {accessories}
            </div>
        )
    }
}