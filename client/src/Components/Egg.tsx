import React, { Component } from 'react';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';
import Axios from 'axios';

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
    eggImgUrl: string;
}

export class Egg extends Component<EggProps, EggState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: any){
        super(props);
        this.state = {
            accessories: [],
            eggImgUrl: ''
        }
    }

    async componentDidMount() {
        // await this.loadAccessories();
        // await this.loadEggImgUrl();
        await this.loadEggImgUrlTest();
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

    async loadEggImgUrl() {
        let eggStage = this.props.egg.eggStage;
        let args: Map<string, any> = new Map();
        args.set("name", this.props.egg.eggType);
        try{
            let eggType = await BackendWrapper.view("getEggType", args);
            this.setState({
                eggImgUrl: eggType.graphicLinks[eggStage]
            });
        } catch (e) {
            console.log("Failure to get egg img url");
        }
    }

    async loadEggImgUrlTest() {
        console.log("loading egg img");
        // this.setState({
        //     eggImgUrl: "https://cdn.discordapp.com/attachments/1022596073170157669/1215145325900341329/Untitled_Artwork_2.png?ex=65fbaf46&is=65e93a46&hm=c7d373589ae44059ca5feb074092c98088c1aa0924dc41428e473ecb4e2f1a8e&"
        // });
        let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/get?userID=eggType`);
        let eggTypes = response.data;
        this.setState({
            eggImgUrl: eggTypes[this.props.egg.eggType].graphicLinks[this.props.egg.eggStage]
        })
        console.log("eggimg loaded");
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

    render() {

        // let accessories = this.dressEgg();

        return(
            <div className="egg">
                <img
                className="eggImg"
                key={Math.random().toString(36).substring(2,12)} // random string for key
                src={this.state.eggImgUrl}></img>
                {/* {accessories} */}
            </div>
        )
    }
}