import e from "express";

export {}

const PORT_NUMBER: number = 3232;

class BackendWrapper {
    // taskController:
    getAllTask = async(userID:string): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/getAll?userID=${userID}`);
        const data = await this.checkData(response);
        return data.tasks
    }

    // Check if the data is a Json or an task
    getTask = async(userID:string, taskID:string): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/get?userID=${userID}&taskID=${taskID}`);
        return await this.checkData(response);
    }

    // updateField function in taskController
    updateTask = async(userID:string, taskID:string, name:string, value:string): Promise<any> => {
        const args = {userID:userID, taskID:taskID, fieldName:name, fieldValue:value}
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/updateField`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(args)
        });
        const data = await this.checkData(response);
        return data.success;
    }

    // taskData needs to be a Json. Use the getJson function in Task.ts
    addTask = async(userID:string, taskData:string): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/addTask`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: taskData
        });
        const data = await this.checkData(response);
        return data.success;
    }

    //userController:

    // returns a map of the users where the userid is the key
    getAllUsers = async(): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/getAll`);
        return await this.checkData(response);
    }

    // returns the json of the user
    getUser = async(userID:string): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/get?userID=${userID}`);
        return await this.checkData(response);
    }

    // userData needs to be a Json. Use the getJson function in User.ts
    addUser = async(userID:string, userData:string): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/add`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: userData
        });
        return await this.checkData(response);
    }

    updateUser = async(userID:string, name:string, value:string): Promise<any> => {
        const args = {userID:userID, fieldName:name, fieldValue:value};
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/updateField`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(args)
        });
        const data = await this.checkData(response)
        return data.success;
    }

    checkData = async(res:Response) => {
        let data;
        try {
            data = await this.requestPath(res);
        } catch (err:any) {
            alert(err.message);
        }
        return data;
    }

    requestPath = async (res: Response) => {
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
