import React, { Component } from 'react';
import { Accessory, dressEgg } from './Accessory';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

export interface EggType {
    imgUrls : string[];
    stage : number;
    activeAccessories : Accessory[];
    exp: number;
    expBounds: number[];
}

interface EggProps {
    egg: EggType
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
        for(let i = 0; i < this.props.egg.activeAccessories.length; i++){
            accessories.push(dressEgg(this.props.egg.activeAccessories[i]));
        }

        return(
            <div className="egg" style={{position: 'relative'}}>
                <img
                id="eggImg"
                key={this.props.egg.imgUrls[this.props.egg.stage]}
                style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0%'
                }}
                src={this.props.egg.imgUrls[this.props.egg.stage]}></img>
                {accessories}
            </div>
        )
    }
}