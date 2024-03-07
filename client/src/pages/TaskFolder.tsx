
import React, {Component} from 'react';
import { TaskType } from '../Components/Task'
import * as mocks from '../Mocks';
import { TaskList } from '../Components/TaskList'
import { Egg } from '../Components/Egg'
import { InteractionList } from '../Components/InteractionList'
import { Interaction } from '../Components/Interaction';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';
import Axios from 'axios';

interface TaskFolderProps {
    folderName: string;
    updateState(selected: string): void;
}

interface TaskFolderState {
    folderName: string;
    egg: any;
    eggFunctionTab: string; // 'tasks' | 'interactions' | 'accessories'
    eggCredits: number;
    taskList: string[];
    interactionList: string[];
    // accessoryList: string[];
}

class TaskFolder extends Component<TaskFolderProps, TaskFolderState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: any){
        super(props);
        this.state = {
            folderName: this.props.folderName,
            egg: {
                eggStage: 0,
                eggType: 'blue',
                exp: 0
            },
            eggFunctionTab: 'tasks',
            eggCredits: 0,
            taskList: [],
            interactionList: [],
            // accessoryList: [],
        }
    }

    async UNSAFE_componentWillMount() {
        // await this.loadFolderInfo();
        await this.loadFolderInfoTest();
        // await this.getTasks();
    }

    async loadFolderInfo() {
        // sequential loading, which means that if something breaks along the way it will impact
        // the rest of the load, but this is more resource efficient... opportunity cost
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);

        // load task list & credits
        try{
            let taskFolderInfo = await BackendWrapper.view("getTaskInfo", args);
            // check if response is "empty"
            // TODO: right now taskIDtoTasks is a Map which is bad news
            // tomorrow changes will be made to get a list, so assume that right now
            // might become an endpoint too
            this.setState({
                taskList: taskFolderInfo.taskIDs,
                eggCredits: taskFolderInfo.eggCredits
            });
        } catch (e) {
            console.log("Failure to retrieve tasks of this folder");
        }

        // load interactions list & egg
        try{
            let folderEgg = await BackendWrapper.view("getEggInfo", args);
            let interactions: string[] = folderEgg.eggType.allowedInteractions;
            // TODO: verify line above - might not cast properly, and might work better if it were just a list
            // currently allowedInteractions exists as a Set<string> but might become string[] if i'm lucky
            // we might be getting a dedicated getallowedinteractions function! fun
            this.setState({
                interactionList: interactions,
                egg: folderEgg
            });
        } catch (e) {
            console.log("Failure to retrieve interactions of this egg");
        }

        // maybe load accessories list at some point
    }

    async loadFolderInfoTest() {
        console.log('loadfolderinfotest');
        let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/get?userID=${this.context.getUser()}`);
        let user = response.data;
        let folder = user.taskFolders[this.props.folderName];
        // folder.egg.eggStage = parseInt(folder.egg.eggStage);
        // folder.egg.exp = parseInt(folder.egg.exp);
        this.setState({
            eggCredits: folder.eggCredits,
            taskList: folder.taskIDtoTasks,
            egg: folder.egg
        })
    }

    async getTasks() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);

        try{
            let taskFolderInfo = await BackendWrapper.view("getTaskInfo", args);
            // check if response is "empty"
            let taskIDs: string[] = taskFolderInfo.taskIDs;
            // TODO: right now taskIDtoTasks is a Map which is bad news
            // tomorrow changes will be made to get a list, so assume that right now
            // might become an endpoint too
        this.setState({
            taskList: taskIDs
        });
        } catch (e) {
            console.log("Failure to retrieve tasks of this folder");
        }
    }

    async getInteractions() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);

        try{
            let folderEgg = await BackendWrapper.view("getEggInfo", args);
            let interactions: string[] = folderEgg.eggType.allowedInteractions;
            // TODO: verify line above - might not cast properly, and might work better if it were just a list
            // currently allowedInteractions exists as a Set<string> but might become string[] if i'm lucky
            // we might be getting a dedicated getallowedinteractions function! fun
            this.setState({
                interactionList: interactions
            });
        } catch (e) {
            console.log("Failure to retrieve interactions of this egg");
        }
    }

    refreshFolder() {
        // every time this is called, user is kicked back to tasks tab
        // rip, but there is nothing we can do at this moment
        this.forceUpdate();
    }

    render() {
        let showingTab;
        if(this.state.eggFunctionTab === 'tasks'){
            showingTab = <TaskList
                refreshFolder={() => {this.refreshFolder();}}
                taskList={this.state.taskList}
                folderName={this.props.folderName}
            />;
        }
        else if (this.state.eggFunctionTab === 'interactions') {
            showingTab = <InteractionList
            interactionList={this.state.interactionList}
            folderName={this.props.folderName}
            refreshFolder={() => {this.refreshFolder();}}
            />;
        }
        else if (this.state.eggFunctionTab === 'accessories') {
            showingTab = <div>Come Back Later</div>;
        }
        let nextExpBound: string;
        if (parseInt(this.state.egg.eggStage) < 2) {
            nextExpBound = String(this.state.egg.eggType.levelBoundaries[parseInt(this.state.egg.eggStage) + 1]);
        } else {
            nextExpBound = 'inf';
        }
        return (
            // TODO: somehow get taskfolder & taskfolder name - as of now there is no way for
            // a taskfolder to be uniquely identified, which is concerning
            <div id="taskFolder">
                <div id="taskFolderTitle">{this.state.folderName}</div>
                <p>You have: <span>{this.state.eggCredits}</span> credits for this egg</p>
                <Egg
                    folderName={this.state.folderName}
                    egg={this.state.egg}
                />
                <div id="eggExp">EXP: {this.state.egg.exp}/{nextExpBound}</div>
                {/* TODO: EXP here needs to be engineered to show next threshold, or show
                nothing at all if the egg is already at the last stage */}
                <button className="invisibleButton" onClick={() => this.props.updateState('home')}>Back to Home</button>
                <div id="taskFolderTabs">
                    <button className="invisibleButton taskFolderTabButton"
                        onClick={() => this.setState({eggFunctionTab: 'tasks'})}
                    >Tasks</button>
                    <button className="invisibleButton taskFolderTabButton"
                        onClick={() => this.setState({eggFunctionTab: 'interactions'})}
                    >Interact</button>
                    <button className="invisibleButton taskFolderTabButton"
                        onClick={() => this.setState({eggFunctionTab: 'accessories'})}
                    >Accessorise</button>
                </div>
                {showingTab}
            </div>
        );
    }
}

export default TaskFolder;