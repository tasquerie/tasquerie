import e from "express";

export {}

const PORT_NUMBER: number = 3000;

export class BackendWrapper {

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
        return await this.requestPath(response);
    }

    login = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch(`http://localhost:${PORT_NUMBER}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({func: func, arg: args })
        });
        return await this.requestPath(response);
    }

    requestPath = async (response: Response) => {
        try{
            // let response = await fetch(`http://localhost:${PORT_NUMBER}/${area}?start=${func}&destination=${arg}`);
            if(!response.ok) {
                alert(`Status is wrong, expected 200, was ${response.status}`);
            }
            const responseBody = await response.json();
            // Error Case
            if (responseBody === "") {
                throw new Error("Invalid output");
            }
            // boolean caser
            else if (responseBody === "true" || responseBody === "false") {
                return responseBody === "true";
            }
            // JSON case 
            else {
                return responseBody;
            }
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
            throw new Error("Connection lost");
        }
    }
}
