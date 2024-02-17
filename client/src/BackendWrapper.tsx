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
            return await response.json();
        }
        catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
            throw new Error("Connection lost");
        }
    }
}
