import e from "express";

export {}

const PORT_NUMBER: number = 3232;

class BackendWrapper {

    getAllTask = async(userID:string): Promise<any> => {
        let response = await fetch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/getAllTask/${userID}`);
        let data;
        try {
            data = await this.requestPath(response);
        } catch (err:any) {
            alert(err.message);
        }
        return data.tasks;
    }

    view = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch(`http://localhost:${PORT_NUMBER}/view?start=${func}&destination=${args}`);
        return await this.requestPath(response);
    }

    controller = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch(`http://localhost:${PORT_NUMBER}/controller`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ func: func, arg: args })
        });
        return this.requestPath(response);
    }

    login = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch(`http://localhost:${PORT_NUMBER}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({func: func, arg: args })
        });
        return this.requestPath(response);
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
