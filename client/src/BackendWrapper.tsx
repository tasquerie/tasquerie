import e from "express";

export {}

const PORT_NUMBER: number = 3232;

class BackendWrapper {

    view = async (func: string, args: Map<string, any>): Promise<any> => {
        return await this.requestPath('view', func, args);
    }

    controller = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch('http://localhost:4567/findroute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ start: func, destination: args })
        });
    }

    login = async (func: string, args: Map<string, any>): Promise<any> => {
        let response = await fetch('http://localhost:4567/findroute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ start: func, destination: args })
        });
    }

    requestPath = async (area: string, start: string, dest: Map<string, any>) => {
        try{
            let response = await fetch(`http://localhost:${PORT_NUMBER}/${area}?start=${start}&destination=${dest}`);
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
