import e from "express";
import Axios from "axios"
import {User} from '../src/model/User';


const PORT_NUMBER: number = 3232;

export class BackendWrapper {
    // taskController:
    static getAllTask = async(userID:string): Promise<any> => {
        const response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/getAll?userID=${userID}`);
        const data = await this.checkData(response.data);
        return data.tasks
    }

    // Check if the data is a Json or an task
    static getTask = async(userID:string, taskID:string): Promise<any> => {
        let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/get?userID=${userID}&taskID=${taskID}`);
        return await this.checkData(response.data);
    }

    // updateField function in taskController
    static updateTask = async(userID:string, taskID:string, name:string, value:string): Promise<any> => {
        const args = {userID:userID, taskID:taskID, fieldName:name, fieldValue:value}
        let response = await Axios.patch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/updateField`, args);
        //{
        //     method: 'PATCH',
        //     headers:{
        //         'Content-Type':'application/json',
        //     },
        //     body: JSON.stringify(args)
        // }
        const data = await this.checkData(response.data);
        return data.success;
    }

    // taskData needs to be a Json object.
    static addTask = async(userID:string, taskData:any): Promise<any> => {
        let response = await Axios.post(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/addTask`, taskData);
        // {
        //     method: 'POST',
        //     headers:{
        //         'Content-Type':'application/json',
        //     },
        //     body: taskData
        // }
        const data = await this.checkData(response.data);
        return data.success;
    }

    //userController:

    // returns a map of the users where the userid is the key
    static getAllUsers = async(): Promise<any> => {
        let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/getAll`);
        return await this.checkData(response.data);
    }

    // returns the json of the user
    static getUser = async(userID:string): Promise<any> => {
        let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/get?userID=${userID}`);
        return await this.checkData(response.data);
    }

    // userData needs to be a Json object.
    static addUser = async(userID:string, userData:any): Promise<any> => {
        let response = await Axios.post(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/add`, userData);
        // {
        //     method: 'POST',
        //     headers:{
        //         'Content-Type':'application/json',
        //     },
        //     body: userData
        // });
        return await this.checkData(response.data);
    }

    static updateUser = async(userID:string, name:string, value:string): Promise<any> => {
        const args = {userID:userID, fieldName:name, fieldValue:value};
        let response = await Axios.patch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/updateField`, args);
        // {
        //     method: 'PATCH',
        //     headers:{
        //         'Content-Type':'application/json',
        //     },
        //     body: JSON.stringify(args)
        // });
        const data = await this.checkData(response.data)
        return data.success;
    }

    static checkData = async(res:Response) => {
        let data;
        try {
            data = await this.requestPath(res);
        } catch (err:any) {
            alert(err.message);
        }
        return data;
    }

    static requestPath = async (res: Response) => {
        if (res.status !== 200) {
            const errorJson = await res.json();
            throw new Error(`Error: ${res.status} \n ${errorJson.error}`)
        }
        const data = await res.json();
        return data;
        // try{
        //     // let response = await fetch(`http://localhost:${PORT_NUMBER}/${area}?start=${func}&destination=${arg}`);
        //     if(!response.ok) {
        //         alert(`Status is wrong, expected 200, was ${response.status}`);
        //     }
        //     const responseBody = await response.json();
        //     // Error Case
        //     if (responseBody === "") {
        //         throw new Error("Invalid output");
        //     }
        //     // boolean caser
        //     else if (responseBody === "true" || responseBody === "false") {
        //         return responseBody === "true";
        //     }
        //     // JSON case 
        //     else {
        //         return responseBody;
        //     }
        // } catch (e) {
        //     alert("There was an error contacting the server.");
        //     console.log(e);
        //     throw new Error("Connection lost");
        // }
    }
}
