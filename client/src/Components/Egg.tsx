import React, { Component } from 'react';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

// export interface EggType {
//     imgUrls : string[];
//     stage : number;
//     activeAccessories : Accessory[];
//     exp: number;
//     expBounds: number[];
// }

interface EggProps {
    folderName: string;
    egg: any; // backend Egg object
}

interface EggState {
    accessories: any[];
}

export class Egg extends Component<EggProps, EggState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: any){
        super(props);
        this.state = {
            accessories: []
        }
    }

    async componentDidMount() {
        await this.loadAccessories();
    }

    async loadAccessories() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);

        try {
            // get list of accessory strings
            let accessList = await BackendWrapper.view("getEquippedAccessories", args);

            // get each accessory, retrieve their imgUrl
            let access;
            let accessories = [];
            args.clear();
            for (let i = 0; i < accessList.length; i++) {
                args.set("name", accessList[i]);
                // TODO: error handling for empty string return (should not happen)
                access = await BackendWrapper.view("getAccessory", args);
                accessories.push(access.graphicLink);
            }
            this.setState({
                accessories: accessList
            });
        } catch (e) {
            console.log("Failure to get egg's equipped accessories");
        }
    }

    dressEgg(): JSX.Element[] {
        let accessories = [];
        for (let i = 0; i < this.state.accessories.length; i++) {
            accessories.push(
                <div>
                    <img
                    className="accessory"
                    src={this.state.accessories[i]}
                    style={{
                        position: 'absolute'
                    }}
                    >
                    </img>
                </div>
            );
        }
        return accessories;
    }

    getEggImgUrl(): string {
        let eggStage = this.props.egg.eggStage;
        return this.props.egg.eggType.graphicLinks[eggStage];
    }

    render() {

        let accessories = this.dressEgg();

        return(
            <div className="egg">
                <img
                className="eggImg"
                key={Math.random().toString(36).substring(2,12)} // random string for key
                src={this.getEggImgUrl()}></img>
                {accessories}
            </div>
        )
    }
}