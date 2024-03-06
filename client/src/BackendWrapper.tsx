import e from "express";

const PORT_NUMBER: number = 3000;

export class BackendWrapper {

    static view = async (func: string, args: Map<string, any>): Promise<any> => {
        let requestString: string = `http://localhost:${PORT_NUMBER}/view?func=${func}`;
        args.forEach((value: any, key: string) => {
            requestString += `&${key}=${value}`;
        });
        // console.log('attempting view backend call');
        // console.log(requestString);
        try{
            let response = await fetch(requestString);
            // console.log("after fetch");
            // console.log(response.status);
            return await BackendWrapper.getJson(response);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static controller = async (func: string, args: Map<string, any>): Promise<any> => {
        let requestString: string = `http://localhost:${PORT_NUMBER}/controller?func=${func}`;
        args.forEach((value: any, key: string) => {
            requestString += `&${key}=${value}`;
        });
        try {
            let response = await fetch(requestString, {method: 'POST'});
            return BackendWrapper.getJson(response);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static login = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch(`http://localhost:${PORT_NUMBER}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({func: func, arg: args })
        });
        return BackendWrapper.getJson(response);
    }

    static getJson = async (response: Response) => {
        console.log(response);
        let responseBody;
        try{
            // let response = await fetch(`http://localhost:${PORT_NUMBER}/${area}?start=${func}&destination=${arg}`);
            if(!response.ok) {
                // alert(`Status is wrong, expected 200, was ${response.status}`);
                // console.log("not 200 status");
                // console.log(response.status);
            }
            // console.log('attempting to extract json');
            // console.log(response);
            // let responseBody = await response.json();
            responseBody = await response.text(); // temp cuz responses are strings
            // const responseBody = await response.body;
            // responseBody = responseBody.data;
            // console.log('json extracted');
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
                return JSON.parse(responseBody);
            }
        } catch (e) {
            // alert("There was an error contacting the server.");
            // console.log("AAAAAAAAAA");
            console.log(responseBody);
            console.log(e);
            throw new Error("Connection lost");
            // console.log("error contacting server");
        }
    }
}
