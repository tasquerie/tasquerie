import e from "express";

export {}

const PORT_NUMBER: number = 3232;

class BackendWrapper {

    view = async (func: string, args: Map<string, any>): Promise<any> => {
        return await this.requestPath('view', func, args);
    }

    controller = async (func: string, args: Map<string, any>): Promise<any> => {
        return await this.requestPath('controller', func, args);
    }

    login = async (func: string, args: Map<string, any>): Promise<any> => {
        return await this.requestPath('login', func, args);
    }

    requestPath = async (area: string, start: string, dest: Map<string, any>) => {
        try{
            let response = await fetch(`http://localhost:${PORT_NUMBER}/${area}?start=${start}&destination=${dest}`);
            if(!response.ok) {
                alert(`Status is wrong, expected 200, was ${response.status}`);
            }
            const responseBody = await response.json();
            
            if (typeof responseBody === 'string' ) {
                if (responseBody === "") {
                    throw new Error("View does not exist");
                }
                else if (responseBody === "true" || responseBody === "false") {
                    return responseBody === "true";
                }
                else {
                    return responseBody;
                }
            }
            else if (typeof responseBody === 'object') {
                if ('userID' in responseBody) {
                    return responseBody.userID;
                }
                else if ('taskFolderInfo' in responseBody) {
                    return responseBody.taskFolderInfo;
                } 
                else {
                    return responseBody;
                }
            }
            else {
                throw new Error("Invalid format");
            }
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
            throw new Error("Connection lost");
        }
    }
}
